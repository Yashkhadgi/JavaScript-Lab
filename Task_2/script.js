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
                temp: 27,
                feels: 29,
                high: 30,
                low: 23,
                humidity: "82%",
                wind: "18 km/h",
                uv: "4 (Moderate)",
                aqi: "38 (Good)",
                pressure: "1012 hPa",
                visibility: "9.5 km"
            },
            "Mumbai": {
                condition: "Heavy Rain & Thunderstorms",
                icon: "fa-cloud-bolt",
                iconColor: "text-cyan",
                temp: 29,
                feels: 34,
                high: 31,
                low: 26,
                humidity: "90%",
                wind: "28 km/h",
                uv: "3 (Low)",
                aqi: "55 (Moderate)",
                pressure: "1008 hPa",
                visibility: "6.0 km"
            },
            "Nagpur": {
                condition: "Scattered Clouds",
                icon: "fa-cloud-sun",
                iconColor: "text-amber",
                temp: 34,
                feels: 39,
                high: 36,
                low: 27,
                humidity: "65%",
                wind: "12 km/h",
                uv: "8 (Very High)",
                aqi: "72 (Moderate)",
                pressure: "1010 hPa",
                visibility: "10 km"
            },
            "Nashik": {
                condition: "Cool Breeze & Overcast",
                icon: "fa-cloud",
                iconColor: "text-blue",
                temp: 25,
                feels: 26,
                high: 28,
                low: 21,
                humidity: "78%",
                wind: "15 km/h",
                uv: "5 (Moderate)",
                aqi: "42 (Good)",
                pressure: "1014 hPa",
                visibility: "10 km"
            },
            "Chhatrapati Sambhajinagar": {
                condition: "Partly Cloudy",
                icon: "fa-cloud-sun",
                iconColor: "text-amber",
                temp: 31,
                feels: 33,
                high: 33,
                low: 24,
                humidity: "70%",
                wind: "14 km/h",
                uv: "7 (High)",
                aqi: "60 (Moderate)",
                pressure: "1011 hPa",
                visibility: "9.0 km"
            }
        },
        "Delhi NCR": {
            "New Delhi": {
                condition: "Hazy Sunshine & Warm",
                icon: "fa-sun",
                iconColor: "text-amber",
                temp: 36,
                feels: 41,
                high: 38,
                low: 28,
                humidity: "58%",
                wind: "10 km/h",
                uv: "9 (Very High)",
                aqi: "185 (Unhealthy)",
                pressure: "1006 hPa",
                visibility: "4.5 km"
            },
            "Gurgaon": {
                condition: "Sunny & Humid",
                icon: "fa-sun",
                iconColor: "text-amber",
                temp: 35,
                feels: 40,
                high: 37,
                low: 27,
                humidity: "62%",
                wind: "12 km/h",
                uv: "9 (Very High)",
                aqi: "160 (Unhealthy)",
                pressure: "1007 hPa",
                visibility: "5.0 km"
            },
            "Noida": {
                condition: "Mostly Sunny",
                icon: "fa-sun",
                iconColor: "text-amber",
                temp: 35,
                feels: 39,
                high: 37,
                low: 28,
                humidity: "60%",
                wind: "11 km/h",
                uv: "8 (Very High)",
                aqi: "170 (Unhealthy)",
                pressure: "1007 hPa",
                visibility: "5.0 km"
            }
        },
        "Karnataka": {
            "Bengaluru": {
                condition: "Pleasant Drizzle & Wind",
                icon: "fa-cloud-rain",
                iconColor: "text-cyan",
                temp: 23,
                feels: 23,
                high: 26,
                low: 19,
                humidity: "85%",
                wind: "22 km/h",
                uv: "4 (Moderate)",
                aqi: "28 (Good)",
                pressure: "1016 hPa",
                visibility: "10 km"
            },
            "Mysuru": {
                condition: "Passing Clouds",
                icon: "fa-cloud-sun",
                iconColor: "text-amber",
                temp: 26,
                feels: 27,
                high: 28,
                low: 20,
                humidity: "75%",
                wind: "16 km/h",
                uv: "6 (High)",
                aqi: "32 (Good)",
                pressure: "1015 hPa",
                visibility: "10 km"
            }
        },
        "California": {
            "Los Angeles": {
                condition: "Clear Sunny Skies",
                icon: "fa-sun",
                iconColor: "text-amber",
                temp: 28,
                feels: 28,
                high: 30,
                low: 18,
                humidity: "45%",
                wind: "14 km/h",
                uv: "8 (Very High)",
                aqi: "45 (Good)",
                pressure: "1013 hPa",
                visibility: "16 km"
            },
            "San Francisco": {
                condition: "Coastal Fog & Mild",
                icon: "fa-smog",
                iconColor: "text-blue",
                temp: 18,
                feels: 18,
                high: 20,
                low: 13,
                humidity: "80%",
                wind: "24 km/h",
                uv: "5 (Moderate)",
                aqi: "30 (Good)",
                pressure: "1017 hPa",
                visibility: "8.0 km"
            }
        }
    };

    const selectState = document.getElementById('select-state');
    const selectCity = document.getElementById('select-city');
    const liveClock = document.getElementById('live-clock');

    const dispLocation = document.getElementById('disp-location');
    const dispCondition = document.getElementById('disp-condition');
    const dispIcon = document.getElementById('disp-icon');
    const dispTemp = document.getElementById('disp-temp');
    const dispFeels = document.getElementById('disp-feels');
    const dispHigh = document.getElementById('disp-high');
    const dispLow = document.getElementById('disp-low');

    const dispHumidity = document.getElementById('dispHumidity');
    const dispWind = document.getElementById('dispWind');
    const dispUv = document.getElementById('dispUv');
    const dispAqi = document.getElementById('dispAqi');
    const dispPressure = document.getElementById('dispPressure');
    const dispVisibility = document.getElementById('dispVisibility');

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

    // Cascading State Change Listener
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

        // Auto-select first city
        if (cities.length > 0) {
            selectCity.value = cities[0];
            renderWeather(chosenState, cities[0]);
        }
    });

    // City Change Listener
    selectCity.addEventListener('change', () => {
        const chosenState = selectState.value;
        const chosenCity = selectCity.value;
        renderWeather(chosenState, chosenCity);
    });

    function renderWeather(state, city) {
        const info = weatherData[state][city];

        dispLocation.textContent = `${city.toUpperCase()} • ${state.toUpperCase()}`;
        dispCondition.textContent = info.condition;
        dispIcon.className = `weather-big-icon ${info.iconColor}`;
        dispIcon.innerHTML = `<i class="fa-solid ${info.icon}"></i>`;
        
        dispTemp.textContent = info.temp;
        dispFeels.textContent = `${info.feels}°C`;
        dispHigh.textContent = `${info.high}°C`;
        dispLow.textContent = `${info.low}°C`;

        document.getElementById('disp-humidity').textContent = info.humidity;
        document.getElementById('disp-wind').textContent = info.wind;
        document.getElementById('disp-uv').textContent = info.uv;
        document.getElementById('disp-aqi').textContent = info.aqi;
        document.getElementById('disp-pressure').textContent = info.pressure;
        document.getElementById('disp-visibility').textContent = info.visibility;
    }

    // Default Selection: Maharashtra -> Pune
    selectState.value = "Maharashtra";
    selectState.dispatchEvent(new Event('change'));
});
