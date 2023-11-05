from django.shortcuts import render
from django.http import HttpResponse
from .forms import FlightSearchForm
import pandas as pd  # Import pandas to load data from Excel
from .models import Flight

# Load the flight data from the Excel file
flight_df = pd.read_excel(
    r"C:\SD_Card\Django_venv\flights\flight_details.xlsx")
print(flight_df)


def search_flight(request):
    if request.method == 'POST':
        form = FlightSearchForm(request.POST)
        if form.is_valid():
            query = form.cleaned_data['query']
            print(f"Received query: {query}")  # Debugging print statement

            # Perform your flight search logic here using the 'query'
            flights = Flight.objects.filter(
                flight_number__icontains=query) | Flight.objects.filter(city__icontains=query)
            # Debugging print statement
            print(f"Query matched {flights.count()} flights.")

            if flights:
                relevant_columns = ["flight_number", "airline_name",
                                    "airline_code", "city", "departure_time", "gate"]
                relevant_flight_details = flights.values(*relevant_columns)
                return render(request, 'search_results.html', {'flights': relevant_flight_details})
            else:
                # Debugging print statement
                print("No flights found for the query.")
                return HttpResponse("No flights found for the query.")
    else:
        form = FlightSearchForm()

    return render(request, 'search_flight.html', {'form': form})


def search_flights(query):
    # Remove the .lower() method to make the search case-sensitive
    # query = query.lower()
    print(f"Searching for: {query}")  # Debugging print statement
    # Perform your flight search logic here using the 'query'

    # Search for flights by either flight number or city (case-insensitive)
    flights = flight_df[(flight_df['Flight Number'].str.contains(
        query, case=False)) | (flight_df['City'].str.contains(query, case=False))]

    # Debugging print statement
    print(f"Found {flights.shape[0]} matching flights.")

    return flights
