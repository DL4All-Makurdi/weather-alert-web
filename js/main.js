document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const logoutButton = document.getElementById('logoutButton');
    const currentDateTime = document.getElementById('currentDateTime');
    const locationSelect = document.getElementById('location');
    const getWeatherButton = document.getElementById('getWeatherButton');
    const weatherLocation = document.getElementById('weatherLocation');
    const temperatureDisplay = document.getElementById('temperature');
    const conditionDisplay = document.getElementById('condition');
    const recommendationsList = document.getElementById('recommendationsList');
    const weatherIcon = document.getElementById('weatherIcon');
    const loadingMessage = document.getElementById('loadingMessage');

    // Safety check for essential elements
    if (!themeToggle || !logoutButton || !currentDateTime) {
        console.error("Missing essential DOM elements.");
        return;
    }

    // Load dark mode preference from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Logout placeholder
    logoutButton.addEventListener('click', () => {
        alert('Logging out...');
        // Add real logout/session logic here
    });

    // Display live date and time
    function updateDateTime() {
        const now = new Date();
        currentDateTime.textContent = now.toLocaleString();
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

// Update background based on weather condition
  function updateWeatherBackground(condition) {
    const cond = condition.toLowerCase();

    document.body.classList.remove(
      'weather-clear',
      'weather-clouds',
      'weather-rain',
      'weather-thunderstorm',
      'weather-snow',
      'weather-mist',
      'weather-fog',
      'weather-haze'
    );

    if (cond.includes('clear')) {
      document.body.classList.add('weather-clear');
    } else if (cond.includes('cloud')) {
      document.body.classList.add('weather-clouds');
    } else if (cond.includes('rain')) {
      document.body.classList.add('weather-rain');
    } else if (cond.includes('thunder')) {
      document.body.classList.add('weather-thunderstorm');
    } else if (cond.includes('snow')) {
      document.body.classList.add('weather-snow');
    } else if (cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) {
      document.body.classList.add('weather-mist');
    }
  }

    // Get Weather with mock data
    getWeatherButton.addEventListener('click', () => {
        const selectedLocation = locationSelect.value;
        weatherLocation.textContent = `Weather in ${selectedLocation}`;
        loadingMessage.style.display = 'block';

        setTimeout(() => {
            loadingMessage.style.display = 'none';

            let temp, cond, iconUrl, recommendations;

            if (selectedLocation === 'Makurdi') {
                temp = ' > 30°C-35°C (86°F)';
                cond = 'Hot and Sunny';
                iconUrl = './img/sunny.png';
                recommendations = [
                    'Wear light-weight and colored clothes',
                    'Drink plenty of water',
                    'Have proper ventilation'
                ];
            } else if (selectedLocation === 'Gboko') {
                temp = '> 21°C-29°C (70°F-82°F)';
                cond = 'Partly Cloudy';
                iconUrl = './img/cloudy.png';
                recommendations = [
                    'Stay hydrated',
                    'Consider light clothing'
                ];
            } else if (selectedLocation === 'Otukpo') {
                temp = '> 35°C (95°F)';
                cond = 'Very Hot';
                iconUrl = './img/hot.png';
                recommendations = [
                    'Avoid prolonged sun exposure',
                    'Seek shade during peak hours',
                    'Ensure adequate hydration'
                ];
            } else {
                temp = 'N/A';
                cond = 'Select a location';
                iconUrl = '';
                recommendations = [];
            }

            temperatureDisplay.textContent = `Temperature: ${temp}`;
            conditionDisplay.textContent = `Condition: ${cond}`;
            weatherIcon.src = iconUrl;
            weatherIcon.alt = cond;
            weatherIcon.style.display = iconUrl ? 'block' : 'none';

            recommendationsList.innerHTML = '';
            recommendations.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = item;
                recommendationsList.appendChild(listItem);
            });

        }, 500); // Simulate a short delay
    });

    // Auto-load weather for Makurdi on page load
    getWeatherButton.click();
});
