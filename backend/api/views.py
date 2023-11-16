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
# nltk.download('all')
nltk.download('punkt')
from nltk.stem import WordNetLemmatizer

import tensorflow as tf
from tensorflow import keras
from keras.models import load_model, Sequential
from keras.layers import Dense, Dropout
from keras.optimizers import SGD

from deep_translator import GoogleTranslator

import pyttsx3


'''
NLTK - Natural Language Toolkit

Purpose of facilitating natural language processing (NLP) tasks by providing a 
comprehensive set of tools and resources for working with human language data in Python.
'''

'''
Algorithm that reduces words to their base or canonical form
'''
def lemmatizer_initialize():
    lemmatizer = WordNetLemmatizer()
    return lemmatizer

'''
Loading Words pickle file
'''
def load_words_pkl():
    file_path = os.path.join(os.path.dirname(__file__), 'words.pkl')

    with open(file_path, 'rb') as file:
        words = pickle.load(file)

    return words

'''
Loading Classes pickle file
'''
def load_classes_pkl():
    file_path = os.path.join(os.path.dirname(__file__), 'classes.pkl')

    with open(file_path, 'rb') as file_classes:
        classes = pickle.load(file_classes)

    return classes

'''
Loading JSON file with conversational speech and responses
'''
def load_intents():
    file_path = os.path.join(os.path.dirname(__file__), 'intent_english.json')
    
    with open(file_path, 'r') as file:
        intents = json.load(file)
    return intents

'''
Purpose: Training the NLP Model  
'''
def training():
    intents = load_intents()            # Loading JSON file with conversational speech and responses

    lemmatizer = WordNetLemmatizer()    # Algorithm that reduces words to their base or canonical form

    # Empty Lists
    words = []
    classes = []
    documents = []
    ignore_letters = ["?", "!", ".", ",", "(", ")"]

    '''
    Purpose: Get the all contents of the JSON file,  
    '''
    for intent in intents["intents"]:                       # Get all contents of JSON file
        for pattern in intent["patterns"]:                  # Get the pattern

            word_list = nltk.word_tokenize(pattern)         # Split pattern sentence into individual words or tokens
            words.extend(word_list)                         # Taking the content and appending it to the list
            documents.append((word_list, intent["tag"]))    # Tuple with the tokenized pattern sentence as a list, with get the tag associated

            if (intent["tag"] not in classes):              # If the tag is not already in classes List add the tag to the classes list
                classes.append(intent["tag"])               # classes list = Tags List

    # Lemmatizing the Data & Cleaning Up the Data
    words = [lemmatizer.lemmatize(word) for word in words if word not in ignore_letters]    # Algorithm that reduces words from the words list created, to their base or canonical form
    words = sorted(set(words))                                                              # Set eliminates duplicates and sorted turns it back into a list and sorts it - Words List
    classes = sorted(set(classes))                                                          # Set eliminates duplicates and sorted turns it back into a list and sorts it - Classes List

    pickle.dump(words, open("words.pkl", "wb"))         # Save Words list as a pickle file
    pickle.dump(classes, open("classes.pkl", "wb"))     # Save Classes list as a pickle file

    training = []
    output_empty = [0] * len(classes)

    for document in documents:
        bag = []
        word_patterns = document[0]                                                     # Get the tokenized pattern sentence from the document tuple
        word_patterns = [lemmatizer.lemmatize(word.lower()) for word in word_patterns]  # Make the tokenized pattern sentence lowercase (normalize)

        for word in words:
            bag.append(1) if word in word_patterns else bag.append(0)                   # If the word in the words list is in the word_patterns list, append 1 to list bag or else 0

        output_row = list(output_empty)                 
        output_row[classes.index(document[1])] = 1      # This creates a one-hot encoded representation of the class/tag label

        training.append([bag, output_row])              # Append list with bag list and output list to empty training list

    random.shuffle(training)                            # Shuffle or randomize the order of elements in the training list
    training = np.asarray(training, dtype="object")     # Into an array

    train_x = list(training[:, 0])      # Get first column - bag list
    train_y = list(training[:, 1])      # Get second column - output_row list

    model = Sequential()                # A new instance of a Sequential model

    model.add(Dense(128, input_shape=(len(train_x[0]),), activation="relu"))    # Layer 1 - 128 neurons, shape of layer is the shape of the input data, activation function of Rectified Linear Unit (ReLU)
    model.add(Dropout(0.5))                                                     # Dropout Layer to reduce overfitting  by preventing any single neuron from becoming overly specialized and dependent on specific input features
                                                                                # Dropout Rate of 0.5, approx. 50% of the input neurons in the dropout layer will be set to 0 at each update
    model.add(Dense(64, activation="relu"))                                     # Layer 2 - 64 neurons, activation function of Rectified Linear Unit (ReLU)
    model.add(Dense(32, activation="relu"))                                     # Layer 3 - 32 neurons, activation function of Rectified Linear Unit (ReLU)
    model.add(Dropout(0.5))                                                     # Dropout Rate of 0.5, approx. 50% of the input neurons in the dropout layer will be set to 0 at each update
    model.add(Dense(len(train_y[0]), activation="softmax"))                     # Layer 4 - (len of tarin_y) = # of neurons and activation function softmax
                                                                                # Softmax - squashes the raw output scores of the neurons into probabilities, where each neuron's output represents the probability of belonging to a particular class
    '''
    Stochastic Gradient Descent (SGD) optimizer
    Learning Rate - the step size at which the optimizer updates the model's weights during training (0.01)
    Momentum - 90% of the previous weight update is retained and added to the current update. This helps the optimizer maintain direction and speed during training
    Nesterov - Nesterov Accelerated Gradient (NAG) adjusts the way the momentum term is applied, making it more accurate and often leading to faster convergence
    '''
    sgd = SGD(learning_rate=0.01, momentum=0.9, nesterov=True)
    '''
    Loss function measures the dissimilarity between the true class labels and the predicted probabilities for each class
    SGD optimizer for training the model
    Metrics measures the proportion of correctly classified examples in the validation set during training
    '''                              
    model.compile(loss=tf.keras.losses.CategoricalCrossentropy(), optimizer=sgd, metrics=["accuracy"])
    '''
    Epochs - 200 complete pass through of the entire training dataset
    Updating the weights after processing batches of 5, mini-batch training is a common practice as it can lead to more stable convergence and efficient training
    Verbose - controls the level of logging or output during training, a value of 1 means you will see progress bars and training metrics (e.g., loss and accuracy) for each epoch
    '''
    hist = model.fit(np.array(train_x), np.array(train_y), epochs=200, batch_size=5, verbose=1)

    model.save("chatbotmodel.h5", hist)

    return HttpResponse('Created words.pkl.<br>Created classes.pkl.<br>Saved NLP Model (chatbotmodel.h5).<br>Training of the NLP Model Completed!')

'''
Chatbot Functions
'''

'''
Function for Cleaning Up the Sentences
'''
def cleaning_up_sentence(sentence):
    lemmatizer = lemmatizer_initialize()

    sentence_words = nltk.word_tokenize(sentence)                               # splits a given sentence into words                            
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]    # for each word reduce to its base form
    return sentence_words                                                       

'''
Function for Bag-of-Words
A representation of text that describes the occurrence of words within the sentence
'''
def bag_of_words(sentence):                             
    words = load_words_pkl()
    sentence_words = cleaning_up_sentence(sentence)     # Go to the function above to get a list of words reduced to its base form
    bag = [0] * len(words)                              

    for w in sentence_words:                            # for word in list of words reduced to its base form 
        for i, word in enumerate(words):                # i = iteration, w = list element (word)
            if word == w:                               # if the words in both lists match
                bag[i] = 1                              # change particular index in bag from 0 to 1
    
    return np.array(bag)                                

'''
Function for Predicting
'''
def predict_class(sentence):
    classes = load_classes_pkl()
    file_path = os.path.join(os.path.dirname(__file__), 'chatbotmodel.h5')
    model = load_model(file_path)

    bow = bag_of_words(sentence)                                                    # Go to the function above to get a representation of text that describes the occurrence of words within the sentence
    res = model.predict(np.array([bow]))[0]                                         # Based of the array of bag-of-words get the model to predict the response

    ERROR_THRESHOLD = 0.25
    result = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]             # If r is greater than the error threshold, get the index and the response probability and make into a list item

    result.sort(key = lambda x: x[1], reverse = True)                               # Sort the list from highest probability first
    return_list = []                                                            

    for r in result:                                                                # For each potential result in result list
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})     # Get the tag (from .json file) and the probability of the response and append as list item to the empty list created above

    return return_list                                                              # Return the list with tag and probability

'''
Function for Getting Response
'''
def get_response(intents_list, intents_json):           # Get the list with tag and probability & the .json file
    tag = intents_list[0]['intent']                     # Get the tag of the first element of the list with tag and prob.
    list_of_intents = intents_json['intents']           # Get the contents of the .json that fall under intents (basically all the info comprised within)

    for i in list_of_intents:                           # Go section by section
        if i['tag'] == tag:                             # If tag matches the one found above in the first element of the list with tag and prob
            result = random.choice(i['responses'])      # Randomly choose a response from that tag section
            break                                   
    
    return result                                       # Return the randomly choosen response

'''
Function: Initialize recognizer class (for recognizing the speech)
'''
def capture_and_recognize(request):
    if request.method == 'GET':
        r = sr.Recognizer()
        with sr.Microphone() as source:
            audio_text = r.listen(source)

            # recoginize_() method will throw a request error if the API is unreachable, hence using exception handling
            try:
                # Using Google speech recognition
                text_en = r.recognize_google(audio_text)
                # Adding French language option
                text_fr = r.recognize_google(audio_text, language="fr-FR")
                # Adding Spanish language option
                text_es = r.recognize_google(audio_text, language="es-AR")

                return (text_en, text_fr, text_es)

            except sr.UnknownValueError:
                return HttpResponse("Could not understand audio. Please press the button again to try again!")
            
            except sr.RequestError as e:
                return HttpResponse(f"Could not request results from Google Speech Recognition service; {e}")
            
    return HttpResponse("Method Not Allowed")

'''
Function for Detecting the Language and its Probability
ie. [['es:0.9999932356592219'], ['es:0.9999941641326395'], ['es:0.999996766257174'], ['ne:0.5714284946155643', 'hi:0.4285697429223616']]
'''
def lang_detect(response1, response2, response3):
    language_prob = []

    # Make into string elements for data cleaning - English
    detect_en = [str(i) for i in detect_langs(response1)]
    language_prob.extend(detect_en)

    # Make into string elements for data cleaning - French
    detect_fr = [str(i) for i in detect_langs(response2)]
    language_prob.extend(detect_fr)

    # Make into string elements for data cleaning - Spanish
    detect_es = [str(i) for i in detect_langs(response3)]
    language_prob.extend(detect_es)

    return list(language_prob)

'''
Function for seperating the Probability and Language Codes
'''
def lang_prob(lang_probability):
    language_code = []

    # Seperate Probs and Language Codes into 2 lists
    for i in range(0, len(lang_probability)):         
        code = lang_probability[i][0:2]
        language_code.append(code)
        # Language Probability
        lang_probability[i] = lang_probability[i][3:]
    
    # Make into One List instead of Lists of Lists
    probs = [float(i) for i in lang_probability]

    return language_code, probs

'''
Function to get the Language ISO
'''
def ISO_639(langauge_code, probability):
    lang_counter = Counter(langauge_code)

    test_val = list(lang_counter.values())[0]                               # extracting value to compare
    res = True
    
    for i in lang_counter:
        if lang_counter[i] != test_val:
            res = False
            break

    if res == True:
        d = defaultdict(list)
        for key, value in zip(langauge_code, probability):
            d[key].append(value)

        mean_probs = {key: np.mean(val) for key, val in dict(d).items()}    # Value list mean

        ISO_639_2 = str(max(mean_probs, key = mean_probs.get))

    else:
        ISO_639_2 = max(lang_counter, key = lang_counter.get)
    
    return ISO_639_2

def exit_input(message):
    if message.lower() == 'exit please':
        return 1
    return 0

'''
Main Function
'''
@api_view(["GET"])
# When the button is pressed
def main(request):

    intents = load_intents()

    try:
        English, French, Spanish = capture_and_recognize(request)
    except:
        details = {
                "User_Request": ' ',
                "Chatbot_Response": 'No audio input given. Please press the button to speak to BabelBot!'
                }
        return render(request,"kiosk.html", details)
    
    possible_langs = lang_detect(English, French, Spanish)
    lang_list, prob_list = lang_prob(possible_langs)
    lang_ISO = ISO_639(lang_list, prob_list)

    lang_map = {'en': English, 'es': Spanish, 'fr': French}
    lang_voice = {'en': 1, 'es': 2, 'fr': 3}

    try:
        if lang_ISO in lang_map:
            message = lang_map[lang_ISO]

            translator_lang2en = GoogleTranslator(source = 'auto', target = 'en')
            lang2en = translator_lang2en.translate(message)

            if exit_input(message) == 1:
                details = {
                    "User_Request": message,
                    "Chatbot_Response": 'Successfully existed BabelBot!'
                    }
                return render(request,"kiosk.html", details)
            
            ints = predict_class(lang2en)
            res = get_response(ints, intents)
            translator_en2lang = GoogleTranslator(source = 'auto', target = lang_ISO)
            res_en2lang = translator_en2lang.translate(res)
            details = {
                "User_Request": message,
                "Chatbot_Response": res_en2lang
                }
            
            if lang_ISO in lang_voice:
                engine = pyttsx3.init()
                if lang_ISO == 'es':
                    engine.setProperty('rate', 125)  # Speed of speech (words per minute)
                voices = engine.getProperty('voices')
                engine.setProperty('voice', voices[lang_voice[lang_ISO]].id)
                engine.say(res_en2lang)
                engine.runAndWait()


    #     if lang_ISO == 'en':
    #         message = English
            
    #         if exit_input(message) == 1:
    #             details = {
    #             "User_Request": message,
    #             "Chatbot_Response": 'Successfully existed BabelBot!'
    #             }
    #             return render(request,"kiosk.html", details)
            
    #         # if message == 'exit please':
    #         #     details = {"User_Request": 'User has exited BableBot. Please press the button to speak to BabelBot!'}
    #         #     quit

    #         time.sleep(1)

    #         # Speak response out loud in English
    #         ints = predict_class(message)
    #         res = get_response(ints, intents)
    #         details = {
    #             "User_Request": English,
    #             "Chatbot_Response": res
    #             }
            
    #         engine = pyttsx3.init()
    #         voices = engine.getProperty('voices')
    #         engine.setProperty('voice', voices[1].id)
    #         engine.say(res)
    #         engine.runAndWait()

    #     elif lang_ISO == 'fr':
    #         message = French

    #         time.sleep(1)

    #         translator_fr2en = GoogleTranslator(source = 'auto', target = 'en')
    #         fr2en = translator_fr2en.translate(message)

    #         if exit_input(fr2en) == 1:
    #             details = {
    #             "User_Request": message,
    #             "Chatbot_Response": 'Successfully existed BabelBot!'
    #             }
    #             return render(request,"kiosk.html", details)
            
    #         ints = predict_class(fr2en)
    #         res = get_response(ints, intents)
    #         translator_en2fr = GoogleTranslator(source = 'auto', target = 'fr')
    #         res_en2fr = translator_en2fr.translate(res)
    #         details = {
    #             "User_Request": French,
    #             "Chatbot_Response": res_en2fr
    #             }
            
    #         # Speak response out loud in French
    #         engine = pyttsx3.init()
    #         voices = engine.getProperty('voices')
    #         engine.setProperty('voice', voices[3].id)
    #         engine.say(res_en2fr)
    #         engine.runAndWait()


    #     elif lang_ISO == 'es':
    #         message = Spanish

    #         time.sleep(1)

    #         translator_es2en = GoogleTranslator(source = 'auto', target = 'en')
    #         es2en = translator_es2en.translate(message)

    #         if exit_input(es2en) == 1:
    #             details = {
    #             "User_Request": message,
    #             "Chatbot_Response": 'Successfully existed BabelBot!'
    #             }
    #             return render(request,"kiosk.html", details)
            
    #         ints = predict_class(es2en)
    #         res = get_response(ints, intents)
    #         translator_en2es = GoogleTranslator(source = 'auto', target = 'es')
    #         res_en2es = translator_en2es.translate(res)
    #         details = {
    #             "User_Request": Spanish,
    #             "Chatbot_Response": res_en2es
    #             }
            
    #         # Speak response out loud in Spanish
    #         engine = pyttsx3.init()
    #         voices = engine.getProperty('voices')
    #         engine.setProperty('voice', voices[2].id)
    #         engine.say(res_en2es)
    #         engine.runAndWait()
    
        else:
            return HttpResponse("Could not understand audio. Please press the button again to try again!")

    except ValueError:
            return HttpResponse("Could not understand audio. Please press the button again to try again!")

    return render(request,"kiosk.html", details)

# Test API
@api_view(["GET"])
def test(request):
    print(request.data)
    return Response({"message": "Hello World"})