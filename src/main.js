import './css/reset.css';
import './css/sliderSwitch.scss';
import './css/style.scss';
import apiKey from '../apikey.json';
import './js/handleSwitches.js';
import { runAddScrollEvents } from './js/mouseToTouch.js';
import {
  currentWeatherComponent,
  hourlyForecastComponent,
  weeklyForecastComponent,
  localTimeComponent,
} from './js/weatherComponents.js';
import { upcomingEventsComponent } from './js/eventComponents.js';
import { historyComponent } from './js/miscComponents.js';

const weatherKey = apiKey.weather;
const ticketmasterkey = apiKey.ticketmaster;
const searchBar = document.getElementById('location-search');

searchBar.addEventListener('keyup', async (e) => {
  e.preventDefault();
  searchBar.parentElement.nextElementSibling.textContent = ``;
  searchBar.setCustomValidity('');
  if (e.key !== 'Enter') return;

  searchLocation(searchBar.value);
  searchBar.value = '';
});

(async function geoSearch() {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ip = await ipResponse.json();

    const ipDataResponse = await fetch(`http://ip-api.com/json/${ip.ip}`);
    const ipData = await ipDataResponse.json();

    const city = ipData.city === undefined ? 'Toronto' : ipData.city;

    searchLocation(city);
  } catch (err) {
    console.error(err);
    console.warn(`Couldn't find users location`);

    searchLocation('Toronto');
  }
})();

export async function searchLocation(location) {
  const weatherData = await getWeather(location);
  if (weatherData.error) {
    searchBar.parentElement.nextElementSibling.textContent = `Sorry, we couldn't find that location. Please try again.`;
    searchBar.setCustomValidity('Invalid Search');
    return false;
  }
  displayWeatherData(weatherData);
  saveHistory(weatherData.location.name);
  document.title = weatherData.location.name + ' | Weatherly';

  const queryType = getQueryType(location, weatherData.location.name);
  const eventData = await getEvents(queryType, location);

  if (!eventData._embedded) {
    const eventContainer = document.getElementById('event');
    eventContainer.innerHTML = '';
    eventContainer.appendChild(buildHeading('No Events Found'));
    return true;
  }
  displayEvents(eventData);
  runAddScrollEvents();

  return true;
}

function getQueryType(locationSearched, locationRetrieved) {
  locationSearched = locationSearched.toUpperCase();
  locationRetrieved = locationRetrieved.toUpperCase();

  if (locationSearched === locationRetrieved) return 'city';
  else if (locationRetrieved !== locationSearched) return 'keyword';
}

function saveHistory(query) {
  const component = historyComponent(query);
  const historyContainer = document.querySelector('#history .list');

  if (!hasIdenticalChild(historyContainer, component))
    historyContainer.prepend(component);

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
      `https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${location}&days=8&aqi=no&alerts=no`,
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
  const localTimeContainer = document.getElementById('time');
  localTimeContainer.innerHTML = '';
  const localTimeUI = localTimeComponent(weatherData);
  localTimeContainer.appendChild(localTimeUI);

  const currentWeather = document.getElementById('current');
  currentWeather.innerHTML = '';
  const currentWeatherUI = currentWeatherComponent(weatherData);
  currentWeather.appendChild(currentWeatherUI);

  const hourlyContainer = document.getElementById('hourly');
  hourlyContainer.innerHTML = '';
  const hourlyUI = hourlyForecastComponent(weatherData);
  hourlyContainer.appendChild(hourlyUI);

  const forecastContainer = document.getElementById('daily');
  forecastContainer.innerHTML = '';
  const forecastUI = weeklyForecastComponent(weatherData.forecast.forecastday);
  forecastContainer.appendChild(forecastUI);
}

function displayEvents(eventData) {
  const eventContainer = document.getElementById('event');
  eventContainer.innerHTML = '';

  eventContainer.appendChild(buildHeading('Upcoming Events'));

  const upcomingEventsUI = upcomingEventsComponent(eventData._embedded);
  eventContainer.appendChild(upcomingEventsUI);
}

function buildHeading(content) {
  const heading = document.createElement('p');
  heading.textContent = content;
  heading.className = 'heading';

  return heading;
}
