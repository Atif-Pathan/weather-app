import './styles.css';
import { fetchWeather } from './modules/weatherAPI';
import displayCurrentConditions from './modules/displayCurrentConditions';
// import test from '../test.json';
// import './modules/carouselForecast';
import carousel from './modules/carouselForecast';
import displayForecast from './modules/displayForecast';

const searchBar = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', async () => {
  console.log(searchBar.value);
  try {
    const location = searchBar.value;
    const weatherData = await fetchWeather(location, 'metric');
    // const weatherData = test;
    displayCurrentConditions(
      weatherData.currentConditions,
      weatherData.resolvedAddress
    );
    displayForecast(weatherData.days);
    carousel.resetCarousel();
  } catch (error) {
    console.log(error);
  }
});
