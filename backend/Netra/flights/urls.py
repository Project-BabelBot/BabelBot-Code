from django.urls import path
from . import views


urlpatterns = [
    path('search/', views.search_flight, name='search_flight'),
    # Add other URL patterns as needed
]
