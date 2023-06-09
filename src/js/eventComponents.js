import { format, parseISO } from 'date-fns';

export function upcomingEventsComponent(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'upcoming-events-wrapper scrollable';

  for (let event in data.events) {
    const eventDetails = buildEvent(data.events[event]);
    wrapper.appendChild(eventDetails);
  }

  return wrapper;
}

function buildEvent(data) {
  const eventWrapper = document.createElement('a');
  eventWrapper.className = 'upcoming-event';
  eventWrapper.href = data.url;
  eventWrapper.setAttribute('draggable', 'false');

  const eventDetails = buildDataList(data);
  eventWrapper.appendChild(eventDetails);

  const eventImage = document.createElement('img');
  eventWrapper.appendChild(eventImage);
  eventImage.src = data.images[0].url;
  eventImage.setAttribute('draggable', 'false');

  return eventWrapper;
}

function buildDataList(data) {
  const ul = document.createElement('ul');
  ul.className = 'data-list';

  let dataPoint = formatDataPoint('name', data.name);
  let li = buildListItem('name', dataPoint);
  ul.appendChild(li);

  const type = data.classifications[0]?.segment?.name ?? 'Unknown date';
  const genre = data.classifications[0]?.genre?.name ?? '';

  dataPoint = formatDataPoint('type', type, genre);
  li = buildListItem('type', dataPoint);
  ul.appendChild(li);

  let date = data.dates?.start?.localDate ?? '';
  let time = data.dates?.start?.localTime ?? '';
  dataPoint = formatDataPoint('date', date, time);
  li = buildListItem('date', dataPoint);
  ul.appendChild(li);

  return ul;
}

function buildListItem(type, dataPoint) {
  const li = document.createElement('li');
  li.className = type.replace('_', '-');

  for (let key in dataPoint) {
    if (dataPoint[key] !== '')
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

function formatDataPoint(key, value, unit) {
  let label = null;

  switch (key) {
    case 'name':
      label = '';
      unit = '';
      return { label, value, unit };
    case 'type':
      label = 'Type: ';
      value = value + ', ';
      return { label, value, unit };
    case 'date':
      const formattedDate = formatCustomDate(value + 'T' + unit);
      return { label, formattedDate, unit: '' };

    default:
      return false;
  }
}

function formatCustomDate(inputDate) {
  try {
    const date = parseISO(inputDate);
    return format(date, 'MMM do - h:mm aa');
  } catch {
    console.warn('invalid date format');
    return 'Unknown date';
  }
}
