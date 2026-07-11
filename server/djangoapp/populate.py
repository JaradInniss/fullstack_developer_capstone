import os
import sys
from pathlib import Path

import django
from django.db import connection

project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangoproj.settings")

django.setup()

from djangoapp.models import CarMake, CarModel  # noqa: E402


def initiate():
    from django.core.management import call_command

    table_names = set(connection.introspection.table_names())
    if not {"djangoapp_carmake", "djangoapp_carmodel"}.issubset(table_names):
        call_command("migrate", verbosity=0, interactive=False)

    if CarMake.objects.exists():
        return

    car_make_data = [
        {
            "name": "NISSAN",
            "description": "Great cars. Japanese technology",
        },
        {
            "name": "Mercedes",
            "description": "Great cars. German technology",
        },
        {
            "name": "Audi",
            "description": "Great cars. German technology",
        },
        {
            "name": "Kia",
            "description": "Great cars. Korean technology",
        },
        {
            "name": "Toyota",
            "description": "Great cars. Japanese technology",
        },
    ]

    car_make_instances = []
    for data in car_make_data:
        car_make_instances.append(
            CarMake.objects.get_or_create(
                name=data["name"],
                defaults={"description": data["description"]},
            )[0]
        )

    # Create CarModel instances with the corresponding CarMake instances
    car_model_data = [
        {
            "name": "Pathfinder",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[0],
        },
        {
            "name": "Qashqai",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[0],
        },
        {
            "name": "XTRAIL",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[0],
        },
        {
            "name": "A-Class",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[1],
        },
        {
            "name": "C-Class",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[1],
        },
        {
            "name": "E-Class",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[1],
        },
        {
            "name": "A4",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[2],
        },
        {
            "name": "A5",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[2],
        },
        {
            "name": "A6",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[2],
        },
        {
            "name": "Sorrento",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[3],
        },
        {
            "name": "Carnival",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[3],
        },
        {
            "name": "Cerato",
            "type": "Sedan",
            "year": 2023,
            "make": car_make_instances[3],
        },
        {
            "name": "Corolla",
            "type": "Sedan",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Camry",
            "type": "Sedan",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Kluger",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "RAV4",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Hatchback",
            "type": "Hatchback",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Hilux",
            "type": "Pickup",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Tacoma",
            "type": "Pickup",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Fortuner",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Land Cruiser",
            "type": "SUV",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Supra",
            "type": "Sports",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Hiace",
            "type": "Van",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Coaster",
            "type": "Van",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Alphard",
            "type": "Van",
            "year": 2023,
            "make": car_make_instances[4],
        },
        {
            "name": "Pixis",
            "type": "Micro",
            "year": 2023,
            "make": car_make_instances[4],
        },
    ]

    for data in car_model_data:
        CarModel.objects.get_or_create(
            name=data["name"],
            defaults={
                "make": data["make"],
                "type": data["type"],
                "year": data["year"],
            },
        )


if __name__ == "__main__":
    initiate()
