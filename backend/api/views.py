# These libraries are used by Django for rendering your pages.
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

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


def lemmatizer_initialize():
    """
    Algorithm that reduces words to their base or canonical form
    """
    lemmatizer = WordNetLemmatizer()
    return lemmatizer


def load_words_pkl():
    """
    Loading words pickle file
    """
    file_path = os.path.join(os.path.dirname(__file__), "words.pkl")

    with open(file_path, "rb") as file:
        words = pickle.load(file)

    return words


def load_classes_pkl():
    """
    Loading classes pickle file
    """
    file_path = os.path.join(os.path.dirname(__file__), "classes.pkl")

    with open(file_path, "rb") as file_classes:
        classes = pickle.load(file_classes)

    return classes


def load_intents():
    """
    Loading JSON file with conversational speech and responses
    """
    file_path = os.path.join(os.path.dirname(__file__), "intent_english.json")
    
    with open(file_path, "r") as file:
        intents = json.load(file)
    return intents

@api_view(["GET"])
def training(request):
    """
    Training the NLP model
    """
    intents = load_intents()
    lemmatizer = WordNetLemmatizer()

    words = []
    classes = []
    documents = []
    ignore_letters = ["?", "!", ".", ",", "(", ")"]

    
    for intent in intents["intents"]:
        for pattern in intent["patterns"]:

            word_list = nltk.word_tokenize(pattern) # Split pattern sentence into individual words or tokens
            words.extend(word_list) # Taking the content and appending it to the list
            documents.append((word_list, intent["tag"]))

            if (intent["tag"] not in classes):
                classes.append(intent["tag"])

    # Lemmatizing & cleaning up the data
    words = [lemmatizer.lemmatize(word) for word in words if word not in ignore_letters] # Algorithm that reduces words from the words list created to their base or canonical form
    words = sorted(set(words)) # Sort an eliminate duplicates
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

    random.shuffle(training)
    training = np.asarray(training, dtype="object")

    train_x = list(training[:, 0])
    train_y = list(training[:, 1])

    model = Sequential()

    model.add(Dense(128, input_shape=(len(train_x[0]),), activation="relu")) # Layer 1 - 128 neurons, shape of layer is the shape of the input data, activation function of Rectified Linear Unit (ReLU)
    model.add(Dropout(0.5)) # Dropout Layer to reduce overfitting by preventing any single neuron from becoming overly specialized and dependent on specific input features
    model.add(Dense(64, activation="relu")) # Layer 2 - 64 neurons, activation function of Rectified Linear Unit (ReLU)
    model.add(Dense(32, activation="relu")) # Layer 3 - 32 neurons, activation function of Rectified Linear Unit (ReLU)
    model.add(Dropout(0.5))
    model.add(Dense(len(train_y[0]), activation="softmax")) # Layer 4 - (len of tarin_y) = # of neurons and activation function softmax


    sgd = SGD(learning_rate=0.01, momentum=0.9, nesterov=True)
    model.compile(loss=tf.keras.losses.CategoricalCrossentropy(), optimizer=sgd, metrics=["accuracy"])
    hist = model.fit(np.array(train_x), np.array(train_y), epochs=200, batch_size=5, verbose=1)

    model.save("/api/chatbotmodel.h5", hist)

    return HttpResponse("Created words.pkl.<br>Created classes.pkl.<br>Saved NLP Model (chatbotmodel.h5).<br>Training of the NLP Model Completed!")


def cleaning_up_sentence(sentence):
    """
    Function for cleaning up the sentences
    """
    lemmatizer = lemmatizer_initialize()

    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words] # For each word reduce to its base form
    return sentence_words


def bag_of_words(sentence):
    """
    Function for bag-of-words, a representation of text that describes the occurrence of words within the sentence
    """
    words = load_words_pkl()
    sentence_words = cleaning_up_sentence(sentence)
    bag = [0] * len(words)

    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    
    return np.array(bag)                          


def predict_class(sentence):
    """
    Function for predicting
    """
    classes = load_classes_pkl()
    file_path = os.path.join(os.path.dirname(__file__), "chatbotmodel.h5")
    model = load_model(file_path)

    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]

    ERROR_THRESHOLD = 0.25
    result = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD] # If r is greater than the error threshold, get the index and the response probability to make into a list item

    result.sort(key = lambda x: x[1], reverse = True)
    return_list = []             

    for r in result:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})

    return return_list


def get_response(intents_list, intents_json):
    """
    Function for getting response. It checks which intent from our provided intents matches most closely with the given one and randomly chooses a response
    """
    tag = intents_list[0]["intent"]
    list_of_intents = intents_json["intents"]

    for i in list_of_intents:
        if i["tag"] == tag:
            result = random.choice(i["responses"])
            break  
    
    return result


def capture_and_recognize(request):
    """
    Initialize recognizer class (for recognizing the speech)
    """
    if request.method == "GET":
        r = sr.Recognizer()
        with sr.Microphone() as source:
            audio_text = r.listen(source)

            try:
                # Using Google speech recognition
                text_en = r.recognize_google(audio_text)
                text_fr = r.recognize_google(audio_text, language="fr-FR")
                text_es = r.recognize_google(audio_text, language="es-AR")

                return (text_en, text_fr, text_es)

            except sr.UnknownValueError:
                details = {"User_Request": " ",
                           "Chatbot_Response": "No audio input given. Please press the button to speak to BabelBot!"}
                return render(request,"kiosk.html", details)
            
            except sr.RequestError as e:
                details = {"User_Request": " ",
                           "Chatbot_Response": f"Could not request results from Google Speech Recognition service; {e}"}
                return render(request,"kiosk.html", details)
            
    return HttpResponse("Method Not Allowed")


def lang_detect(response1, response2, response3):
    """
    Function for detecting the language and its probability
    ie. [["es:0.9999932356592219"], ["es:0.9999941641326395"], ["es:0.999996766257174"], ["ne:0.5714284946155643", "hi:0.4285697429223616"]]
    """
    language_prob = []

    # Make into string elements for data cleaning in all 3 languages
    detect_en = [str(i) for i in detect_langs(response1)]
    language_prob.extend(detect_en)

    detect_fr = [str(i) for i in detect_langs(response2)]
    language_prob.extend(detect_fr)

    detect_es = [str(i) for i in detect_langs(response3)]
    language_prob.extend(detect_es)

    return list(language_prob)


def lang_prob(lang_probability):
    """
    Function for seperating the probability and language codes
    """
    language_code = []

    # Seperate probs and language codes into 2 lists
    for i in range(0, len(lang_probability)):
        code = lang_probability[i][0:2]
        language_code.append(code)
        lang_probability[i] = lang_probability[i][3:]

    # Flatten list
    probs = [float(i) for i in lang_probability]

    return language_code, probs


def ISO_639(langauge_code, probability):
    """
    Function to get the language ISO
    """
    lang_counter = Counter(langauge_code)

    test_val = list(lang_counter.values())[0]
    res = True
    
    for i in lang_counter:
        if lang_counter[i] != test_val:
            res = False
            break

    if res == True:
        d = defaultdict(list)
        for key, value in zip(langauge_code, probability):
            d[key].append(value)

        mean_probs = {key: np.mean(val) for key, val in dict(d).items()}

        ISO_639_2 = str(max(mean_probs, key = mean_probs.get))

    else:
        ISO_639_2 = max(lang_counter, key = lang_counter.get)
    
    return ISO_639_2


def exit_input(message):
    if message.lower() == "exit please":
        return 1
    return 0


def speak_response(lang_ISO, res_en2lang, lang_voice):
    """
    Translate audio response into different languages
    """
    if lang_ISO in lang_voice:
        engine = pyttsx3.init()
        if lang_ISO == "es":
            engine.setProperty("rate", 150)  # Speed of speech (words per minute)
        voices = engine.getProperty("voices")
        engine.setProperty("voice", voices[lang_voice[lang_ISO]].id)
        engine.say(res_en2lang)
        engine.runAndWait()

    # else:
    #     engine = pyttsx3.init()
    #     voices = engine.getProperty("voices")
    #     engine.setProperty("voice", voices[lang_voice[1]].id)
    #     engine.say("Language not in the system. Please try again in English, French or Spnaish.")
    #     engine.runAndWait()


@api_view(["GET"])
def main(request):

    lang_voice = {"en": 1, "es": 2, "fr": 3}

    intents = load_intents()

    try:
        English, French, Spanish = capture_and_recognize(request)

    except:
        details = {"User_Request": " ",
                   "Chatbot_Response": "Invalid audio input given. Please press the button to speak to BabelBot!"}
        
        lang_ISO = "en"
        res_en2lang = "Invalid audio input given. Please press the button to speak to BabelBot!"
        speak_response(lang_ISO, res_en2lang, lang_voice)

        return render(request,"kiosk.html", details)
    
    possible_langs = lang_detect(English, French, Spanish)
    lang_list, prob_list = lang_prob(possible_langs)
    lang_ISO = ISO_639(lang_list, prob_list)

    lang_map = {"en": English, "es": Spanish, "fr": French}

    try:
        if lang_ISO in lang_map:
            message = lang_map[lang_ISO]

            translator_lang2en = GoogleTranslator(source = "auto", target = "en")
            lang2en = translator_lang2en.translate(message)

            if exit_input(message) == 1:
                details = {"User_Request": message,
                           "Chatbot_Response": "Successfully exited BabelBot!"}
                
                lang_ISO = "en"
                res_en2lang = "Successfully exited BabelBot!"
                speak_response(lang_ISO, res_en2lang, lang_voice)

                return render(request,"kiosk.html", details)
            
            ints = predict_class(lang2en)
            res = get_response(ints, intents)
            translator_en2lang = GoogleTranslator(source = "auto", target = lang_ISO)
            res_en2lang = translator_en2lang.translate(res)
            details = {"User_Request": message,
                       "Chatbot_Response": res_en2lang}
            
            speak_response(lang_ISO, res_en2lang, lang_voice)

    except ValueError:
        return HttpResponse("Could not understand audio. Please press the button again to try again!")

    return render(request,"kiosk.html", details)


@api_view(["GET"])
def test(request):
    print(request.data)
    return Response({"message": "Hello World"})