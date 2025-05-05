let useCelsius = false;

function toggleStateDropdown() {
    const country = document.getElementById('country').value;
    const stateDropdown = document.getElementById('state');
    stateDropdown.style.display = country === "US" ? "inline-block" : "none";
}

function getWeather() {
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value.trim();
    const state = document.getElementById('state').value.trim();

    if (!/^[a-zA-Z\s]+$/.test(city)) {
        alert("Please enter a valid city name.");
        return;
    }

    let query = city;
    if (country === "US" && state) {
        query = `${city},${state},${country}`;
    } else if (country) {
        query = `${city},${country}`;
    }

    document.getElementById('weather-info').innerHTML = '<p>Loading...</p>';

    const units = useCelsius ? "metric" : "imperial";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=${units}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast:', error);
            alert('Error fetching hourly forecast. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === 404 || data.cod === "404") {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    const unitSymbol = useCelsius ? "°C" : "°F";
    const cityName = `${data.name}, ${data.sys.country}`;
    const temperature = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    tempDivInfo.innerHTML = `<p>${temperature}${unitSymbol}</p>`;
    weatherInfoDiv.innerHTML = `
        <p>${cityName}</p>
        <p>${description}</p>
        <p>Feels like: ${feelsLike}${unitSymbol}</p>
        <p>Humidity: ${humidity}%</p>
    `;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    hourlyForecast.innerHTML = '';

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        let hour = dateTime.getHours();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;

        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour} ${ampm}</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}${useCelsius ? "°C" : "°F"}</span>
            </div>
        `;

        hourlyForecast.innerHTML += hourlyItemHtml;
    });
}

document.getElementById("city").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getWeather();
    }
});

document.getElementById("unit-toggle").addEventListener("change", function () {
    useCelsius = this.checked;
});
