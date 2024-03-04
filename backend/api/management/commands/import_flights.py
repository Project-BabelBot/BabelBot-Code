from django.core.management.base import BaseCommand
from api.models import Flight
import pandas as pd
import os


class Command(BaseCommand):
    help = 'Import flight data from an Excel file and populate the database.'

    def handle(self, *args, **options):
        # Replace 'your_excel_file.xlsx' with the actual path to your Excel file.
        # data = pd.read_excel(r"C:\Users\Nitya\Desktop\ENGG\Capstone\GitHub\BabelBot-Code\backend\api\flight_details_with_airport.xlsx")
        data = pd.read_excel(os.path.join(os.path.dirname(__file__), "flight_details_with_airport.xlsx"))

        for index, row in data.iterrows():
            flight_number = row['Flight Number']
            airline_name = row['Airline Name']
            airline_code = row['Airline Code']
            city = row['City']
            departure_time = row['Departure Time']
            gate = row['Gate']
            
            # Assuming 'Airport Name' contains airport codes
            airport_name = row['Airport Name']

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
                existing_flight.airport_name = airport_name  # Update airport_code
                existing_flight.save()
            else:
                # Create a new flight if it doesn't exist
                Flight.objects.create(
                    flight_number=flight_number,
                    airline_name=airline_name,
                    airline_code=airline_code,
                    city=city,
                    departure_time=departure_time,
                    gate=gate,
                    airport_name=airport_name  # Update airport_code
                )

            self.stdout.write(self.style.SUCCESS(
                'Successfully imported flights'))
