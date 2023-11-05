from django import forms


class FlightSearchForm(forms.Form):
    query = forms.CharField(
        label='Search', max_length=100, required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Flight Number or City'}))
