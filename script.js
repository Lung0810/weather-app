const API_KEY = "KW8QWX23ES9LS958DFP7MSBMB"; //API Key
const BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" //BASE_URL

const form = document.getElementById("search-form");
const locationInput = document.getElementById("loaction-input");
const refreshButton = document.getElementById("refresh-button");

const statusElement = document.getElementById("status");
const currentWeatherSection = document.getElementById("current-weather");
const hourlySection = document.getElementById("hourly-section");

const previousHourEl = document.getElementById("previous-hour");
const nextHourEl = document.getElementById("next-hour");

let lastLocation = "";