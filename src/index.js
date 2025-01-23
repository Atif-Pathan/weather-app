import './styles.css';
import carousel from './modules/carouselForecast';
import { fetchWeather } from './modules/weatherAPI';
import displayCurrentConditions from './modules/displayCurrentConditions';
import displayForecast from './modules/displayForecast';

const searchBar = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');
const toggleUnits = document.querySelector('.units-toggle');
const refreshBtn = document.querySelector('.wrap-refresh-icon');
const currentTemp = document.querySelector('.current-temp');

const UNIT_KEY = 'weatherUnit';
const DATA_KEY = 'weatherData';

// Initialize the unit state from localStorage or default to 'metric'
let unit = localStorage.getItem(UNIT_KEY) || 'metric';
toggleUnits.checked = unit === 'us'; // Sync toggle state with stored unit

// Save unit state to localStorage
function saveUnitToStorage(selectedUnit) {
  localStorage.setItem(UNIT_KEY, selectedUnit);
}

// Fetch and save both metric and US data
async function fetchAndSaveWeather(location) {
  try {
    const metricData = await fetchWeather(location, 'metric');
    const usData = await fetchWeather(location, 'us');
    const weatherData = {
      metric: {
        currentConditions: metricData.currentConditions,
        resolvedAddress: metricData.resolvedAddress,
        days: metricData.days,
      },
      us: {
        currentConditions: usData.currentConditions,
        resolvedAddress: usData.resolvedAddress,
        days: usData.days,
      },
    };
    localStorage.setItem(DATA_KEY, JSON.stringify(weatherData));
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Load weather from localStorage and display it
function loadWeatherFromStorage(selectedUnit) {
  const savedData = localStorage.getItem(DATA_KEY);
  if (!savedData) {
    alert('No data available. Please search for a location first.');
    return;
  }
  const weatherData = JSON.parse(savedData);
  const data = weatherData[selectedUnit];
  displayCurrentConditions(
    data.currentConditions,
    data.resolvedAddress,
    selectedUnit
  );
  displayForecast(data.days, selectedUnit);
}

// Unified logic for search and refresh
async function fetchAndDisplayWeather(location) {
  try {
    await fetchAndSaveWeather(location);
    loadWeatherFromStorage(unit);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert(
      'Error fetching weather data: Please check location spelling and validity!'
    );
  }
}

// Search button click handler
searchBtn.addEventListener('click', async () => {
  const location = searchBar.value.trim();
  if (!location) {
    alert('Please enter a location.');
    return;
  }
  saveUnitToStorage(unit); // Save the current unit
  fetchAndDisplayWeather(location);
  carousel.resetCarousel();
});

// Trigger search on Enter key
searchBar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

// Refresh button click handler
refreshBtn.addEventListener('click', async () => {
  const savedData = localStorage.getItem(DATA_KEY);
  if (!savedData) {
    alert('No data to refresh. Please search for a location first.');
    return;
  }
  const weatherData = JSON.parse(savedData);
  const location =
    weatherData.metric.resolvedAddress || weatherData.us.resolvedAddress;
  searchBar.value = location; // Pre-fill the search bar with the location
  searchBtn.click();
  searchBar.value = '';
});

// Toggle units handler
toggleUnits.addEventListener('change', () => {
  const savedData = localStorage.getItem(DATA_KEY);
  if (!savedData) {
    alert('Search a location first.');
    toggleUnits.checked = unit === 'us'; // Reset toggle if no data
    return;
  }
  unit = toggleUnits.checked ? 'us' : 'metric';
  if (unit === 'us') {
    currentTemp.style.color = 'rgb(139, 37, 235)';
  } else {
    currentTemp.style.color = 'rgb(37, 99, 235)';
  }
  saveUnitToStorage(unit); // Save the new unit state
  loadWeatherFromStorage(unit); // Load and display data in the new unit
});

// Load last saved location and unit when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem(DATA_KEY);
  if (savedData) {
    unit = localStorage.getItem(UNIT_KEY) || 'metric'; // Restore the saved unit
    toggleUnits.checked = unit === 'us';
    loadWeatherFromStorage(unit);
    carousel.resetCarousel();
  }
});
