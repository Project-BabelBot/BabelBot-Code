import os
from django.test import TestCase
from api.model_functions import capture_and_recognize, lang_detect, lang_prob, ISO_639


class LanguageIdentificationTestCase(TestCase):

    def test_language_identification_accuracy(self):
        audio_files_directory = 'D:/OneDrive/OneDrive - University of Calgary/Fall 2023/Audio_Files'
        correct_predictions = 0
        total_files = 0

        for filename in os.listdir(audio_files_directory):
            if filename.endswith('.wav'):
                total_files += 1
                filepath = os.path.join(audio_files_directory, filename)

                # Create a mock request object with a 'GET' method attribute
                mock_request = MockRequest()

                try:
                    # Call the capture_and_recognize function with the mock request object
                    text_en, text_fr, text_es = capture_and_recognize(
                        mock_request, filepath)

                    # Detect language and probability for each response
                    lang_probabilities = lang_detect(text_en, text_fr, text_es)

                    # Separate language codes and probabilities
                    language_codes, probabilities = lang_prob(
                        lang_probabilities)

                    # Get the language with the highest probability
                    predicted_language = ISO_639(language_codes, probabilities)

                    # Compare the predicted language with the actual language from filenames
                    actual_language = self.extract_language_from_filename(
                        filename)

                    # Print the file name and predicted language
                    print(f"File: {filename}")
                    print(f"Predicted Language: {predicted_language}")
                    print("=" * 30)

                    if predicted_language == actual_language:
                        correct_predictions += 1
                except ValueError as e:
                    # Handle errors gracefully
                    print(
                        f"Recognition failed for file: {filename}. Error: {e}")

        accuracy = correct_predictions / total_files if total_files > 0 else 0

        # Print accuracy
        print(f"Accuracy: {accuracy * 100}%")

    def extract_language_from_filename(self, filename):
        return filename.split('_')[0]  # filenames are like 'en_audio.mp3'


class MockRequest:
    def __init__(self):
        self.method = 'GET'
