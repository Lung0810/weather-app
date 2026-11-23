const API_KEY = "KW8QWX23ES9LS958DFP7MSBMB"; //API Key
const BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"

const cityInput = document.querySelector(".city-input")
const searchButton = document.querySelector(".search-button")
const locationButton = document.querySelector(".location-button")
const currentWeatherDiv = document.querySelector(".current-weather")
const weatherCardsDiv = document.querySelector(".weather-cards")

// Function to show loading spinner
const showLoading = () => {
    currentWeatherDiv.innerHTML = `<div class="loading-spinner></div>`;
    weatherCardsDiv.innerHTML = "";
}

// Function to hide loading spinner
const hideLoading = () => {
    const spinner = document.querySelector(".loading-spinner")
    if (spinner) spinner.remove();
}

// Function to get weather-specific icon, animation, and background
const getWeatherDetailsWithEffect = (weatherCondition, iconCode) => {
    const isDay = iconCode.includes("d")
}