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


def cleaning_up_sentence(sentence):
    """
    Generate a bag-of-words representation of a sentence.
    """
    lemmatizer = lemmatizer_initialize()

    sentence_words = nltk.word_tokenize(sentence) # Tokenize the input sentence into individual words
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words] # Lemmatize each word in the sentence, reducing it to its base form
    return sentence_words


def bag_of_words(sentence):
    """
    Function for bag-of-words, a representation of text that describes the occurrence of words within the sentence
    """
    words = load_words_pkl() # Load the words from a pre-saved pickle file
    sentence_words = cleaning_up_sentence(sentence) # Clean up the sentence by lemmatizing and other necessary preprocessing
    bag = [0] * len(words) # Initialize a bag with zeros for each word in the vocabulary

    # For each word in the cleaned sentence, set the corresponding index in the bag to 1 if the word is present
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    
    # Convert the bag to a numpy array for compatibility with machine learning models
    return np.array(bag)                          


def predict_class(sentence):
    """
    Predict the class (intent) of a given sentence using a pre-trained model.
    """
    classes = load_classes_pkl()
    file_path = os.path.join(os.path.dirname(__file__), "chatbotmodel.h5")
    model = load_model(file_path)

    bow = bag_of_words(sentence) # Generate the bag-of-words representation for the input sentence

    res = model.predict(np.array([bow]))[0] # Make a prediction using the pre-trained model

    ERROR_THRESHOLD = 0.25 # Set an error threshold to filter out low-confidence predictions
    result = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD] # Filter predictions above the error threshold, sorting them by probability
    result.sort(key = lambda x: x[1], reverse = True)

    # Prepare the return list with intents and their probabilities  
    return_list = []           

    for r in result:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})

    return return_list 


def get_response(intents_list, intents_json):
    """
    Get a response based on the predicted intents list and the provided intents JSON.
    """
    tag = intents_list[0]["intent"] # Extract the predicted intent tag from the list
    list_of_intents = intents_json["intents"] # Get the list of intents from the provided JSON

    # Find the matching intent in the list
    for i in list_of_intents:
        if i["tag"] == tag:
            result = random.choice(i["responses"]) # Randomly choose a response from the matched intent's responses
            break  
    
    return result


def capture_and_recognize(request):
    """
    Capture audio using the microphone and recognize speech in English, French, and Spanish.
    """
    if request.method == "GET":
        r = sr.Recognizer() # Initialize the speech recognizer

        with sr.Microphone() as source: # Use the microphone as the audio source
            audio_text = r.listen(source) # Listen to the audio

            try:
                 # Recognize speech using Google Speech Recognition for English, French, and Spanish
                text_en = r.recognize_google(audio_text)
                text_fr = r.recognize_google(audio_text, language="fr-FR")
                text_es = r.recognize_google(audio_text, language="es-AR")

                return (text_en, text_fr, text_es) # Return recognized text in English, French, and Spanish

            except sr.UnknownValueError:
                 # Handle case where no speech is detected
                details = {"User_Request": " ",
                           "Chatbot_Response": "No audio input given. Please press the button to speak to BabelBot!"}
                return render(request,"kiosk.html", details)
            
            except sr.RequestError as e:
                # Handle case where there is an error with the speech recognition service
                details = {"User_Request": " ",
                           "Chatbot_Response": f"Could not request results from Google Speech Recognition service; {e}"}
                return render(request,"kiosk.html", details)
            
    return HttpResponse("Method Not Allowed") # Return a response for other request methods


def lang_detect(response1, response2, response3):
    """
    Detect the language and its probability for given responses.
    """
    language_prob = [] # Initialize an empty list to store language and probability pairs

    # Detect the language and its probability for the first response
    detect_en = [str(i) for i in detect_langs(response1)]
    language_prob.extend(detect_en)

    # Detect the language and its probability for the second response
    detect_fr = [str(i) for i in detect_langs(response2)]
    language_prob.extend(detect_fr)

    # Detect the language and its probability for the third response
    detect_es = [str(i) for i in detect_langs(response3)]
    language_prob.extend(detect_es)

    return list(language_prob)


def lang_prob(lang_probability):
    """
    Separate the probability and language codes from the input list.
    """
    language_code = []

     # Separate probabilities and language codes into two lists
    for i in range(0, len(lang_probability)):
        # Extract the language code from the input string
        code = lang_probability[i][0:2]
        language_code.append(code)

        lang_probability[i] = lang_probability[i][3:] # Update the input list to only contain probabilities

    probs = [float(i) for i in lang_probability] # Convert the list of probabilities to a list of floats

    return language_code, probs


def ISO_639(langauge_code, probability):
    """
    Get the language ISO code based on the language codes and their probabilities.
    """
    lang_counter = Counter(langauge_code) # Count occurrences of each language code

    # Check if all language codes have the same count
    test_val = list(lang_counter.values())[0]
    res = True

    # Checking if language code is within the list
    for i in lang_counter:
        if lang_counter[i] != test_val:
            res = False
            break

    # If all language codes have the same count, calculate the mean probability for each language
    if res == True:
        d = defaultdict(list)
        for key, value in zip(langauge_code, probability):
            d[key].append(value)

        mean_probs = {key: np.mean(val) for key, val in dict(d).items()}

        ISO_639_2 = str(max(mean_probs, key = mean_probs.get)) # Choose the language with the highest mean probability as the ISO code

    else:
        ISO_639_2 = max(lang_counter, key = lang_counter.get) # Choose the language with the highest count as the ISO code
    
    return ISO_639_2


def exit_input(message):
    if message.lower() == "exit please":
        return 1
    return 0


def speak_response(lang_ISO, res_en2lang, lang_voice):
    """
    Translate and speak the audio response in different languages.
    """
     # Check if the language ISO code has a corresponding voice index
    if lang_ISO in lang_voice:
        engine = pyttsx3.init() # Initialize the text-to-speech engine

        # Adjust speech rate for Spanish (you can customize this based on preferences)
        if lang_ISO == "es":
            engine.setProperty("rate", 150)  # Speed of speech (words per minute)

        voices = engine.getProperty("voices") # Get available voices
        engine.setProperty("voice", voices[lang_voice[lang_ISO]].id) # Set the voice based on the language ISO code
        engine.say(res_en2lang) # Speak the translated audio response
        engine.runAndWait() # Wait for the speech to finish

