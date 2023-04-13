import './css/reset.css';
import './css/style.scss';
import apiKey from '../apikey.json';
import './js/handleSwitches.js';

import {
  currentWeatherComponent,
  hourlyForecastComponent,
  weeklyForecastComponent,
} from './js/weatherComponents.js';
import { upcomingEventsComponent } from './js/eventComponents.js';
import { historyComponent } from './js/miscComponents.js';

const weatherKey = apiKey.weather;
const ticketmasterkey = apiKey.ticketmaster;

const searchBar = document.getElementById('location-search');

searchBar.addEventListener('keyup', async (e) => {
  e.preventDefault();
  searchBar.nextElementSibling.textContent = ``;
  searchBar.setCustomValidity('');
  if (e.key !== 'Enter') return;
  searchLocation(searchBar.value);

  searchBar.value = '';
});

searchLocation('toronto');
export async function searchLocation(location) {
  const weatherData = await getWeather(location);
  if (weatherData.error) {
    searchBar.nextElementSibling.textContent = `Sorry, we couldn't find that location. Please try again.`;
    searchBar.setCustomValidity('Invalid Search');
    return false;
  }
  displayWeatherData(weatherData);
  saveHistory(location);

  const queryType = getQueryType(location, weatherData.location.name);
  const eventData = await getEvents(queryType, location);

  if (!eventData._embedded) {
    const eventContainer = document.getElementById('event');
    eventContainer.innerHTML = '';
    eventContainer.textContent = 'No events found.';
    return true;
  }
  displayEvents(eventData);

  return true;
}

function getQueryType(locationSearched, locationRetrieved) {
  locationSearched = locationSearched.toUpperCase();
  locationRetrieved = locationRetrieved.toUpperCase();

  if (locationSearched === locationRetrieved) return 'city';
  else if (locationRetrieved !== locationSearched) return 'keyword';
}

function saveHistory(query) {
  const formattedQuery = capitalizeFirstLetter(query);

  const component = historyComponent(formattedQuery);
  const historyContainer = document.querySelector('#history .list');
  console.log(historyContainer);

  if (!hasIdenticalChild(historyContainer, component))
    historyContainer.prepend(component);

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function hasIdenticalChild(parentElement, newElement) {
    const children = parentElement.children;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.textContent === newElement.textContent) {
        return true;
      }
    }

    return false;
  }
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
    return false;
  }
}

async function getEvents(queryType, location) {
  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?size=30&${queryType}=${location}&sort=date,asc&apikey=${ticketmasterkey}`,
      {
        mode: 'cors',
      }
    );
    const eventData = await response.json();

    return eventData;
  } catch (err) {
    console.error(err);
  }
}

function displayWeatherData(weatherData) {
  console.log(weatherData);
  const currentContainer = document.getElementById('current');
  currentContainer.innerHTML = '';
  const currentWeatherUI = currentWeatherComponent(weatherData);
  currentContainer.appendChild(currentWeatherUI);

  const hourlyContainer = document.getElementById('hourly');
  hourlyContainer.innerHTML = '';
  const hourlyUI = hourlyForecastComponent(
    weatherData.forecast.forecastday[0].hour
  );
  hourlyContainer.appendChild(hourlyUI);

  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';
  const forecastUI = weeklyForecastComponent(weatherData.forecast.forecastday);
  forecastContainer.appendChild(forecastUI);
}

function displayEvents(eventData) {
  const eventContainer = document.getElementById('event');
  eventContainer.innerHTML = '';
  const upcomingEventsUI = upcomingEventsComponent(eventData._embedded);
  eventContainer.appendChild(upcomingEventsUI);
}
