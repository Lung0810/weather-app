const API_KEY = "KW8QWX23ES9LS958DFP7MSBMB";
const BESE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

let lastLocation = "";

const form = document.getElementById("search-form");
const locationInput = document.getElementById("location-input");
const locateButton = document.getElementById("locate-button");
const refreshButton = document.getElementById("refresh-button");

const statusEl = document.getElementById("status");
const currentSection = document.getElementById("current-section");
const hourlySection = document.getElementById("hourly-section");

const previousHoursEl = document.getElementById("previous-hours");
const nextHoursEl = document.getElementById("next-hours");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const location = locationInput.value.trim();

  if (location) {
    loadWeather(location);
  }
});

refreshButton.addEventListener("click", ()=>{
  if(lastLocation) loadWeather(lastLocation)
})

locateButton.addEventListener("click", ()=>{
  if(!navigator.geolocation){
    setStatus("Geolocation is not supported by this browser.", ture)
    return
  }
  
  setStatus("Getting your location...")

  navigator.geolocation.getCurrentPosition((position)=>{
    const {latitude, longtitude} = position.coords
    loadWeather(`${latitude},${longtitude}`)
  },()=>{
    setStatus("Could not access your location. Please search manually", true)
  },{timeout: 1000})
})

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function toYmd(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const days = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${days}`;
}

function renderCurrent(data) {
  const current = data.currentConditions;

  document.getElementById("place").textContent = data.resolvedAddress;
  document.getElementById("temperature").textContent =
    `${weatherIcon(current.conditions)} ${current.conditions}`;
  document.getElementById("wind").textContent =
    `${Math.round(current.windspeed)} km/h`;
  document.getElementById("rain").textContent = `${current.precipprob ?? 0}%`;
  document.getElementById("humidity").textContent =
    `${current.humidity ?? "-"}%`;
}

function renderHourly(data) {
  const hours = data.days.flatMap((day) =>
    (day.hours ?? []).map((hour) => ({
      ...hour,
      dayDate: day.datetime,
    })),
  );

  const nowEpoch = Math.floor(Date.now() / 1000);
  let currentIndex = hours.findIndex((hour) => hour.datetimeEpoch >= nowEpoch);

  if (currentIndex === -1) currentIndex = hours.length - 1;

  const previous = hours.slice(Math.max(0, currentIndex - 24), currentIndex);

  const next = hours.slice(currentIndex + 1, currentIndex + 25);

  previousHoursEl.innerHTML = previous.length
    ? previous.map((hour) => hourCard(hour)).join("")
    : `<p class="status">No earlier hourly data available.</p>`;

  nextHoursEl.innerHTML = next.length
    ? next.map((hour) => hourCard(hour)).join("")
    : `<p class="status">No later hourly data available.</p>`;
}

function hourCard(hour){
  const time = new Date(hour.datetimeEpoch * 1000).toLocaleString([],{
    weekday: "short",
    hour: "numeric"
  })

  return `
  <article class="hour-card">
    <div class="time">${time}</div>
    <div class="icon">${weatherIcon(hour.conditions)}</div>
    <div class="temp">${Math.round(hour.temp)}°C</div>
    <div class="meta>
      ${Math.round(hour.windspeed)} km/h<br>
      ${hour.precipprob ?? 0}% rain</div>
    </article>`
}

function weatherIcon(conditions = "") {
  const value = conditions.toLowerCase();

  if (value.includes("thunder")) return "⛈️";
  if (value.includes("snow") || value.includes("sheet")) return "❄️";
  if (value.includes("rain") || value.includes("shower")) return "🌧️";
  if (value.includes("fog")) return "🌫️";
  if (value.includes("wind")) return "💨";
  if (value.includes("overcast")) return "☁️";
  if (value.includes("cloud")) return "☁️";
  if (value.includes("partly")) return "⛅";
  if (value.includes("clear") || value.includes("sun")) return "☀️";

  return "🌤️";
}

async function loadWeather(location) {
  if (API_KEY.includes("YOUR_")) {
    setStatus("Add your Visual Crosing API key before searching.", true);
    return;
  }

  lastLocation = location;
  setStatus("Loading Weather...");

  currentSection.classList.add("hidden");
  hourlySection.classList.add("hidden");

  const start = new Date();
  start.setDate(start.getDate() - 1);

  const end = new Date();
  end.setDate(end.getDate() + 1);

  const url = `${BESE_URL}/${encodeURIComponent(location)}/${toYmd(start)}/${toYmd(end)}?unitGroup=metric&include=hours,current&key=${API_KEY}&contentType=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}.`);
    }

    setStatus("The Weather is below");

    const data = await response.json();
    renderCurrent(data);
    renderHourly(data);

    currentSection.classList.remove("hidden");
    hourlySection.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    setStatus(`Cannot load weather: ${error.message}`, true);
  }
}
