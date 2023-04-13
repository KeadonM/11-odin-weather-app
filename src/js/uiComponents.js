export function currentWeatherComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'current-weather-wrapper';

  const locationTitle = document.createElement('p');
  wrapper.appendChild(locationTitle);

  locationTitle.textContent = data.location.name;

  const currentWeather = buildDataList(data.current);
  wrapper.appendChild(currentWeather);

  return wrapper;
}

export function weeklyForecastComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'forecast-wrapper';

  const forecastList = document.createElement('ol');
  wrapper.appendChild(forecastList);
  forecastList.className = 'forecast-list';

  for (let key in data) {
    forecastList.appendChild(buildForecastDay(data[key].day));
  }

  return wrapper;
}

function buildForecastDay(data) {
  const dayWrapper = document.createElement('div');
  dayWrapper.className = 'day-forecast';
  const forecastDay = buildDataList(data);
  dayWrapper.appendChild(forecastDay);

  return dayWrapper;
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

  const condition = document.createElement('li');
  ul.appendChild(condition);
  condition.className = 'condition';

  const conditionLabel = document.createElement('span');
  condition.appendChild(conditionLabel);
  conditionLabel.className = 'condition-label';
  conditionLabel.textContent = data.condition.text;

  const conditionIcon = document.createElement('img');
  condition.appendChild(conditionIcon);
  conditionIcon.src = data.condition.icon;

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

  value = Math.round(value);

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

    default:
      return false;
  }
}
