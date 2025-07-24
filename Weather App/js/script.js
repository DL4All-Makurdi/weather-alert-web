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
