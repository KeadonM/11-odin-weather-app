const switchForecastBtn = document.querySelector('.switch-forecast-type');

switchForecastBtn.addEventListener('click', () => {
  switchForecastBtn.nextElementSibling.classList.toggle('active');
  switchForecastBtn.nextElementSibling.nextElementSibling.classList.toggle(
    'active'
  );
});
