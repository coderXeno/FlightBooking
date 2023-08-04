from django.shortcuts import render
from .models import User, Flights, TicketBookings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_time
from django.forms.models import model_to_dict
from datetime import datetime
import json
import uuid

# Create your views here.
@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            new_user = User(
                name=username,
                email=email,
                password=password
            )
            new_user.save()

            if new_user:
                # Return a JsonResponse with a success message
                response_data = {
                    'success': True,
                    'message': 'Registration successful!',
                    'user': model_to_dict(new_user)
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({'success':False})

        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)
    
@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            try:
                user = User.objects.get(name=username, password=password)
            except User.DoesNotExist:
                # Return a JsonResponse with an error message if user does not exist
                error_data = {
                    'error': 'Invalid email or password.',
                }
                return JsonResponse(error_data, status=401)

            # Return a JsonResponse with the user details on successful login
            response_data = {
                'success': True,
                'message': 'Registration successful!',
                'user': model_to_dict(user)
            }
            return JsonResponse(response_data, status=200)
            
        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)
    
@csrf_exempt
def add_flight(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            user_id = data.get('user_id')

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                # Return a JsonResponse with an error message if user does not exist
                error_data = {
                    'error': 'Invalid user id.',
                }
                return JsonResponse(error_data, status=401)

            # Return a JsonResponse with the user details on successful login
            if user.is_admin == True:
                company_name = data['company'],
                flight_departure_time = data['departureTime'],
                flight_arrival_time = data['arrivalTime'],
                flight_departure_from = data['departureFrom'],
                flight_destination = data['destination'],
                no_of_seats = data['seatsAvailable'],
                flight_price = data['price'],
                flight_duration = data['duration']
                
                try:
                    existing_flights = Flights.objects.get(
                        flight_departure_from=flight_departure_from[0],
                        flight_destination=flight_destination[0],
                        company_name=company_name[0],
                        flight_departure_time=flight_departure_time[0],
                        flight_arrival_time=flight_arrival_time[0],
                        is_active=True
                    )

                    return JsonResponse({
                        'success': True,
                        'message': "Such a flight already exists!",
                        'id': existing_flights.id
                    })
                except Flights.DoesNotExist:
                    new_flight_details = Flights(
                        company_name=company_name[0],
                        flight_departure_time=flight_departure_time[0],
                        flight_arrival_time=flight_arrival_time[0],
                        flight_departure_from=flight_departure_from[0],
                        flight_destination=flight_destination[0],
                        no_of_seats=no_of_seats[0],
                        flight_price=flight_price[0],
                        flight_duration=flight_duration
                    )

                    try:
                        new_flight_details.save()

                        return JsonResponse({
                            "success": True,
                            "message": "The new flight was added successfully!",
                            "id": new_flight_details.id
                        }, status=200)
                    except:
                        return JsonResponse({
                            "success": False,
                            "message": "Some internal error occurred!"
                        }, status=500)
            
        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)
    
@csrf_exempt
def remove_flight(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            user_id = data.get('user_id')

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                # Return a JsonResponse with an error message if user does not exist
                error_data = {
                    'error': 'Invalid user id.',
                }
                return JsonResponse(error_data, status=401)

            # Return a JsonResponse with the user details on successful login
            if user.is_admin == True:
                flight_id = data['flightId']
                
                try:
                    existing_flights = Flights.objects.get(id=flight_id)
                    existing_flights.is_active = False

                    try:
                        existing_flights.save()
                        return JsonResponse({
                            'success': True,
                            'message': "Flight removed successfully!"
                        })
                    except:
                        return JsonResponse({
                            'success': False,
                            'message': "Some error occurred!"
                        })
                except Flights.DoesNotExist:
                    return JsonResponse({
                        "success": False,
                        "message": "Some internal error occurred!"
                    }, status=500)
            
        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)
    
@csrf_exempt
def get_flights_based_on_time_and_destination(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            start_time = data.get('startTime')
            end_time = data.get('endTime')
            destination = data.get('destination')
            departure_from = data.get('departureFrom')

            try:
                all_flights = Flights.objects.get(
                    flight_destination=destination,
                    flight_departure_from=departure_from
                )

                # Convert time strings to datetime.time objects
                format_str = "%I:%M %p"  # Format for 12-hour time with AM/PM
                time_start = datetime.strptime(start_time, format_str).time()
                time_end = datetime.strptime(end_time, format_str).time()
                time_check = datetime.strptime(all_flights.flight_departure_time, format_str).time()

                if time_start <= time_check <= time_end:
                    return JsonResponse({
                        'success': True,
                        'flight_data': model_to_dict(all_flights)
                    })
                else:
                    not_found_data = {
                        'flights': {},
                        'success': False,
                        'message': 'Sorry, No flights were found!',
                    }
                    return JsonResponse(not_found_data, status=404)
            except Flights.DoesNotExist:
                # Return a JsonResponse with an error message if flight was not found
                not_found_data = {
                    'flights': {},
                    'error': 'Sorry, No flights were found!',
                }
                return JsonResponse(not_found_data, status=404)

        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)

@csrf_exempt
def get_all_flights(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            user_id = data.get('user_id')

            try:
                user = User.objects.get(id=user_id)
                existing_flights = Flights.objects.filter(
                    is_active=True
                )
                
                all_flight_information = []
                for flight in existing_flights:
                    all_flight_information.append(model_to_dict(flight))

                return JsonResponse({
                    'success': True,
                    'allFlights': all_flight_information
                })
            except Flights.DoesNotExist:
                return JsonResponse({
                    "success": False,
                    "message": "No Flights Found!"
                }, status=500)
            except User.DoesNotExist:
                # Return a JsonResponse with an error message if user does not exist
                error_data = {
                    'error': 'Invalid user id.',
                }
                return JsonResponse(error_data, status=401)

            # Return a JsonResponse with the user details on successful login
            
        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)
    
@csrf_exempt
def get_all_destinations(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            user_id = data.get('user_id')

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                # Return a JsonResponse with an error message if user does not exist
                error_data = {
                    'error': 'Invalid user id.',
                }
                return JsonResponse(error_data, status=401)

            try:
                existing_flights = Flights.objects.all()
                destination_airports = []
                departure_airports = [] 
                
                for flight in existing_flights:
                    destination_airports.append(flight.flight_destination)
                    departure_airports.append(flight.flight_departure_from)

                return JsonResponse({
                    'success': True,
                    'destinationAirports': destination_airports,
                    'departureAirports': departure_airports
                })
            except Flights.DoesNotExist:
                return JsonResponse({
                    "success": False,
                    "message": "Some internal error occurred!"
                }, status=500)
            
        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)
    
@csrf_exempt
def book_flight(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            user_id = data.get('user_id')

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                # Return a JsonResponse with an error message if user does not exist
                error_data = {
                    'error': 'Invalid user id.',
                }
                return JsonResponse(error_data, status=401)

            try:
                flight_id = data.get('flight_id')
                seats_to_be_booked = data.get('seatsToBook')
                flight_details = Flights.objects.get(
                    id=flight_id,
                    is_active=True
                )

                if flight_details.no_of_seats >= seats_to_be_booked:
                    flight_details.no_of_seats = flight_details.no_of_seats - seats_to_be_booked
                else:
                    return JsonResponse({
                        'success': False,
                        'message': "Sorry! No seats are currently available!"
                    })

                try:
                    flight_details.save()
                    new_booking = TicketBookings(
                        user_id=user,
                        flight_id=flight_details,
                        number_of_seats=seats_to_be_booked,
                        total_price=seats_to_be_booked * flight_details.flight_price
                    )

                    new_booking.save()

                    return JsonResponse({
                        'success': True,
                        'message': 'Your flight was booked successfully',
                        'flight_latest_details': model_to_dict(flight_details),
                        'booking_details': model_to_dict(new_booking)
                    })
                except Exception as e:
                    print(e)
                    return JsonResponse({
                        "success": False,
                        "message": "Some internal error occur!"
                    }, status=500)
            except Flights.DoesNotExist:
                return JsonResponse({
                    "success": False,
                    "message": "This flight does not exist!"
                }, status=404)
            
        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)
    
@csrf_exempt
def get_all_bookings_of_user(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            user_id = data.get('user_id')

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                # Return a JsonResponse with an error message if user does not exist
                error_data = {
                    'error': 'Invalid user id.',
                }
                return JsonResponse(error_data, status=401)

            try:
                all_bookings = TicketBookings.objects.filter(
                    user_id_id=user_id
                )

                user_bookings = []
                for booking in all_bookings:
                    bookingDict = model_to_dict(booking)
                    flight_details = Flights.objects.get(id=booking.flight_id.id)
                    bookingDict.update(model_to_dict(flight_details))

                    user_bookings.append(bookingDict)

                return JsonResponse({
                    "success": True,
                    "bookings": user_bookings
                }, status=200)
            except Flights.DoesNotExist:
                return JsonResponse({
                    "success": False,
                    "message": "This user has no bookings!"
                }, status=404)
            
        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)
    
@csrf_exempt
def view_all_bookings_of_flight(request):
    if request.method == 'POST':
        try:
            # Parse the request body and extract data
            data = json.loads(request.body)
            user_id = data.get('user_id')

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                # Return a JsonResponse with an error message if user does not exist
                error_data = {
                    'error': 'Invalid user id.',
                }
                return JsonResponse(error_data, status=401)

            # Return a JsonResponse with the user details on successful login
            if user.is_admin == True:
                flight_id = data['flight_id']
                
                try:
                    flight_details = Flights.objects.get(id=flight_id)
                    all_bookings = TicketBookings.objects.filter(
                        flight_id_id=flight_id
                    )

                    all_flight_bookings = []
                    net_sum_earned = 0
                    for booking in all_bookings:
                        ticket_details = model_to_dict(booking)
                        user_id = booking.user_id
                        consumer_details = User.objects.get(id=user_id.id)
                        ticket_details["consumer_name"] = consumer_details.name
                        net_sum_earned += booking.total_price

                        all_flight_bookings.append(ticket_details)

                    return JsonResponse({
                        'success': True,
                        'bookings': all_flight_bookings,
                        'netEarnings': net_sum_earned,
                        'flightDetails': model_to_dict(flight_details)
                    })

                except TicketBookings.DoesNotExist:
                    return JsonResponse({
                        "success": True,
                        "message": "No Bookings Found!",
                        "bookings": []
                    }, status=200)
            else:
                return JsonResponse({
                        "success": False,
                        "message": "You are not authorised to perform this action!"
                    }, status=400)
        except json.JSONDecodeError:
            # Return a JsonResponse with an error message for invalid JSON data
            error_data = {
                'error': 'Invalid JSON data in the request body.',
            }
            return JsonResponse(error_data, status=400)

    else:
        # Return a JsonResponse with an error message for unsupported methods
        error_data = {
            'error': 'Method not allowed. Only POST requests are supported.',
        }
        return JsonResponse(error_data, status=405)