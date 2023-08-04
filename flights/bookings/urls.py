from django.urls import path
from .views import register, login
from .views import add_flight, remove_flight
from .views import get_flights_based_on_time_and_destination
from .views import get_all_destinations, get_all_flights
from .views import book_flight, get_all_bookings_of_user
from .views import view_all_bookings_of_flight

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('add-flight/', add_flight, name='add-flight'),
    path('remove-flight/', remove_flight, name='remove-flight'),
    path('get-flights/', get_flights_based_on_time_and_destination, name='get-flights'),
    path('get-destinations/', get_all_destinations, name='get-destinations'),
    path('get-all-flights/', get_all_flights, name='get-all-flights'),
    path('book-flight/', book_flight, name='book-flight'),
    path('get-user-bookings/', get_all_bookings_of_user, name='user-bookings'),
    path('flight-bookings/', view_all_bookings_of_flight, name='flight-bookings')
]