import './css/reset.css';
import './css/style.scss';
import apiKey from '../apikey.json';
import {
  currentWeatherComponent,
  weeklyForecastComponent,
} from './js/uiComponents.js';

const key = apiKey.key;

const searchBar = document.getElementById('location-search');

searchBar.addEventListener('keyup', (e) => {
  e.preventDefault();
  if (e.key === 'Enter') getWeather(searchBar.value);
});

getWeather('toronto');

async function getWeather(location) {
  try {
    const respone = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=7&aqi=no&alerts=no`,
      {
        mode: 'cors',
      }
    );

    const weatherData = await respone.json();

    console.log(weatherData);

    const currentContainer = document.getElementById('current');
    const currentWeatherUI = currentWeatherComponent(weatherData);
    currentContainer.appendChild(currentWeatherUI);

    const forecastContainer = document.getElementById('forecast');
    const forecastUI = weeklyForecastComponent(
      weatherData.forecast.forecastday
    );
    forecastContainer.appendChild(forecastUI);
  } catch (err) {
    console.log(err);
  }
}
