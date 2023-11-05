from django.core.management.base import BaseCommand
from flights.models import Flight
import pandas as pd
from django.utils import timezone


class Command(BaseCommand):
    help = 'Import flight data from an Excel file and populate the database.'

    def handle(self, *args, **options):
        # Replace 'your_excel_file.xlsx' with the actual path to your Excel file.
        data = pd.read_excel(
            r"C:\SD_Card\Django_venv\flights\flight_details.xlsx")

        for index, row in data.iterrows():
            flight_number = row['Flight Number']
            airline_name = row['Airline Name']
            airline_code = row['Airline Code']
            city = row['City']
            departure_time = row['Departure Time']
            gate = row['Gate']

            # Check if a flight with the same flight_number already exists
            existing_flight = Flight.objects.filter(
                flight_number=flight_number).first()

            if existing_flight:
                # Update the existing flight's fields if needed
                existing_flight.airline_name = airline_name
                existing_flight.airline_code = airline_code
                existing_flight.city = city
                existing_flight.departure_time = departure_time
                existing_flight.gate = gate
                existing_flight.save()
            else:
                # Create a new flight if it doesn't exist
                Flight.objects.create(
                    flight_number=flight_number,
                    airline_name=airline_name,
                    airline_code=airline_code,
                    city=city,
                    departure_time=departure_time,
                    gate=gate
                )

            self.stdout.write(self.style.SUCCESS(
                'Successfully imported flights'))
