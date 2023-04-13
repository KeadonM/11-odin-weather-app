import './css/reset.css';
import './css/style.scss';
import apiKey from '../apikey.json';
import {
  currentWeatherComponent,
  weeklyForecastComponent,
} from './js/weatherComponents.js';
import { upcomingEventsComponent } from './js/eventComponents.js';

const weatherKey = apiKey.weather;
const ticketmasterkey = apiKey.ticketmaster;

const searchBar = document.getElementById('location-search');

searchBar.addEventListener('keyup', (e) => {
  e.preventDefault();
  if (e.key !== 'Enter') return;
  searchLocation(searchBar.value);
});

searchLocation('toronto');
async function searchLocation(location) {
  const weatherData = await getWeather(location);
  displayWeatherData(weatherData);

  const queryType = getQueryType(location, weatherData.location.name);
  const eventData = await getEvents(queryType, location);
  displayEvents(eventData);
}

function getQueryType(locationSearched, locationRetrieved) {
  locationSearched = locationSearched.toUpperCase();
  locationRetrieved = locationRetrieved.toUpperCase();

  if (locationSearched === locationRetrieved) return 'city';
  else if (locationRetrieved !== locationSearched) return 'keyword';
}

async function getWeather(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${location}&days=7&aqi=no&alerts=no`,
      {
        mode: 'cors',
      }
    );
    const weatherData = await response.json();

    return weatherData;
  } catch (err) {
    console.log(err);
  }
}

async function getEvents(queryType, location) {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?size=8&${queryType}=${location}&sort=date,asc&apikey=${ticketmasterkey}`,
      {
        mode: 'cors',
      }
    );
    const eventData = await response.json();

    return eventData;
  } catch (err) {
    console.log(err);
  }
}

function displayWeatherData(weatherData) {
  // console.log(weatherData);

  const currentContainer = document.getElementById('current');
  currentContainer.innerHTML = '';
  const currentWeatherUI = currentWeatherComponent(weatherData);
  currentContainer.appendChild(currentWeatherUI);

  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';
  const forecastUI = weeklyForecastComponent(weatherData.forecast.forecastday);
  forecastContainer.appendChild(forecastUI);
}

function displayEvents(eventData) {
  console.log(eventData);

  const eventContainer = document.getElementById('event');
  eventContainer.innerHTML = '';
  const upcomingEventsUI = upcomingEventsComponent(eventData._embedded);
  eventContainer.appendChild(upcomingEventsUI);
}
