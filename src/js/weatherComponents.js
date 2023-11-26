import { format, getDay, getHours, parseISO, addSeconds } from 'date-fns';

export function localTimeComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'location-time-wrapper';

  const location = document.createElement('div');
  wrapper.appendChild(location);
  location.className = 'location';

  const cityData = formatDataPoint('name', data.location.name);
  const city = buildDataSpan(cityData.data.city, 'city');
  location.appendChild(city);

  const countryData = formatDataPoint('country', data.location.country);
  const country = buildDataSpan(countryData.data.country, 'country');
  location.appendChild(country);

  const weekday = document.createElement('span');
  wrapper.appendChild(weekday);
  weekday.className = 'current-weekday';

  const date = document.createElement('span');
  wrapper.appendChild(date);
  date.className = 'current-date';

  const clock = document.createElement('span');
  wrapper.appendChild(clock);
  clock.className = 'current-time';

  setUpClock(data.location.localtime, weekday, date, clock);

  const currentAstro = buildDataList(
    data.forecast.forecastday[0].astro,
    'astro'
  );
  wrapper.appendChild(currentAstro);

  const sunrise = currentAstro.querySelector('.sunrise .value').textContent;
  const sunset = currentAstro.querySelector('.sunset .value').textContent;

  setBackground(formatTime12Hour(data.location.localtime), sunrise, sunset);

  return wrapper;
}

function setUpClock(time, weekday, date, clock) {
  startClock();
  displayClock();

  return clock;

  function startClock() {
    let now = new Date(time);
    time = addSeconds(now, 1);

    setTimeout(startClock, 1000);
  }

  function displayClock() {
    const formattedTime = formatCustomDate(
      time,
      'h:mm:ss aa - EEE - MMM do'
    ).split('-');

    weekday.textContent = formattedTime[1].toUpperCase();
    date.textContent = formattedTime[2];
    clock.textContent = formattedTime[0];

    setTimeout(displayClock, 1000);
  }
}

export function currentWeatherComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'current-weather-wrapper';

  const currentWeather = buildDataList(data.current, 'current');
  wrapper.appendChild(currentWeather);

  return wrapper;
}

export function hourlyForecastComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'hourly-wrapper';

  const forecastList = document.createElement('ol');
  wrapper.appendChild(forecastList);
  forecastList.className = 'hourly-list scrollable';

  const currentHour =
    getHours(parseISO(fixNoLeadingZero(data.location.localtime))) + 1;

  let j = 0;
  for (let i = 0; i < 24; i++) {
    const hourToDisplay = currentHour + i;
    let amPm;

    let forecast;
    if (hourToDisplay < 24) {
      forecast = buildForecast(
        data.forecast.forecastday[0].hour[hourToDisplay],
        'hourly'
      );
    } else {
      forecast = buildForecast(data.forecast.forecastday[1].hour[j], 'hourly');
      j++;
    }

    forecastList.appendChild(forecast);
  }

  for (let key in data) {
  }

  return wrapper;
}

export function weeklyForecastComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'daily-wrapper';

  const forecastList = document.createElement('ol');
  wrapper.appendChild(forecastList);
  forecastList.className = 'daily-list scrollable';

  for (let key in data) {
    if (key != 0) {
      const forecast = buildForecast(data[key].day, 'daily');
      const dateDataPoint = formatDataPoint('date', data[key].date);
      forecast.firstChild.appendChild(
        buildListItem('day', dateDataPoint.data, null, null, 'day heading')
      );
      forecastList.appendChild(forecast);
    }
  }

  return wrapper;
}

function buildForecast(data, type) {
  const wrapper = document.createElement('div');
  wrapper.className = `${type}-forecast forecast-data`;

  const forecast = buildDataList(data, type);
  wrapper.appendChild(forecast);

  return wrapper;
}

function buildDataList(data, type) {
  const ul = document.createElement('ul');
  ul.className = `data-list ${type}`;

  try {
    ul.appendChild(buildCondition(data.condition));
  } catch (err) {}

  for (let key in data) {
    const dataPoint = formatDataPoint(key, data[key], data, type);
    if (dataPoint) {
      let li = buildListItem(
        key,
        dataPoint.data,
        dataPoint.metric,
        dataPoint.imperial,
        dataPoint.style,
        dataPoint.icon
      );

      ul.appendChild(li);
    }
  }

  return ul;
}

function buildCondition(conditionData, includeLabel) {
  const condition = document.createElement('li');
  condition.className = 'heading condition';

  if (includeLabel) {
    const conditionLabel = document.createElement('span');
    condition.appendChild(conditionLabel);
    conditionLabel.className = 'condition-label';
    conditionLabel.textContent = conditionData.text.replace('possible', '');
  }

  const conditionIcon = document.createElement('img');
  condition.appendChild(conditionIcon);
  conditionIcon.src = conditionData.icon;
  conditionIcon.className = 'condition-icon';

  return condition;
}

function buildListItem(type, dataPoint, metric, imperial, style, icon) {
  const li = document.createElement('li');
  li.className = style === undefined ? type.replaceAll('_', '-') : style;
  if (metric != undefined) li.dataset.metric = metric;
  if (imperial != undefined) li.dataset.imperial = imperial;
  if (icon != undefined) li.appendChild(buildIcon(icon, 'icon'));

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

function buildIcon(icon, style) {
  const img = document.createElement('img');
  img.src = icon;

  return img;
}

function formatDataPoint(key, value, weatherData, dataType) {
  let label = null;
  let unit = null;
  let imperial = null;
  let metric = null;
  let style = null;
  let icon = null;

  let data = null;

  if (typeof value === 'number') value = Math.round(value);

  switch (key) {
    case 'temp_c':
      imperial = Math.round(value * 1.8 + 32);
      metric = value;
      style = 'temp heading';
      value = ' ' + value;
      unit = '°c';

      data = { 'icon label fa-solid fa-temperature-half': '', value, unit };
      return { data, imperial, style, metric };

    case 'feelslike_c':
      if (dataType === 'hourly') return false;
      metric = value;
      imperial = Math.round(value * 1.8 + 32);
      label = 'Feels Like ';
      unit = '°';

      data = {
        label,
        // 'icon label fa-solid fa-temperature-half': '',
        value,
        unit,
      };
      return { data, imperial, metric };

    case 'wind_kph':
      metric = value;
      imperial = Math.round(value * 0.6213712);
      value = ' ' + value;
      unit = 'kph';

      data = { 'icon label fa-solid fa-wind': '', value, unit };
      return { data, imperial, metric };

    case 'humidity':
      icon = './humidity-icon.svg';
      value = ' ' + value;
      unit = '%';
      style = 'humidity label-icon';

      data = { 'humidity-icon': '', value, unit };
      return { data, icon, style };

    case 'avghumidity':
      icon = './humidity-icon.svg';
      value = ' ' + value;
      unit = '%';
      style = 'humidity label-icon';

      data = { value, unit };
      return { data, icon, style };

    case 'uv':
      label = 'UV ';

      data = { label, value };
      return { data };

    case 'date':
      const weekDay = getWeekDay(value);
      data = { weekDay };
      return { data };

    case 'mintemp_c':
      let min = value;
      let minUnit = '°/';
      let max = Math.round(weatherData.maxtemp_c);
      let maxUnit = '°';
      metric = min + '-' + max;
      imperial = Math.round(min * 1.8 + 32) + '-' + Math.round(max * 1.8 + 32);
      style = 'min-max';

      data = { min, minUnit, max, maxUnit };
      return { data, imperial, metric };

    case 'daily_chance_of_rain':
      let chanceOfRain = value;
      let chanceOfSnow = weatherData.daily_chance_of_snow;

      if (chanceOfSnow > chanceOfRain || chanceOfSnow > 50) {
        chanceOfSnow = ' ' + chanceOfSnow;
        unit = '%';
        data = { 'icon label fa-solid fa-snowflake': '', chanceOfSnow, unit };
      } else {
        chanceOfRain = ' ' + chanceOfRain;
        unit = '%';
        data = { 'icon label fa-solid fa-droplet': '', chanceOfRain, unit };
      }

      return { data };

    case 'sunrise':
      label = 'Sunrise';
      value = value[0] === '0' ? value.split('').splice(1).join('') : value;

      data = { 'icon label fa-solid fa-sun': '', value };
      return { data };

    case 'sunset':
      label = 'Sunset';
      value = value[0] === '0' ? value.split('').splice(1).join('') : value;

      data = { 'icon label fa-solid fa-moon': '', value };
      return { data };

    case 'time':
      let currentTime = formatCustomDate(parseISO(value), 'h:mm-aa').split('-');

      value = currentTime[0] + ' ';
      unit = currentTime[1];
      style = 'time heading';

      data = { value, unit };
      return { data, style };

    case 'name':
      const city = value + ' ';
      data = { city };
      return { data, style };

    case 'country':
      let country = value;
      if (value.includes('USA') || value.includes('United States'))
        country = 'United States';

      data = { country };
      return { data };

    // case 'last_updated':
    //   label = 'Last Updated';
    //   value = formatCustomDate(value).split('-');

    //   data = { label, hour: value[0] };
    //   return { data };

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

  let cycleStart = midnight <= 1440 ? midnight : 0;
  let cycleEnd = midnight <= 1440 ? 1440 : midnight;

  const intervals = [
    { start: cycleStart, end: midnight, bg: './bg-10.png' },
    { start: midnight, end: midnight + 60, bg: './bg-11.png' },
    { start: midnight + 60, end: sunrise - 60, bg: './bg-12.png' },
    { start: sunrise - 60, end: sunrise, bg: './bg-1.png' },
    { start: sunrise, end: sunrise + 60, bg: './bg-2.png' },
    { start: sunrise + 60, end: midday - 90, bg: './bg-3.png' },
    { start: midday - 90, end: midday, bg: './bg-4.png' },
    { start: midday, end: midday + 90, bg: './bg-5.png' },
    { start: midday + 90, end: sunset - 60, bg: './bg-6.png' },
    { start: sunset - 60, end: sunset, bg: './bg-7.png' },
    { start: sunset, end: sunset + 60, bg: './bg-8.png' },
    { start: sunset + 60, end: cycleEnd, bg: './bg-9.png' },
  ];

  let backgroundImage;

  for (const interval of intervals) {
    if (time >= interval.start && time <= interval.end) {
      backgroundImage = interval.bg;
      break;
    }
  }

  backgroundImage =
    backgroundImage === undefined ? '/bg-1.png' : backgroundImage;

  document.querySelector(
    'body'
  ).style.backgroundImage = `url(${backgroundImage})`;
}

function formatCustomDate(input, customFormat) {
  try {
    return format(input, customFormat);
  } catch (err) {
    console.warn(err);
    console.warn({ warning: 'invalid date format', input: input });
    return 'Unknown date';
  }
}

function getWeekDay(date) {
  const day = getDay(parseISO(date));

  switch (day) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
    default:
      throw new Error('Invalid day of the week number');
  }
}

function formatTime12Hour(input) {
  try {
    input = fixNoLeadingZero(input);
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

function fixNoLeadingZero(input) {
  return input.replace(/(\d{4}-\d{2}-\d{2} )(\d{1}:)/, '$10$2');
}
