
 document.addEventListener("DOMContentLoaded", function () {
const apiKey = "feabccc1fcc8aabeee435bac5c37fec3"; 
const weatherDisplay = document.getElementById("weatherDisplay");
const cityInput = document.getElementById("cityInput");
const searchCity = document.getElementById("searchCity");
const currentLocation = document.getElementById("currentLocation");
const recentCitiesDropdown = document.getElementById("recentCitiesDropdown");
const recentCities = document.getElementById("recentCities");

let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

// Fetch weather by city name
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
    addToRecentSearches(city);
  } catch (error) {
    weatherDisplay.innerHTML = `<p class="text-red-500">${error.message}</p>`;
  }
}

// Fetch weather by current location
function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        displayWeather(data);
        addToRecentSearches(data.name);
      },
      (error) => {
        weatherDisplay.innerHTML = `<p class="text-red-500">${error.message}</p>`;
      }
    );
  } else {
    weatherDisplay.innerHTML = `<p class="text-red-500">Geolocation is not supported by your browser.</p>`;
  }
}

// Display weather data
function displayWeather(data) {
  const { name, main, weather, wind } = data;
  weatherDisplay.innerHTML = `
    <h2 class="text-2xl font-bold">${name}</h2>
    <p class="text-xl">${weather[0].description}</p>
    <p class="text-xl">Temperature: ${main.temp}°C</p>
    <p class="text-xl">Humidity: ${main.humidity}%</p>
    <p class="text-xl">Wind Speed: ${wind.speed} m/s</p>
    <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
  `;
}

// Add city to recent searches
function addToRecentSearches(city) {
  if (!recentSearches.includes(city)) {
    recentSearches.push(city);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    updateRecentCitiesDropdown();
  }
}

// Update recent cities dropdown
function updateRecentCitiesDropdown() {
  recentCities.innerHTML = recentSearches
    .map((city) => `<option value="${city}">${city}</option>`)
    .join("");
  recentCitiesDropdown.classList.remove("hidden");
}

// Event listeners
searchCity.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeatherByCity(city);
});

currentLocation.addEventListener("click", fetchWeatherByLocation);

recentCities.addEventListener("change", (e) => {
  if (e.target.value) fetchWeatherByCity(e.target.value);
});
async function fetchExtendedForecast(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      displayExtendedForecast(data);
    } catch (error) {
      console.error(error);
    }
  }
  
  function displayExtendedForecast(data) {
    const forecastCards = document.getElementById("forecastCards");
    forecastCards.innerHTML = data.list
      .filter((item, index) => index % 8 === 0) // Get one forecast per day
      .map((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        return `
          <div class="bg-white p-4 rounded shadow">
            <p class="font-bold">${date}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
            <p>Temp: ${item.main.temp}°C</p>
            <p>Wind: ${item.wind.speed} m/s</p>
            <p>Humidity: ${item.main.humidity}%</p>
          </div>
        `;
      })
      .join("");
  }
  
  // Calling this function inside fetchWeatherByCity and fetchWeatherByLocation
  fetchExtendedForecast(validateCity(city));
  // Example: Validate city input
  function validateCity(city) {
if (!city) {
    weatherDisplay.innerHTML = `<p class="text-red-500">Please enter a city name.</p>`;
    return;
  }
}
 })