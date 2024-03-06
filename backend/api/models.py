from django.db import models

# Create your models here.
class Flight(models.Model):
    CITY_CHOICES = [
        ('Toronto', 'Toronto'),
        ('Victoria', 'Victoria'),
        ('Montreal', 'Montreal'),
        ('Prince George', 'Prince George'),
        ('Winnipeg', 'Winnipeg'),
        ('Kelowna', 'Kelowna'),
        ('Fort McMurray', 'Fort McMurray'),
        ('Edmonton', 'Edmonton'),
        ('Whitehorse', 'Whitehorse'),
        ('Saskatoon', 'Saskatoon'),
        ('Vancouver', 'Vancouver'),
        ('Ottawa', 'Ottawa'),
        ('Halifax', 'Halifax'),
        ('Yellowknife', 'Yellowknife'),
        ('Comox', 'Comox'),
        ('Grande Prairie', 'Grande Prairie'),
        ('Lethbridge', 'Lethbridge'),
        ('Kamloops', 'Kamloops'),
        ('Medicine Hat', 'Medicine Hat'),
    ]

    flight_number = models.CharField(max_length=10)
    airline_name = models.CharField(max_length=100, default="Unknown Airline")
    airline_code = models.CharField(max_length=10, default="UNKNOWN")
    city = models.CharField(max_length=100, choices=CITY_CHOICES)
    departure_time = models.TimeField()
    gate = models.CharField(max_length=10)
    airport_name = models.CharField(max_length=3, default="UNK") 