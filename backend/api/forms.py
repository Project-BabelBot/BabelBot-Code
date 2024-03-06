from django import forms
from .models import Flight

class FlightSearchForm(forms.Form):
    query = forms.CharField(required=False, label='Flight Number')
    city = forms.ChoiceField(
        choices=[('', 'Select City (optional)')] + list(Flight.CITY_CHOICES),
        required=False,
        label='City'
    )