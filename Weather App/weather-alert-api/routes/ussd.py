from typing import Annotated, Any
from fastapi import APIRouter, Depends, Form
from fastapi.responses import PlainTextResponse

from services.weather import WeatherService


router = APIRouter()

SESSIONS = {}

NIGERIAN_STATES = {
    "A-B": [
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
    ],
    "C-I": [
        "Cross River",
        "Delta",
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "Gombe",
        "Imo",
    ],
    "J-L": [
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
    ],
    "N-O": [
        "Nasarawa",
        "Niger",
        "Ogun",
        "Ondo",
        "Osun",
        "Oyo",
    ],
    "P-Z": [
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara",
    ],
}

WELCOME_MSG = (
    "CON Welcome to WeatherMan Service.\rSelect the first letter of your state.\n"
    + "".join(
        [
            f"{idx}. {range}\n"
            for idx, range in enumerate(NIGERIAN_STATES.keys(), start=1)
        ]
    )
)


def select_state_msg(states: list[str]):
    return "CON Select your state.\n" + "".join(
        [f"{idx}. {range}\n" for idx, range in enumerate(states, start=1)]
    )


TYPE_LOCATION_MSG = "CON Type in your location."


def weather_msg(weather_info: dict[str, Any]):
    return "END Here's your weather information.\n" + "".join(
        [f"{label.title()}: {value}\n" for label, value in weather_info.items()]
    )


@router.post("")
async def process_ussd(
    session_id: Annotated[str, Form(alias="sessionId")],
    text: Annotated[str, Form()],
    service: Annotated[WeatherService, Depends()],
):
    if text == "":
        return PlainTextResponse(WELCOME_MSG)
    elif "*" not in text and text.isdigit():
        state_ranges = list(NIGERIAN_STATES.keys())
        if len(state_ranges) >= int(text):
            range = state_ranges[int(text) - 1]
            states = NIGERIAN_STATES[range]
            SESSIONS[session_id] = states
            return PlainTextResponse(select_state_msg(states))
    elif text.count("*") == 1:
        input = text.split("*")[-1]
        states = SESSIONS.get(session_id)
        if (
            input.isdigit()
            and states
            and isinstance(states, list)
            and len(states) >= int(input)
        ):
            state = states[int(input) - 1]
            SESSIONS[session_id] = state
            return PlainTextResponse(TYPE_LOCATION_MSG)
    elif text.count("*") == 2:
        location = text.split("*")[-1]
        state = SESSIONS.get(session_id)

        weather_info = service.fetch_weather_info(f"{location}, {state}")

        SESSIONS.pop(session_id, None)
        return PlainTextResponse(weather_msg(weather_info))

    SESSIONS.pop(session_id, None)
    return PlainTextResponse("END Sorry couldn't understand your input")
