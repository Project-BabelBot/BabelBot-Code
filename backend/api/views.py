# These libraries are used by Django for rendering your pages.
from django.http import HttpResponse
from django.shortcuts import render
from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .forms import FlightSearchForm
from .models import Flight
from .model_functions import *

from io import BytesIO
from datetime import datetime

import numpy as np
import random
import os
import pickle

import nltk
nltk.download("punkt")
nltk.download('wordnet')
from nltk.stem import WordNetLemmatizer

import tensorflow as tf
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense, Dropout
from keras.optimizers import SGD

from deep_translator import GoogleTranslator

import speech_recognition as sr

ERROR_MESSAGES = [
  "Sorry, I didn't quite get that. Could you please try again?",
  "There was an issue processing your request. Please try again!",
  "I'm sorry, I didn't quite understand, can you please repeat that?",
  "Oops! Something went wrong. Please feel free to try again!",
  "I couldn't quite hear you, can you please repeat that?",
  "Sorry, it was a bit hard to hear you, could you please try again?",
  "Sorry, I didn't catch what you said, can you please repeat that?",
]


@api_view(["GET"])
def training(request):
    """
    Training the NLP model.

    This function loads intents, preprocesses the data, trains an NLP model, and saves the model, along with related data files for use in our chatbot.

    Args:
        request: Django request object.

    Returns:
        HttpResponse: A response indicating the completion of the training process.
    """
    intents = load_intents()
    lemmatizer = WordNetLemmatizer()
    words = []
    classes = []
    documents = []
    ignore_letters = ["?", "!", ".", ",", "(", ")"]

    for intent in intents["intents"]:
        for pattern in intent["patterns"]:

            # Tokenize pattern sentence into individual words or tokens
            word_list = nltk.word_tokenize(pattern) # Split pattern sentence into individual words or tokens
            words.extend(word_list)
            documents.append((word_list, intent["tag"]))

            # Update classes list if not already present
            if (intent["tag"] not in classes):
                classes.append(intent["tag"])

    # Lemmatizing & cleaning up the data
    words = [lemmatizer.lemmatize(word) for word in words if word not in ignore_letters] # Algorithm that reduces words from the words list created to their base or canonical form

    # Sort and eliminate duplicates
    words = sorted(set(words))
    classes = sorted(set(classes))

    pickle.dump(words, open(os.path.join(os.path.dirname(__file__), "words.pkl"), "wb"))
    pickle.dump(classes, open(os.path.join(os.path.dirname(__file__), "classes.pkl"), "wb"))

    training = []
    output_empty = [0] * len(classes)

    for document in documents:
        bag = []
        word_patterns = document[0]
        word_patterns = [lemmatizer.lemmatize(word.lower()) for word in word_patterns] # Make the tokenized pattern sentence lowercase (normalize)

        for word in words:
            bag.append(1) if word in word_patterns else bag.append(0)

        output_row = list(output_empty)
        output_row[classes.index(document[1])] = 1 # This creates a one-hot encoded representation of the class/tag label

        training.append([bag, output_row])

    # Shuffle training data and convert to numpy array
    random.shuffle(training)
    training = np.asarray(training, dtype="object")

    # Split training data into features and labels
    train_x = list(training[:, 0])
    train_y = list(training[:, 1])

    # Build and compile the model
    model = Sequential()

    model.add(Dense(128, input_shape=(len(train_x[0]),), activation="relu")) # Layer 1 - 128 neurons, shape of layer is the shape of the input data, activation function of Rectified Linear Unit (ReLU)
    model.add(Dropout(0.5)) # Dropout Layer to reduce overfitting by preventing any single neuron from becoming overly specialized and dependent on specific input features
    model.add(Dense(64, activation="relu")) # Layer 2 - 64 neurons, activation function of Rectified Linear Unit (ReLU)
    model.add(Dense(32, activation="relu")) # Layer 3 - 32 neurons, activation function of Rectified Linear Unit (ReLU)
    model.add(Dropout(0.5))
    model.add(Dense(len(train_y[0]), activation="softmax")) # Layer 4 - (len of tarin_y) = # of neurons and activation function softmax

    sgd = SGD(learning_rate = 0.01, momentum = 0.9, nesterov = True)
    model.compile(loss=tf.keras.losses.CategoricalCrossentropy(), optimizer=sgd, metrics = ["accuracy"])
    model.fit(np.array(train_x), np.array(train_y), epochs = 200, batch_size = 5, verbose = 1)
    model.save("api/chatbotmodel.h5")

    return HttpResponse("Created words.pkl.<br>Created classes.pkl.<br>Saved NLP Model (chatbotmodel.h5).<br>Training of the NLP Model Completed!")


@api_view(["POST"])
def main(request):
    """
    Main - handling audio input, language detection, translation, and interaction with a chatbot.

    Requirements:
        - Django REST Framework
        - Your custom modules (e.g., load_intents, lang_detect, etc.)
        - External dependencies for language processing (e.g., nltk, tensorflow)

    Returns:
        HttpResponse: A response indicating the outcome of the chatbot interaction.
    """
    try:
        intents = load_intents()

        r = sr.Recognizer()
        
        input_audio = request.data['file']
        input_audio = input_audio.read()

        with sr.AudioFile(BytesIO(input_audio)) as source:
                audio = r.record(source)

        text_en = r.recognize_google(audio, language="en-US")
        text_fr = r.recognize_google(audio, language="fr-FR")
        text_es = r.recognize_google(audio, language="es-AR")
        
        # Detect possible languages from the captured audio
        possible_langs = lang_detect(text_en, text_fr, text_es)
        lang_list, prob_list = lang_prob(possible_langs)
        lang_ISO = ISO_639(lang_list, prob_list)
        lang_map = {"en": text_en, "es": text_es, "fr": text_fr}

        
        if lang_ISO in lang_map:
            message = lang_map[lang_ISO]
            message_time = datetime.now()

            user_query = {
                "content": message.capitalize(),
                "timestamp": message_time,
                "userIsSender": True,
            }
            
            # Translate the message to English
            translator_lang2en = GoogleTranslator(source = "auto", target = "en")
            lang2en = translator_lang2en.translate(message)

            ints = predict_class(lang2en)
            res = get_response(ints, intents)

            # Translate the response back to the original language
            translator_en2lang = GoogleTranslator(source = "auto", target = lang_ISO)
            res_en2lang = translator_en2lang.translate(res)

            bot_response = {
                "content": res_en2lang,
                "language": lang_ISO,
                "timestamp": datetime.now(),
                "userIsSender": False
            }
            response_data = {
                "userQuery": user_query,
                "botResponse": bot_response
            }
            
            return Response(response_data)
        
        else:
            raise AssertionError("Language not supported")

        
    except sr.UnknownValueError as e:
        print(type(e))
        print(e)
        error_response = {
            "content": random.choice(ERROR_MESSAGES),
            "error": True,
            "language": "en",
            "timestamp": datetime.now(),
            "userIsSender": False
        }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print(type(e))
        print(e)
        error_response = {
            "content": random.choice(ERROR_MESSAGES),
            "error": True,
            "language": "en",
            "timestamp": datetime.now(),
            "userIsSender": False
        }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
def text_nlp(request):
    try:
        input_text = request.data["textInput"]

        lang_ISO = "en"
        intents = load_intents()

        translator_lang2en = GoogleTranslator(source = "auto", target = "en")
        lang2en = translator_lang2en.translate(input_text)

        ints = predict_class(lang2en)
        res = get_response(ints, intents)

        # Translate the response back to the original language
        translator_en2lang = GoogleTranslator(source = "auto", target = lang_ISO)
        res_en2lang = translator_en2lang.translate(res)

        botResponse = {
            "content": res_en2lang,
            "language": lang_ISO,
            "timestamp": datetime.now(),
            "userIsSender": False
        } 
        
        return Response(botResponse)
    
    except Exception as e:
        print(e)
        error_response = {
            "content": random.choice(ERROR_MESSAGES),
            "error": True,
            "language": "en",
            "timestamp": datetime.now(),
            "userIsSender": False
        }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


def flight_search(request):
    cities = Flight.objects.values_list('city', flat=True).distinct()

    if request.method == 'POST':
        form = FlightSearchForm(request.POST)

        if form.is_valid():
            query = form.cleaned_data['query']
            city = form.cleaned_data['city']

            # Check if both flight number and city are selected
            if query and city:
                return render(request, 'search_results.html', {'message': 'Please select either Flight Number or City, not both.'})

            # Use Q objects to construct the query
            query_filter = Q()
            if query:
                query_filter |= Q(flight_number__icontains=query)
            if city:
                query_filter |= Q(city__iexact=city)

            # Apply the constructed query
            flights = Flight.objects.filter(query_filter)

            if flights:
                return render(request, 'search_results.html', {'flights': flights})
            else:
                return render(request, 'search_results.html', {'message': 'No flights found for the query.'})
        else:
            return render(request, 'search_results.html', {'message': 'Invalid search query.'})
    else:
        form = FlightSearchForm()
        return render(request, 'search_flight.html', {'form': form, 'cities': cities})