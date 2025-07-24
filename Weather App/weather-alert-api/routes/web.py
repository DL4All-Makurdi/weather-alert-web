from typing import Annotated

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse

from services.weather import WeatherService


load_dotenv()
router = APIRouter()


@router.get("/weather")
def get_weather(
    location: Annotated[str, Query(..., description="Enter any city or location")],
    service: Annotated[WeatherService, Depends()],
):
    response = service.fetch_weather_info(location)
    if not response:
        return JSONResponse(
            status_code=400,
            content={"error": "Failed to fetch weather data"},
        )

    return response
