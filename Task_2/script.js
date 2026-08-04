/**
 * Task 2: Cascading Weather Information Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const weatherData = {
        "Maharashtra": {
            "Pune": {
                condition: "Monsoon Light Showers",
                icon: "fa-cloud-showers-heavy",
                iconColor: "text-blue",
                tempC: 27, feelsC: 29, highC: 30, lowC: 23,
                humidity: "82%", wind: "18 km/h", uv: "4 (Moderate)", aqi: "38 (Good)", pressure: "1012 hPa", visibility: "9.5 km",
                forecast: [
                    { day: "MON", tempC: 27, icon: "fa-cloud-showers-heavy", color: "text-blue" },
                    { day: "TUE", tempC: 28, icon: "fa-cloud-sun-rain", color: "text-cyan" },
                    { day: "WED", tempC: 29, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "THU", tempC: 26, icon: "fa-cloud-rain", color: "text-blue" },
                    { day: "FRI", tempC: 28, icon: "fa-sun", color: "text-amber" }
                ]
            },
            "Mumbai": {
                condition: "Heavy Rain & Thunderstorms",
                icon: "fa-cloud-bolt",
                iconColor: "text-cyan",
                tempC: 29, feelsC: 34, highC: 31, lowC: 26,
                humidity: "90%", wind: "28 km/h", uv: "3 (Low)", aqi: "55 (Moderate)", pressure: "1008 hPa", visibility: "6.0 km",
                forecast: [
                    { day: "MON", tempC: 29, icon: "fa-cloud-bolt", color: "text-cyan" },
                    { day: "TUE", tempC: 30, icon: "fa-cloud-showers-heavy", color: "text-blue" },
                    { day: "WED", tempC: 31, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "THU", tempC: 29, icon: "fa-cloud-rain", color: "text-blue" },
                    { day: "FRI", tempC: 30, icon: "fa-cloud-sun-rain", color: "text-cyan" }
                ]
            },
            "Nagpur": {
                condition: "Scattered Clouds",
                icon: "fa-cloud-sun",
                iconColor: "text-amber",
                tempC: 34, feelsC: 39, highC: 36, lowC: 27,
                humidity: "65%", wind: "12 km/h", uv: "8 (Very High)", aqi: "72 (Moderate)", pressure: "1010 hPa", visibility: "10 km",
                forecast: [
                    { day: "MON", tempC: 34, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "TUE", tempC: 35, icon: "fa-sun", color: "text-amber" },
                    { day: "WED", tempC: 36, icon: "fa-sun", color: "text-amber" },
                    { day: "THU", tempC: 33, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "FRI", tempC: 32, icon: "fa-cloud-rain", color: "text-blue" }
                ]
            },
            "Nashik": {
                condition: "Cool Breeze & Overcast",
                icon: "fa-cloud",
                iconColor: "text-blue",
                tempC: 25, feelsC: 26, highC: 28, lowC: 21,
                humidity: "78%", wind: "15 km/h", uv: "5 (Moderate)", aqi: "42 (Good)", pressure: "1014 hPa", visibility: "10 km",
                forecast: [
                    { day: "MON", tempC: 25, icon: "fa-cloud", color: "text-blue" },
                    { day: "TUE", tempC: 26, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "WED", tempC: 27, icon: "fa-sun", color: "text-amber" },
                    { day: "THU", tempC: 24, icon: "fa-cloud-rain", color: "text-blue" },
                    { day: "FRI", tempC: 25, icon: "fa-cloud-sun-rain", color: "text-cyan" }
                ]
            }
        },
        "Delhi NCR": {
            "New Delhi": {
                condition: "Hazy Sunshine & Warm",
                icon: "fa-sun",
                iconColor: "text-amber",
                tempC: 36, feelsC: 41, highC: 38, lowC: 28,
                humidity: "58%", wind: "10 km/h", uv: "9 (Very High)", aqi: "185 (Unhealthy)", pressure: "1006 hPa", visibility: "4.5 km",
                forecast: [
                    { day: "MON", tempC: 36, icon: "fa-sun", color: "text-amber" },
                    { day: "TUE", tempC: 37, icon: "fa-sun", color: "text-amber" },
                    { day: "WED", tempC: 38, icon: "fa-sun", color: "text-amber" },
                    { day: "THU", tempC: 35, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "FRI", tempC: 34, icon: "fa-cloud", color: "text-blue" }
                ]
            },
            "Gurgaon": {
                condition: "Sunny & Humid",
                icon: "fa-sun",
                iconColor: "text-amber",
                tempC: 35, feelsC: 40, highC: 37, lowC: 27,
                humidity: "62%", wind: "12 km/h", uv: "9 (Very High)", aqi: "160 (Unhealthy)", pressure: "1007 hPa", visibility: "5.0 km",
                forecast: [
                    { day: "MON", tempC: 35, icon: "fa-sun", color: "text-amber" },
                    { day: "TUE", tempC: 36, icon: "fa-sun", color: "text-amber" },
                    { day: "WED", tempC: 37, icon: "fa-sun", color: "text-amber" },
                    { day: "THU", tempC: 34, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "FRI", tempC: 33, icon: "fa-cloud-rain", color: "text-blue" }
                ]
            }
        },
        "Karnataka": {
            "Bengaluru": {
                condition: "Pleasant Drizzle & Wind",
                icon: "fa-cloud-rain",
                iconColor: "text-cyan",
                tempC: 23, feelsC: 23, highC: 26, lowC: 19,
                humidity: "85%", wind: "22 km/h", uv: "4 (Moderate)", aqi: "28 (Good)", pressure: "1016 hPa", visibility: "10 km",
                forecast: [
                    { day: "MON", tempC: 23, icon: "fa-cloud-rain", color: "text-cyan" },
                    { day: "TUE", tempC: 24, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "WED", tempC: 25, icon: "fa-sun", color: "text-amber" },
                    { day: "THU", tempC: 23, icon: "fa-cloud-showers-heavy", color: "text-blue" },
                    { day: "FRI", tempC: 24, icon: "fa-cloud-sun-rain", color: "text-cyan" }
                ]
            }
        },
        "California": {
            "Los Angeles": {
                condition: "Clear Sunny Skies",
                icon: "fa-sun",
                iconColor: "text-amber",
                tempC: 28, feelsC: 28, highC: 30, lowC: 18,
                humidity: "45%", wind: "14 km/h", uv: "8 (Very High)", aqi: "45 (Good)", pressure: "1013 hPa", visibility: "16 km",
                forecast: [
                    { day: "MON", tempC: 28, icon: "fa-sun", color: "text-amber" },
                    { day: "TUE", tempC: 29, icon: "fa-sun", color: "text-amber" },
                    { day: "WED", tempC: 30, icon: "fa-sun", color: "text-amber" },
                    { day: "THU", tempC: 27, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "FRI", tempC: 26, icon: "fa-cloud", color: "text-blue" }
                ]
            },
            "San Francisco": {
                condition: "Coastal Fog & Mild",
                icon: "fa-smog",
                iconColor: "text-blue",
                tempC: 18, feelsC: 18, highC: 20, lowC: 13,
                humidity: "80%", wind: "24 km/h", uv: "5 (Moderate)", aqi: "30 (Good)", pressure: "1017 hPa", visibility: "8.0 km",
                forecast: [
                    { day: "MON", tempC: 18, icon: "fa-smog", color: "text-blue" },
                    { day: "TUE", tempC: 19, icon: "fa-cloud-sun", color: "text-amber" },
                    { day: "WED", tempC: 20, icon: "fa-sun", color: "text-amber" },
                    { day: "THU", tempC: 17, icon: "fa-cloud-rain", color: "text-cyan" },
                    { day: "FRI", tempC: 18, icon: "fa-cloud", color: "text-blue" }
                ]
            }
        }
    };

    const selectState = document.getElementById('select-state');
    const selectCity = document.getElementById('select-city');
    const liveClock = document.getElementById('live-clock');

    const btnUnitC = document.getElementById('btn-unit-c');
    const btnUnitF = document.getElementById('btn-unit-f');
    const dispUnitSymbol = document.getElementById('disp-unit-symbol');

    const dispLocation = document.getElementById('disp-location');
    const dispCondition = document.getElementById('disp-condition');
    const dispIcon = document.getElementById('disp-icon');
    const dispTemp = document.getElementById('disp-temp');
    const dispFeels = document.getElementById('disp-feels');
    const dispHigh = document.getElementById('disp-high');
    const dispLow = document.getElementById('disp-low');

    const forecastGrid5 = document.getElementById('forecast-grid-5');

    let isCelsius = true;

    // Populate State Dropdown
    Object.keys(weatherData).forEach(state => {
        const opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        selectState.appendChild(opt);
    });

    // Clock
    function updateClock() {
        const now = new Date();
        liveClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Unit Toggle Listeners
    btnUnitC.addEventListener('click', () => {
        isCelsius = true;
        btnUnitC.classList.add('active');
        btnUnitF.classList.remove('active');
        dispUnitSymbol.textContent = "°C";
        refreshCurrentView();
    });

    btnUnitF.addEventListener('click', () => {
        isCelsius = false;
        btnUnitF.classList.add('active');
        btnUnitC.classList.remove('active');
        dispUnitSymbol.textContent = "°F";
        refreshCurrentView();
    });

    function toF(degC) {
        return Math.round((degC * 9/5) + 32);
    }

    // Cascading State Listener
    selectState.addEventListener('change', () => {
        const chosenState = selectState.value;
        const cities = Object.keys(weatherData[chosenState]);

        selectCity.innerHTML = '<option value="" disabled selected>-- Select City --</option>';
        cities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            selectCity.appendChild(opt);
        });

        selectCity.disabled = false;

        if (cities.length > 0) {
            selectCity.value = cities[0];
            renderWeather(chosenState, cities[0]);
        }
    });

    selectCity.addEventListener('change', () => {
        refreshCurrentView();
    });

    function refreshCurrentView() {
        const chosenState = selectState.value;
        const chosenCity = selectCity.value;
        if (chosenState && chosenCity) {
            renderWeather(chosenState, chosenCity);
        }
    }

    function renderWeather(state, city) {
        const info = weatherData[state][city];

        dispLocation.textContent = `${city.toUpperCase()} • ${state.toUpperCase()}`;
        dispCondition.textContent = info.condition;
        dispIcon.className = `weather-big-icon ${info.iconColor}`;
        dispIcon.innerHTML = `<i class="fa-solid ${info.icon}"></i>`;

        const curTemp = isCelsius ? info.tempC : toF(info.tempC);
        const curFeels = isCelsius ? `${info.feelsC}°C` : `${toF(info.feelsC)}°F`;
        const curHigh = isCelsius ? `${info.highC}°C` : `${toF(info.highC)}°F`;
        const curLow = isCelsius ? `${info.lowC}°C` : `${toF(info.lowC)}°F`;

        dispTemp.textContent = curTemp;
        dispFeels.textContent = curFeels;
        dispHigh.textContent = curHigh;
        dispLow.textContent = curLow;

        document.getElementById('disp-humidity').textContent = info.humidity;
        document.getElementById('disp-wind').textContent = info.wind;
        document.getElementById('disp-uv').textContent = info.uv;
        document.getElementById('disp-aqi').textContent = info.aqi;
        document.getElementById('disp-pressure').textContent = info.pressure;
        document.getElementById('disp-visibility').textContent = info.visibility;

        // Render 5-Day Forecast Cards
        forecastGrid5.innerHTML = "";
        info.forecast.forEach(item => {
            const fTemp = isCelsius ? `${item.tempC}°C` : `${toF(item.tempC)}°F`;

            const fCard = document.createElement('div');
            fCard.className = 'forecast-card';
            fCard.innerHTML = `
                <span class="forecast-day">${item.day}</span>
                <i class="fa-solid ${item.icon} forecast-icon ${item.color}"></i>
                <span class="forecast-temp mono">${fTemp}</span>
            `;
            forecastGrid5.appendChild(fCard);
        });
    }

    // Default Selection: Maharashtra -> Pune
    selectState.value = "Maharashtra";
    selectState.dispatchEvent(new Event('change'));
});
