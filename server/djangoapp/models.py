# Uncomment the following imports before adding the Model code

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


# Create your models here.


# Car Make model
class CarMake(models.Model):
    name = models.CharField(null=False, max_length=100)
    description = models.TextField()

    def __str__(self):
        return "Name: " + self.name + ", Description: " + self.description


# Car Model model
class CarModel(models.Model):
    SEDAN = "Sedan"
    SUV = "SUV"
    WAGON = "Wagon"
    HATCHBACK = "Hatchback"
    PICKUP = "Pickup"
    SPORTS = "Sports"
    VAN = "Van"
    MICRO = "Micro"

    TYPE_CHOICES = [
        (SEDAN, "Sedan"),
        (SUV, "SUV"),
        (WAGON, "Wagon"),
        (HATCHBACK, "Hatchback"),
        (PICKUP, "Pickup"),
        (SPORTS, "Sports"),
        (VAN, "Van"),
        (MICRO, "Micro"),
    ]

    # Many-To-One relationship to Car Make model
    # (One Car Make has many Car Models, using ForeignKey field)
    make = models.ForeignKey(CarMake, on_delete=models.CASCADE)

    name = models.CharField(null=False, max_length=100)
    type = models.CharField(null=False, choices=TYPE_CHOICES)
    year = models.IntegerField(
        validators=[MinValueValidator(2015), MaxValueValidator(2026)]
    )

    def __str__(self):
        return (
            "Name: " + self.name + ", Type: " + self.type + ", Year: "
            + str(self.year)
        )
