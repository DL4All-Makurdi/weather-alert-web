/* document.addEventListener('DOMContentLoaded', () => { */

const BACKEND = "http://localhost:8000";

const dateElement = document.getElementById("currentDate");
const timeElement = document.getElementById("currentTime");

// Get current date and time
const now = new Date();

// Format date (e.g., "Wednesday, July 23, 2025")
const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
dateElement.innerText = now.toLocaleDateString("en-US", dateOptions);

// Format time (e.g., "02:15 PM")
const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
timeElement.innerText = now.toLocaleTimeString("en-US", timeOptions);

// ✅ Check if JavaScript is running
console.log("✅ JavaScript loaded");

// // 📍 Get user's current location
// navigator.geolocation.getCurrentPosition(
//   async (position) => {
//     const { latitude, longitude } = position.coords;

//     // 🌐 Use OpenWeatherMap's reverse geocoding to get city name from coordinates
//     const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

//     try {
//       const geoResponse = await fetch(reverseGeoUrl);
//       const geoData = await geoResponse.json();

//       if (geoData && geoData[0]) {
//         defaultCity = geoData[0].name;
//         console.log("📍 Detected city:", defaultCity);
//         getCurrentWeather(defaultCity); // fetch weather for detected city
//       }
//     } catch (error) {
//       console.error(
//         "⚠️ Failed to detect city. Falling back to default:",
//         error
//       );
//       getCurrentWeather(defaultCity);
//     }
//   },
//   (error) => {
//     console.warn("⚠️ Geolocation not allowed or failed. Using default city.");
//     getCurrentWeather(defaultCity);
//   }
// );
const states = document.getElementById("stateSelect");
const lgas = document.getElementById("lgaSelect");
const searchForm = document.getElementById("searchForm");
const city = document.getElementById("cityName");
const currTemp = document.getElementById("currentTemp");
const highTemp = document.getElementById("highTemp");
const lowTemp = document.getElementById("lowTemp");
const feelsLike = document.getElementById("feels");
const weatherIcon = document.getElementById("weatherIcon");
const weather = document.getElementById("weather");
const wCondition = document.getElementById("weather-condition");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const tipsContainer = document.getElementById("recommendation-list");
const predictions = document.getElementById("predictionList");

async function fetchLgas(target, state) {
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select Local Goverment";
  defaultOption.value = "";

  try {
    response = await fetch(`${BACKEND}/states/${state}/lgas`);
    if (!response.ok) throw new Error("Lgas data not found.");

    const data = await response.json();

    target.innerHTML = "";

    target.appendChild(defaultOption);

    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      target.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    target.innerHTML = "";
    target.appendChild(defaultOption);
  }
}
states.addEventListener("change", () => {
  fetchLgas(lgas, states.value);
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const state = states.value;
  const lga = lgas.value;

  fetch(`${BACKEND}/weather/current?state=${state}&lga=${lga}`)
    .then((res) => res.json())
    .then((data) => {
      city.innerText = data.location;
      currTemp.innerText = data.temperature;
      highTemp.innerText = data.high_temp;
      lowTemp.innerText = data.low_temp;
      feelsLike.innerText = data.feels;
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
      weather.innerText = data.weather;
      wCondition.innerText = `${data.condition}`;
      tipsContainer.innerHTML = "";
      data.advice.split(".").forEach((item) => {
        if (item) {
          const li = document.createElement("li");
          li.innerText = item;
          tipsContainer.appendChild(li);
        }
      });
      humidity.innerText = data.humidity;
      pressure.innerText = data.pressure;
      visibility.innerText = data.visibility;
    })
    .catch((error) => {
      console.error("Failed to fetch weather:", error);
    });

  fetch(`${BACKEND}/weather/forecast?state=${state}&lga=${lga}&days=7`)
    .then((res) => res.json())
    .then((data) => {
      predictions.innerHTML = "";
      for (const [date, value] of Object.entries(data.forecast)) {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${date}</td>
        <td><img src="https://openweathermap.org/img/wn/${value.icon}@2x.png" width="32"/> ${value.weather}</td>
        <td>${value.high_temp}°C / ${value.low_temp}°C</td>
        <td>${value.pressure}</td>
        <td>${value.visibility}</td>
        <td>${value.humidity}</td>`;

        predictions.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch weather:", error);
    });
});

const weatherRecommendations = {
  Clear: [
    "Stay hydrated — drink plenty of water.",
    "Wear sunglasses and sunscreen.",
    "Avoid outdoor activities during midday heat.",
  ],
  Clouds: [
    "Keep an umbrella handy — weather can change.",
    "Wear layers to stay comfortable.",
    "UV rays still affect skin — wear sunscreen.",
  ],
  Rain: [
    "Carry an umbrella or raincoat.",
    "Wear non-slip footwear.",
    "Avoid walking or driving through floodwaters.",
  ],
  Thunderstorm: [
    "Stay indoors and unplug electronics.",
    "Avoid using wired electronics.",
    "Do not shelter under trees.",
  ],
  Drizzle: [
    "Light rain — keep an umbrella with you.",
    "Wear water-resistant shoes.",
  ],
  Snow: [
    "Wear warm layers and waterproof boots.",
    "Drive slowly and carefully.",
    "Keep emergency supplies if traveling.",
  ],
  Mist: ["Drive with fog lights on.", "Move slowly and avoid sudden stops."],
  Fog: [
    "Use low-beam headlights.",
    "Avoid unnecessary travel if visibility is poor.",
  ],
  Haze: [
    "Wear a mask if air quality is low.",
    "Avoid prolonged outdoor exposure.",
  ],
  Dust: [
    "Wear a face mask.",
    "Keep windows and doors shut.",
    "Stay indoors if you have respiratory conditions.",
  ],
  Sand: [
    "Protect eyes and mouth from sand.",
    "Avoid long exposure to open areas.",
  ],
  Smoke: [
    "Avoid outdoor physical activity.",
    "Use air purifiers indoors if possible.",
  ],
};

function setBackgroundBasedOnTime() {
  const hour = new Date().getHours();
  const body = document.body;

  let backgroundImage = "";

  if (hour >= 5 && hour < 12) {
    // Morning
    backgroundImage = "url('images/morning.jpg')";
  } else if (hour >= 12 && hour < 17) {
    // Afternoon
    backgroundImage = "url('images/afternoon.jpg')";
  } else if (hour >= 17 && hour < 20) {
    // Evening
    backgroundImage = "url('images/evening.jpg')";
  } else {
    // Night
    backgroundImage = "url('./images/night.jpg')";
  }

  body.style.backgroundImage = backgroundImage;
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "center";
  body.style.backgroundAttachment = "fixed";
}

setBackgroundBasedOnTime();
