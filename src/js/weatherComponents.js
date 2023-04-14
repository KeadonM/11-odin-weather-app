import { format, parseISO } from 'date-fns';

export function localTimeComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'current-weather-wrapper';

  const locationData = buildDataList(data.location);
  wrapper.appendChild(locationData);

  const currentAstro = buildDataList(data.forecast.forecastday[0].astro);
  wrapper.appendChild(currentAstro);

  const sunrise = currentAstro.querySelector('.sunrise .value').textContent;
  const sunset = currentAstro.querySelector('.sunset .value').textContent;

  setBackground(formatTime12Hour(data.location.localtime), sunrise, sunset);

  return wrapper;
}

export function currentWeatherComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'current-weather-wrapper';

  const currentWeather = buildDataList(data.current);
  wrapper.appendChild(currentWeather);

  return wrapper;
}

export function hourlyForecastComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'hourly-wrapper';

  const forecastList = document.createElement('ol');
  wrapper.appendChild(forecastList);
  forecastList.className = 'hourly-list';

  for (let key in data) {
    forecastList.appendChild(buildForecast(data[key], 'hourly'));
  }

  return wrapper;
}

export function weeklyForecastComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'daily-wrapper';

  const forecastList = document.createElement('ol');
  wrapper.appendChild(forecastList);
  forecastList.className = 'daily-list';

  for (let key in data) {
    forecastList.appendChild(buildForecast(data[key].day, 'daily'));
  }

  return wrapper;
}

function buildForecast(data, type) {
  const wrapper = document.createElement('div');
  wrapper.className = `${type}-forecast forecast-data`;

  const forecast = buildDataList(data);
  wrapper.appendChild(forecast);

  return wrapper;
}

function buildDataList(data) {
  const ul = document.createElement('ul');
  ul.className = 'data-list';

  try {
    ul.appendChild(buildCondition(data.condition));
  } catch (err) {}

  for (let key in data) {
    const dataPoint = formatDataPoint(key, data[key]);
    if (dataPoint) {
      const li = buildListItem(
        key,
        dataPoint.data,
        dataPoint.imperial,
        dataPoint.style
      );
      ul.appendChild(li);
    }
  }

  return ul;
}

function buildCondition(conditionData) {
  const condition = document.createElement('li');
  condition.className = 'heading condition';

  const conditionLabel = document.createElement('span');
  condition.appendChild(conditionLabel);
  conditionLabel.className = 'condition-label';
  conditionLabel.textContent = conditionData.text;

  const conditionIcon = document.createElement('img');
  condition.appendChild(conditionIcon);
  conditionIcon.src = conditionData.icon;

  return condition;
}

function buildListItem(type, dataPoint, imperial, style) {
  const li = document.createElement('li');
  li.className = style === undefined ? type.replace('_', '-') : style;
  if (imperial != undefined) li.dataset.imperial = imperial;

  for (let key in dataPoint) {
    if (dataPoint[key] != imperial)
      li.appendChild(buildDataSpan(dataPoint[key], key));
  }

  return li;
}

function buildDataSpan(content, style) {
  const span = document.createElement('span');
  span.textContent = content;
  span.className = style;

  return span;
}

function formatDataPoint(key, value) {
  let label = null;
  let unit = null;
  let imperial = null;
  let style = null;

  let data = null;

  if (typeof value === 'number') value = Math.round(value);

  switch (key) {
    case 'temp_c':
      unit = 'c';
      imperial = Math.round(value * 1.8 + 32);

      data = { value, unit };
      return { data, imperial };

    case 'feelslike_c':
      label = 'Feels like';
      unit = 'c';
      imperial = Math.round(value * 1.8 + 32);

      data = { label, value, unit };
      return { data, imperial };

    case 'wind_kph':
      label = 'Wind';
      unit = 'km/h';
      imperial = Math.round(value * 0.6213712);

      data = { label, value, unit };
      return { data, imperial };

    case 'humidity':
      label = 'Humidty';
      unit = '%';
      imperial = Math.round(value * 0.6213712);

      data = { label, value, unit };
      return { data, imperial };

    case 'uv':
      label = 'UV';

      data = { label, value };
      return { data };

    case 'mintemp_c':
      label = 'Low';
      unit = 'c';
      imperial = Math.round(value * 1.8 + 32);

      data = { label, value, unit };
      return { data, imperial };

    case 'maxtemp_c':
      label = 'High';
      unit = 'c';
      imperial = Math.round(value * 1.8 + 32);

      data = { label, value, unit };
      return { data, imperial };

    case 'daily_chance_of_rain':
      label = 'Rain';
      unit = '%';

      data = { label, value, unit };
      return { data };

    case 'daily_chance_of_snow':
      label = 'Snow';
      unit = '%';

      data = { label, value, unit };
      return { data };

    case 'sunrise':
      label = 'Sunrise';
      value = value[0] === '0' ? value.split('').splice(1).join('') : value;

      data = { label, value };
      return { data };

    case 'sunset':
      label = 'Sunset';
      value = value[0] === '0' ? value.split('').splice(1).join('') : value;

      data = { label, value };
      return { data };

    case 'name':
      style = 'heading main';
      data = { value };
      return { data, style };

    case 'country':
      if (value.includes('USA') || value.includes('United States'))
        value = 'United States';
      data = { value };

      return { data };

    case 'localtime':
      value = formatCustomDate(value).split('-');

      data = { hour: value[0], day: value[1], date: value[2] };
      return { data };

    case 'last_updated':
      label = 'Last Updated';
      value = formatCustomDate(value).split('-');

      data = { label, hour: value[0] };
      return { data };

    default:
      return false;
  }
}
function setBackground(time, sunrise, sunset) {
  time = formatTimeToMinutes(formatTime24Hour(time));
  sunrise = formatTimeToMinutes(formatTime24Hour(sunrise));
  sunset = formatTimeToMinutes(formatTime24Hour(sunset));
  let totalDay = sunset - sunrise;
  let totalNight = 1440 - sunset + sunrise;
  let midday = sunrise + totalDay / 2;
  let midnight = (sunset + totalNight / 2) % 1440;

  const intervals = [
    { start: 0, end: midnight, bg: 'bg-10.png' },
    { start: midnight, end: midnight + 60, bg: 'bg-11.png' },
    { start: midnight + 60, end: sunrise - 60, bg: 'bg-12.png' },
    { start: sunrise - 60, end: sunrise, bg: 'bg-1.png' },
    { start: sunrise, end: sunrise + 60, bg: 'bg-2.png' },
    { start: sunrise + 60, end: midday - 90, bg: 'bg-3.png' },
    { start: midday - 90, end: midday, bg: 'bg-4.png' },
    { start: midday, end: midday + 90, bg: 'bg-5.png' },
    { start: midday + 90, end: sunset - 60, bg: 'bg-6.png' },
    { start: sunset - 60, end: sunset, bg: 'bg-7.png' },
    { start: sunset, end: sunset + 60, bg: 'bg-8.png' },
    { start: sunset + 60, end: 1440, bg: 'bg-9.png' },
  ];

  let backgroundImage;

  for (const interval of intervals) {
    if (time >= interval.start && time <= interval.end) {
      backgroundImage = interval.bg;
      break;
    }
  }

  backgroundImage =
    backgroundImage === undefined ? 'bg-1.png' : backgroundImage;

  document.querySelector(
    'body'
  ).style.backgroundImage = `url(${backgroundImage})`;
}

function formatCustomDate(input) {
  input = input.replace(/(\d{4}-\d{2}-\d{2} )(\d{1}:)/, '$10$2');

  try {
    const date = parseISO(input);
    return format(date, 'h:mm aa - EEE - MMM do');
  } catch (err) {
    console.warn(err);
    console.warn({ warning: 'invalid date format', input: input });
    return 'Unknown date';
  }
}

function formatTime12Hour(input) {
  input = input.replace(/(\d{4}-\d{2}-\d{2} )(\d{1}:)/, '$10$2');

  try {
    const date = parseISO(input);
    return format(date, 'h:mm aa');
  } catch (err) {
    console.warn(err);
    console.warn({ warning: 'invalid date format', input: input });
    return 'Unknown date';
  }
}

function formatTime24Hour(inputTime) {
  const [hoursMinutes, period] = inputTime.split(' ');
  let [hours, minutes] = hoursMinutes.split(':');
  hours = parseInt(hours, 10);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}${minutes}`;
}

function formatTimeToMinutes(timeStr) {
  let hours = parseInt(timeStr.substring(0, 2), 10);
  let minutes = parseInt(timeStr.substring(2, 4), 10);
  return hours * 60 + minutes;
}
