import os
from http import HTTPStatus

import requests
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("863242b3c0f4a1b8d2e5c9f6a7e8b9d")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


class WeatherService:
    def fetch_weather_info(self, location):
        params = {"q": location, "appid": OPENWEATHER_API_KEY, "units": "metric"}

        response = requests.get(BASE_URL, params=params)
        if response.status_code != HTTPStatus.OK:
            return {}

        data = response.json()
        return {
            "location": location.title(),
            "temperature": data["main"]["temp"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
        }
