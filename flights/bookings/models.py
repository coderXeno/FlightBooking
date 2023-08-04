from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=20)
    createdAt = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)

    # def __str__(self):
    #     return f'{self.name} - {self.email}'

class Flights(models.Model):
    company_name = models.CharField(max_length=30)
    flight_departure_time = models.CharField()
    flight_arrival_time = models.CharField()
    flight_departure_from = models.CharField(max_length=20)
    flight_destination = models.CharField(max_length=20)
    no_of_seats = models.IntegerField(default=60)
    flight_price = models.FloatField()
    flight_duration = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)

    # def __str__(self):
    #     return f'{self.company_name} - {self.flight_departure_time} - {self.flight_arrival_time} - {self.flight_departure_from} - {self.flight_destination}'
    
# class Bookings(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     flight = models.ForeignKey(Flights, on_delete=models.CASCADE)
#     number_of_seats = models.IntegerField()
#     booking_time = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f'{self.user} - {self.flight} - {self.number_of_seats} - {self.booking_time}'

class TicketBookings(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    flight_id = models.ForeignKey(Flights, on_delete=models.CASCADE)
    number_of_seats = models.IntegerField()
    booking_time = models.DateTimeField(auto_now_add=True)
    total_price = models.FloatField(default=0)

    # def __str__(self):
    #     return f'{self.user_id} - {self.flight} - {self.number_of_seats} - {self.booking_time}'