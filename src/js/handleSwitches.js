const switchForecastBtn = document.querySelector('.switch-forecast-type');

switchForecastBtn.addEventListener('click', () => {
  console.log('click');
  console.log(switchForecastBtn.nextSibling.nextSibling.classList);
  switchForecastBtn.nextElementSibling.classList.toggle('active');
  switchForecastBtn.nextElementSibling.nextElementSibling.classList.toggle(
    'active'
  );
});
