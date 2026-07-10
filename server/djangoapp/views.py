# Uncomment the required imports before adding the code

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate
from .models import CarMake, CarModel
from .restapis import get_request, analyze_review_sentiments, post_review


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

# `logout_request` view to handle sign out request
def logout_request(request):
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)


# `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    context = {}

    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']

    username_exists = False
    email_exists = False

    try:
        # Check if username already exists
        User.objects.get(username=username)
        username_exists = true
    except:
        # Username does not exist
        logger.debug("{} is a new username".format(username))

    # If is a new user
    if not username_exists:
        # Create a new user in the auth_user table
        user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name, password=password, email=email)

        # Log the user in and redirect to index page
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        # If username already exists, return an error message
        data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)
    
# `get_cars` view to return a list of cars
def get_cars(request):
    count = CarMake.objects.filter().count()
    print("Number of Cars: {}".format(count))

    # If there are no cars in the database, call the `initiate` function to populate the database
    if (count == 0):
        initiate()

    car_model = CarModel.objects.select_related('make')
    cars = []
    for car_model in car_model:
        cars.append({"CarMake": car_model.name, "CarModel": car_model.make.name})
    return JsonResponse({"CarModels": cars})


# `get_dealerships` view to render the index page with a list of dealerships
def get_dealerships(request, state="All"):
    if (state == "All"):
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state

    dealerships = get_request(endpoint)
    return JsonResponse({"status":200, "dealers":dealerships})

# get_dealer_reviews` view to render the reviews of a dealer
def get_dealer_reviews(request, dealer_id):
    # if dealer id has been provided
    if(dealer_id):
        endpoint = "/fetchReviews/dealer/"+str(dealer_id)
        reviews = get_request(endpoint)

        if not reviews:
            return JsonResponse({"status":200, "reviews": []})

        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            print(response)
            sentiment = "neutral"
            if response:
                sentiment = response.get('sentiment', 'neutral')
            review_detail['sentiment'] = sentiment
        return JsonResponse({"status":200,"reviews":reviews})
    else:
        return JsonResponse({"status":400,"message":"Bad Request"})

# `get_dealer_details` view to render the dealer details
def get_dealer_details(request, dealer_id):
    if (dealer_id):
        endpoint = "/fetchDealer/" + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status":200, "dealer":dealership})
    else:
        return JsonResponse({"status":400, "message":"Bad Request"})

# `add_review` view to submit a review
def add_review(request):
    if (request.user.is_anonymous == False):
        data = json.loads(request.body)
        try:
            response = post_review(data)
            return JsonResponse({"status":200})
        except:
            return JsonResponse({"status":401,"message":"Error in posting review"})
    else:
        return JsonResponse({"status":403,"message":"Unauthorized"})