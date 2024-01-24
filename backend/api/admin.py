from django.contrib import admin

# Register your models here.
from .models import Flight


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    # Use actual fields from the Flight model
    list_display = ('flight_number', 'city')
    search_fields = ('flight_number', 'city')
