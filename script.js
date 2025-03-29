function getWeather() {
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

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


function kelvinToFahrenheit(kelvin) {
    return Math.round((kelvin - 273.15) * 9/5 + 32);
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === 404 || data.cod === "404") {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    const cityName = data.name;
    const temperature = kelvinToFahrenheit(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;  

    const temperatureHTML = `<p>${temperature}°F</p>`;
    const weatherHTML = `
        <p>${cityName}</p>
        <p>${description}</p>
    `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8); // still only 8 × 3hr blocks

    hourlyForecast.innerHTML = ''; // Clear previous content

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        let hour = dateTime.getHours();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;

        const temperature = kelvinToFahrenheit(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;  

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour} ${ampm}</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°F</span>
            </div>
        `;

        hourlyForecast.innerHTML += hourlyItemHtml;
    });
}


function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
