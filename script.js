const API_KEY = "KW8QWX23ES9LS958DFP7MSBMB"
const BESE_URL ="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"

const form = document.getElementById("search-form");
const locationInput = document.getElementById("location-input");
const loacateButton = document.getElementById("locate-button")
const refreshButton = document.getElementById("refresh-button");

const statusEl = document.getElementById("status")
const currentSection = document.getElementById("current-section")
const hourlySection = document.getElementById("hourly-section")

const previousHoursEl = document.getElementById("previous-hours")
const nextHoursEl = document.getElementById("next-hours")

form.addEventListener("submit",(e)=>{
  e.preventDefault();

  const location = locationInput.value.trim();

  if(location){
    loadWeather(location)
  }
})

function setStatus(message, isError=false){
  statusEl.textContent = message
  statusEl.classList.toggle("error", isError)
}

function toYmd(date){
  const year = date.getFullYear();
  const month = String(date.getMonth()+1).padStart(2, "0")
  const days = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${days}`
}

function renderCurrent(data){
  const current = data.currentConditions;

  document.getElementById("place").textContent = data.resolvedAddress
  document.getElementById("temperature").textContent = `${weatherIcon(current.conditions)} ${current.conditions}`
}

function weatherIcon(conditions="") {
  const value = conditions.toLowerCase();

  if (value.includes("thunder")) return "⛈️";
  if (value.includes("snow")||value.includes("sheet")) return "❄️";

}


async function loadWeather(){
  if(API_KEY.includes("YOUR_")){
    setStatus("Add your Visual Crosing API key before searching.", true)
  }

  lastLocation = location;
  setStatus("Loading Weather...")

  currentSection.classList.add("hidden")
  hourlySection.classList.add("hidden")

  const start = new Date()
  start.setDate(start.getDate() - 1)

  const end = new Date()
  end.setDate(end.getDate()-1)

  const url = `${BESE_URL}/${encodeURIComponent(location)}/${toYmd(start)}/${toYmd(end)}?unitGroup=metric&include=hours,current&key=${API_KEY}&connectType=json`

  try{
    const response = await fetch(url);

    if(!response){
      throw new Error(`Weather request failed with status ${response.status}.`)
    } 

    const data = await response.json()
    renderCurrent(data)
    renderHourly(data)

    currentSection.classList.remove("hidden")
    hourlySection.classList.remove("hidden")
  } catch(error) {
    console.error(error)
    setStatus("Cannot load Weather. Check the location and Your API key, then try again", true)
  }
}

