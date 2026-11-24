const API_KEY = "KW8QWX23ES9LS958DFP7MSBMB"; //API Key
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"; //BASE_URL

const form = document.getElementById("search-form");
const locationInput = document.getElementById("loaction-input");
const refreshButton = document.getElementById("refresh-button");

const statusElement = document.getElementById("status");
const currentWeatherSection = document.getElementById("current-weather");
const hourlySection = document.getElementById("hourly-section");

const previousHourEl = document.getElementById("previous-hour");
const nextHourEl = document.getElementById("next-hour");

let lastLocation = "";

//Prevent event default
form.addEventListener("sumbit", (e) => {
  e.preventDefault();

  const location = locationInput.value.trim();

  if (location) loadWeather(location);
});

function renderCurrentWeather(data) {
    const current = data.currentConditions;

    document.getElementById("location-name").textContent = data.resolvedAddress;

    const currentDate = new Date (current.datetimeEpoch ?? Math.floor(Date.now()/1000)) * 1000;

    document.getElementById("current-date").textContent = currentDate.toLocaleString([], {
        weekday : "long",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minutes: "2-digit"
    })

    document.getElementById("current-date").textContent = weatherIcon(current.conditions)

    document.getElementById("current-temperate").textContent = `${Math.round(current.temp)}°C`

    document.getElementById("wind").textContent = `${Math.round(current.windspeed ?? 0)} km/h`

    document.getElementById("rain").textContent = `${current.precipprob ?? 0}%`

    document.getElementById("rain").textContent = `${current.humidty ?? "-"}%`

    const labels = document.querySelectorAll(".detail-label")

    if(labels.length >= 3){
        labels[0].textContent = "Wind";
        labels[1].textContent = "Rain chance";
        labels[2].textContent = "Humidty"
    }
}

function renderHourlyWeather(data) {}

function hourCard(hour) {}

function weatherIcon(conditions = "") {}

function setStatus() {}

function toYmd() {}

//Fetch Weather
async function loadWeather(location) {
  lastLocation = location;
  setStatus("Loading weather....");

  currentWeatherSection.classList.add("hidden");
  hourlySection.classList.add("hidden");

  const start = new Date();
  start.setDate(start.getDate() - 1);

  const end = new Date();
  end.setDate(end.getDate() + 1);

  const url =
    `${BASE_URL}` +
    `/${encodeURIComponent(location)}/${toYmd(start)}/${toYmd(end)}` +
    `?unitGroup=metric&include=hours,current&key=${API_KEY}&contentType=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}`);
    }

    const data = await response.json();

    renderCurrentWeather(data);
    renderHourlyWeather(data);

    currentWeatherSection.classList.remove("hidden");
    hourlySection.classList.remove("hidden");

    setStatus(`Showing weather for ${data.resolvedAddress}`);
  } catch (error) {
    console.error(error);
    setStatus("Could not load weather....", true);
  }
}
