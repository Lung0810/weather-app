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
const dailySection = document.getElementById("daily-section");

const nextDaysEl = document.getElementById("next-days");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const location = locationInput.value.trim();

  if (location) {
    loadWeather(location);
  }
});

refreshButton.addEventListener("click", () => {
  if (lastLocation) loadWeather(lastLocation);
});

locateButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    setStatus("Geolocation is not supported by this browser.", ture);
    return;
  }

  setStatus("Getting your location...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longtitude } = position.coords;
      loadWeather(`${latitude},${longtitude}`);
    },
    () => {
      setStatus("Could not access your location. Please search manually", true);
    },
    { timeout: 1000 },
  );
});

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

function renderDaily(data) {
  const today = toYmd(new Date());
  const daily = data.days.filter((day) => day.datetime > today).slice(0, 7);

  nextDaysEl.innerHTML = daily.map(dayCard).join("");
  dailySection.classList.remove("hidden");
}

function dayCard(day) {
  const date = new Date(day.datetimeEpoch * 1000).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return `<article class="day-card">
      <p class="day-date">${date}</p>
      <p class="day-icon">${weatherIcon(day.conditions)}</p>
      <p class="day-temp">${Math.round(day.tempmax)}° / ${Math.round(day.tempmin)}°</p>
      <p class="day-meta">
        ${day.conditions}<br />
        ${Math.round(day.precipprob ?? 0)}% rain
      </p>
    </article>`;
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
  dailySection.classList.add("hidden");

  const start = new Date();
  start.setDate(start.getDate() - 1);

  const end = new Date();
  end.setDate(end.getDate() + 7);

  const url = `${BESE_URL}/${encodeURIComponent(location)}/${toYmd(start)}/${toYmd(end)}?unitGroup=metric&include=days,hours,current&key=${API_KEY}&contentType=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}.`);
    }

    setStatus("The Weather is below");

    const data = await response.json();

    renderCurrent(data);
    renderDaily(data);

    currentSection.classList.remove("hidden");
    dailySection.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    setStatus(`Cannot load weather: ${error.message}`, true);
  }
}
