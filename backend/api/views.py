# These libraries are used by Django for rendering your pages.
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .Functions import *

import numpy as np
import random
import os
import json
import pickle
import time

import speech_recognition as sr
from langdetect import detect_langs

from collections import defaultdict, Counter

import nltk
nltk.download("punkt")
from nltk.stem import WordNetLemmatizer

import tensorflow as tf
from tensorflow import keras
from keras.models import load_model, Sequential
from keras.layers import Dense, Dropout
from keras.optimizers import SGD

from deep_translator import GoogleTranslator

import pyttsx3


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
    # Load intents data
    intents = load_intents()

    # Initialize lemmatizer
    lemmatizer = WordNetLemmatizer()

    # Initialize lists and variables
    words = []
    classes = []
    documents = []
    ignore_letters = ["?", "!", ".", ",", "(", ")"]

    # Iterate through intents and patterns
    for intent in intents["intents"]:
        for pattern in intent["patterns"]:

            # Tokenize pattern sentence into individual words or tokens
            word_list = nltk.word_tokenize(pattern) # Split pattern sentence into individual words or tokens
            words.extend(word_list)                 # Taking the content and appending it to the list
            documents.append((word_list, intent["tag"]))

            # Update classes list if not already present
            if (intent["tag"] not in classes):
                classes.append(intent["tag"])

    # Lemmatizing & cleaning up the data
    words = [lemmatizer.lemmatize(word) for word in words if word not in ignore_letters] # Algorithm that reduces words from the words list created to their base or canonical form
    words = sorted(set(words)) # Sort an eliminate duplicates
    classes = sorted(set(classes))

    # Save words and classes to pickle files
    pickle.dump(words, open(os.path.join(os.path.dirname(__file__), "words.pkl"), "wb"))
    pickle.dump(classes, open(os.path.join(os.path.dirname(__file__), "classes.pkl"), "wb"))

    # Prepare training data
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
    model.add(Dropout(0.5))                                                  # Dropout Layer to reduce overfitting by preventing any single neuron from becoming overly specialized and dependent on specific input features
    model.add(Dense(64, activation="relu"))                                  # Layer 2 - 64 neurons, activation function of Rectified Linear Unit (ReLU)
    model.add(Dense(32, activation="relu"))                                  # Layer 3 - 32 neurons, activation function of Rectified Linear Unit (ReLU)
    model.add(Dropout(0.5))
    model.add(Dense(len(train_y[0]), activation="softmax"))                  # Layer 4 - (len of tarin_y) = # of neurons and activation function softmax

    sgd = SGD(learning_rate = 0.01, momentum = 0.9, nesterov = True)
    model.compile(loss=tf.keras.losses.CategoricalCrossentropy(), optimizer=sgd, metrics = ["accuracy"])

    # Train the model
    hist = model.fit(np.array(train_x), np.array(train_y), epochs = 200, batch_size = 5, verbose = 1)

    # Saving the trained model
    model.save("api/chatbotmodel.h5")

    return HttpResponse("Created words.pkl.<br>Created classes.pkl.<br>Saved NLP Model (chatbotmodel.h5).<br>Training of the NLP Model Completed!")


@api_view(["GET"])
def main(request):
    """
    Main - handling audio input, language detection, translation, and interaction with a chatbot.

    Requirements:
        - Django REST Framework
        - Your custom modules (e.g., load_intents, capture_and_recognize, lang_detect, etc.)
        - External dependencies for language processing (e.g., nltk, tensorflow)

    Returns:
        HttpResponse: A response indicating the outcome of the chatbot interaction.
    """

    # Mapping of language ISO codes to voice identifiers
    lang_voice = {"en": 1, "es": 2, "fr": 3}

    # Load chatbot intents
    intents = load_intents() 

    try:
        # Attempt to capture and recognize audio input in English, French, and Spanish
        English, French, Spanish = capture_and_recognize(request)

    except:
        # Handle invalid audio input
        details = {"User_Request": " ",
                   "Chatbot_Response": "Invalid audio input given/no audio input given. Please press the button to speak to BabelBot!"}
        lang_ISO = "en"
        res_en2lang = "Invalid audio input given/no audio input given. Please press the button to speak to BabelBot!"

        # Speak response and render the response in HTML
        speak_response(lang_ISO, res_en2lang, lang_voice)
        return render(request,"kiosk.html", details)
    
    # Detect possible languages from the captured audio
    possible_langs = lang_detect(English, French, Spanish)
    lang_list, prob_list = lang_prob(possible_langs)
    lang_ISO = ISO_639(lang_list, prob_list)
    
    # Mapping of language ISO codes to corresponding audio messages
    lang_map = {"en": English, "es": Spanish, "fr": French}

    try:
        if lang_ISO in lang_map:
            message = lang_map[lang_ISO]
           
            # Translate the message to English
            translator_lang2en = GoogleTranslator(source = "auto", target = "en")
            lang2en = translator_lang2en.translate(message)

            # Check if the user wants to exit
            if exit_input(message) == 1:
                details = {"User_Request": message,
                            "Chatbot_Response": "Successfully exited BabelBot!"}
                
                # Speak response and render the response in HTML
                lang_ISO = "en"
                res_en2lang = "Successfully exited BabelBot!"
                speak_response(lang_ISO, res_en2lang, lang_voice)
                return render(request,"kiosk.html", details)

            # Predict the class of the translated message
            ints = predict_class(lang2en)

            # Get a response based on the predicted class
            res = get_response(ints, intents)

            # Translate the response back to the original language
            translator_en2lang = GoogleTranslator(source = "auto", target = lang_ISO)
            res_en2lang = translator_en2lang.translate(res)

            # Prepare details for rendering in HTML
            details = {"User_Request": message,
                        "Chatbot_Response": res_en2lang}
            
            # Speak response and render the response in HTML
            speak_response(lang_ISO, res_en2lang, lang_voice)
            return render(request,"kiosk.html", details)
            
    except ValueError as e:
        print(f"Error: {e}")
        return HttpResponse("Could not understand audio. Please press the button again to try again!")



from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Q
from .forms import FlightSearchForm
from .models import Flight


def search_flight(request):
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