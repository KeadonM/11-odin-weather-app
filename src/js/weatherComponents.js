export function currentWeatherComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'current-weather-wrapper';

  const locationTitle = document.createElement('p');
  wrapper.appendChild(locationTitle);
  locationTitle.textContent = data.location.name;

  const lastUpdate = document.createElement('p');
  wrapper.appendChild(lastUpdate);
  lastUpdate.textContent = data.current.last_updated;

  const currentWeather = buildDataList(data.current);
  wrapper.appendChild(currentWeather);

  const currentAstro = buildDataList(data.forecast.forecastday[0].astro);
  wrapper.appendChild(currentAstro);

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
  wrapper.className = 'forecast-wrapper';

  const forecastList = document.createElement('ol');
  wrapper.appendChild(forecastList);
  forecastList.className = 'forecast-list';

  for (let key in data) {
    forecastList.appendChild(buildForecast(data[key].day, 'day'));
  }

  return wrapper;
}

function buildForecast(data, type) {
  const wrapper = document.createElement('div');
  wrapper.className = `${type}-forecast`;

  const forecast = buildDataList(data);
  wrapper.appendChild(forecast);

  return wrapper;
}

function buildDataList(data) {
  const ul = document.createElement('ul');
  ul.className = 'data-list';

  for (let key in data) {
    const dataPoint = formatDataPoint(key, data[key]);
    if (dataPoint) {
      const li = buildListItem(key, dataPoint, dataPoint.imperial);
      ul.appendChild(li);
    }
  }

  try {
    ul.appendChild(buildCondition(data.condition));
  } catch (err) {
    console.warn('No condition');
  }

  return ul;
}

function buildListItem(type, dataPoint, imperial) {
  const li = document.createElement('li');
  li.className = type.replace('_', '-');
  li.dataset.imperial = imperial;

  for (let key in dataPoint) {
    if (dataPoint[key] != imperial)
      li.appendChild(buildDataSpan(dataPoint[key], key));
  }

  return li;
}

function buildCondition(conditionData) {
  const condition = document.createElement('li');
  condition.className = 'condition';

  const conditionLabel = document.createElement('span');
  condition.appendChild(conditionLabel);
  conditionLabel.className = 'condition-label';
  conditionLabel.textContent = conditionData.text;

  const conditionIcon = document.createElement('img');
  condition.appendChild(conditionIcon);
  conditionIcon.src = conditionData.icon;

  return condition;
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

  if (typeof value === 'number') value = Math.round(value);

  switch (key) {
    case 'temp_c':
      label = '';
      unit = 'c';
      imperial = Math.round(value * 1.8 + 32);
      return { label, value, unit, imperial };

    case 'feelslike_c':
      label = 'Feels like';
      unit = 'c';
      imperial = Math.round(value * 1.8 + 32);
      return { label, value, unit, imperial };

    case 'wind_kph':
      label = 'Wind';
      unit = 'km/h';
      imperial = Math.round(value * 0.6213712);
      return { label, value, unit, imperial };

    case 'humidity':
      label = 'Humidty';
      unit = '%';
      imperial = Math.round(value * 0.6213712);
      return { label, value, unit, imperial };

    case 'uv':
      label = 'UV';
      return { label, value };

    case 'mintemp_c':
      label = 'Low';
      unit = 'c';
      imperial = Math.round(value * 1.8 + 32);
      return { label, value, unit, imperial };

    case 'maxtemp_c':
      label = 'High';
      unit = 'c';
      imperial = Math.round(value * 1.8 + 32);
      return { label, value, unit, imperial };

    case 'daily_chance_of_rain':
      label = 'Rain';
      unit = '%';
      return { label, value, unit };

    case 'daily_chance_of_snow':
      label = 'Snow';
      unit = '%';
      return { label, value, unit };

    case 'sunrise':
      label = 'Sunrise';
      unit = '';
      value = value[0] === '0' ? value.split('').splice(1).join('') : value;
      return { label, value, unit };

    case 'sunset':
      label = 'Sunset';
      unit = '';
      value = value[0] === '0' ? value.split('').splice(1).join('') : value;
      return { label, value, unit };

    default:
      return false;
  }
}
