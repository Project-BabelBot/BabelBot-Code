from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.main, name = "audio_nlp"),
    path('training/', views.training, name = "model_training"),
    path('flight-search/', views.flight_search, name = 'flight_search'),
    path('text-nlp/', views.text_nlp, name = "text-nlp")
]