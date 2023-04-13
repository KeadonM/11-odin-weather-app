import { searchLocation } from '../main.js';

export function historyComponent(query) {
  const historyItem = document.createElement('li');

  const historyBtn = document.createElement('button');
  historyItem.appendChild(historyBtn);
  historyBtn.textContent = query;

  historyBtn.addEventListener('click', () => {
    searchLocation(query);
  });

  return historyItem;
}
