/* document.addEventListener('DOMContentLoaded', () => { */

 const dateElement = document.getElementById("currentDate");
const timeElement = document.getElementById("currentTime");

// Get current date and time
const now = new Date();

// Format date (e.g., "Wednesday, July 23, 2025")
const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
dateElement.innerText = now.toLocaleDateString("en-US", dateOptions);

// Format time (e.g., "02:15 PM")
const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
timeElement.innerText = now.toLocaleTimeString("en-US", timeOptions); 
    
    const apiKey = "b5bac71479609d5bc0233dbb19b07a25"; // Replace with your actual API key
let defaultCity = "Makurdi"; // fallback city

// ✅ Check if JavaScript is running
console.log("✅ JavaScript loaded");

// 📍 Get user's current location
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const { latitude, longitude } = position.coords;

    // 🌐 Use OpenWeatherMap's reverse geocoding to get city name from coordinates
    const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
    
    try {
      const geoResponse = await fetch(reverseGeoUrl);
      const geoData = await geoResponse.json();
      
      if (geoData && geoData[0]) {
        defaultCity = geoData[0].name;
        console.log("📍 Detected city:", defaultCity);
        getCurrentWeather(defaultCity); // fetch weather for detected city
      }
    } catch (error) {
      console.error("⚠️ Failed to detect city. Falling back to default:", error);
      getCurrentWeather(defaultCity);
    }
  },
  (error) => {
    console.warn("⚠️ Geolocation not allowed or failed. Using default city.");
    getCurrentWeather(defaultCity);
  }
);

// 🌦️ Function to fetch current weather
async function getCurrentWeather(city = defaultCity) {
  console.log(`🌍 Fetching weather for: ${city}`);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  console.log(`🔗 Request URL: ${url}`);

  try {
    const response = await fetch(url);
    console.log("📡 Response status:", response.status);

    if (!response.ok) throw new Error("Weather data not found.");

    const data = await response.json();
    console.log("✅ Weather data received:", data);

    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    // 🌡️ Update DOM elements
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("currentTemp").innerText = `${temperature}°C`;
    document.getElementById("feels").innerText = `Feels like: ${Math.round(data.main.feels_like)}°C`;

    const weather = document.getElementById("weather");
    const info = data.weather[0];
    weather.innerText = info.main + " – " + info.description.charAt(0).toUpperCase() + info.description.slice(1);
    weatherIcon.innerText = info.icon;
    // 🕒 Add Date and Time

    

    // const dateElem = document.getElementById("date");
    // const timeElem = document.getElementById("time");

    // const now = new Date();
    // dateElem.innerText = now.toDateString();
    // timeElem.innerText = now.toLocaleTimeString();
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    document.getElementById("currentTemp").innerText = "--";
    document.getElementById("weather").innerText = "Error loading weather";
  }
}

const weatherRecommendations = {
                      Clear: [
                        "Stay hydrated — drink plenty of water.",
                        "Wear sunglasses and sunscreen.",
                        "Avoid outdoor activities during midday heat."
                      ],
                      Clouds: [
                        "Keep an umbrella handy — weather can change.",
                        "Wear layers to stay comfortable.",
                        "UV rays still affect skin — wear sunscreen."
                      ],
                      Rain: [
                        "Carry an umbrella or raincoat.",
                        "Wear non-slip footwear.",
                        "Avoid walking or driving through floodwaters."
                      ],
                      Thunderstorm: [
                        "Stay indoors and unplug electronics.",
                        "Avoid using wired electronics.",
                        "Do not shelter under trees."
                      ],
                      Drizzle: [
                        "Light rain — keep an umbrella with you.",
                        "Wear water-resistant shoes."
                      ],
                      Snow: [
                        "Wear warm layers and waterproof boots.",
                        "Drive slowly and carefully.",
                        "Keep emergency supplies if traveling."
                      ],
                      Mist: [
                        "Drive with fog lights on.",
                        "Move slowly and avoid sudden stops."
                      ],
                      Fog: [
                        "Use low-beam headlights.",
                        "Avoid unnecessary travel if visibility is poor."
                      ],
                      Haze: [
                        "Wear a mask if air quality is low.",
                        "Avoid prolonged outdoor exposure."
                      ],
                      Dust: [
                        "Wear a face mask.",
                        "Keep windows and doors shut.",
                        "Stay indoors if you have respiratory conditions."
                      ],
                      Sand: [
                        "Protect eyes and mouth from sand.",
                        "Avoid long exposure to open areas."
                      ],
                      Smoke: [
                        "Avoid outdoor physical activity.",
                        "Use air purifiers indoors if possible."
                      ]
                    };

                    async function fetchWeather(location = "Makurdi") {
                      const apiKey = "b5bac71479609d5bc0233dbb19b07a25"; // Replace with your key
                      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

                      try {
                        const response = await fetch(url);
                        const data = await response.json();
                        const condition = data.weather[0].main;
                        document.getElementById("weather-condition").textContent = `${condition} (${data.weather[0].description})`;
                        displayRecommendations(condition);
                      } catch (error) {
                        console.error("Failed to fetch weather:", error);
                        document.getElementById("weather-condition").textContent = "Error fetching weather";
                      }
                    }

                    function displayRecommendations(condition) {
                      const tipsContainer = document.getElementById("recommendation-list");
                      tipsContainer.innerHTML = "";
                      const tips = weatherRecommendations[condition];

                      if (tips) {
                        tips.forEach(tip => {
                          const li = document.createElement("li");
                          li.textContent = tip;
                          tipsContainer.appendChild(li);
                        });
                      } else {
                        const li = document.createElement("li");
                        li.textContent = "No specific recommendations for this condition.";
                        tipsContainer.appendChild(li);
                      }
                    }

                    // Call on page load
                    fetchWeather();


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

/* }) */;

