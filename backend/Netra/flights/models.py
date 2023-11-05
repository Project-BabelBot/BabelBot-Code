from django.db import models

# Create your models here.

from django.db import models
import pandas as pd

# Replace 'your_excel_file.xlsx' with the actual path to your Excel file.
data = pd.read_excel(r"C:\SD_Card\Django_venv\flights\flight_details.xlsx")

# Display the data to ensure it's read correctly.


class Flight(models.Model):
    flight_number = models.CharField(max_length=10)
    airline_name = models.CharField(
        max_length=100, default="Unknown Airline")  # Provide a default value
    airline_code = models.CharField(max_length=10, default="UNKNOWN")
    city = models.CharField(max_length=100)
    departure_time = models.TimeField()
    gate = models.CharField(max_length=10)
