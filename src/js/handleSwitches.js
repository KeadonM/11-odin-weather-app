const switchForecastBtn = document.querySelector('.switch.forecast');
const switchUnitBtn = document.querySelector('.switch.unit');

switchForecastBtn.addEventListener('change', () => {
  switchForecastBtn.nextElementSibling.classList.toggle('active');
  switchForecastBtn.nextElementSibling.nextElementSibling.classList.toggle(
    'active'
  );
});

switchUnitBtn.addEventListener('change', () => {
  const elements = document.querySelectorAll('[data-imperial]');

  elements.forEach((element) => {
    try {
      const value = element.querySelector('.value');
      const unit = element.querySelector('.unit');
      const imperial = element.getAttribute('data-imperial');

      if (value.textContent !== imperial) {
        value.textContent = ' ' + imperial;
        if (unit.textContent === '°c') unit.textContent = '°f';
        if (unit.textContent === 'kph') unit.textContent = 'mph';
      } else {
        value.textContent = ' ' + element.getAttribute('data-metric');
        if (unit.textContent === '°f') unit.textContent = '°c';
        if (unit.textContent === 'mph') unit.textContent = 'kph';
      }

      // console.log({ value, text: value.textContent });
    } catch (err) {
      const min = element.querySelector('.min');
      const max = element.querySelector('.max');

      const minUnit = element.querySelector('.minUnit');
      const maxUnit = element.querySelector('.maxUnit');

      const imperial = element.getAttribute('data-imperial').split('-');
      const metric = element.getAttribute('data-metric').split('-');

      if (min.textContent !== imperial[0]) {
        min.textContent = imperial[0];
        max.textContent = imperial[1];
      } else {
        min.textContent = metric[0];
        max.textContent = metric[1];
      }
    }
  });
});
