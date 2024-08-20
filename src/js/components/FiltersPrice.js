import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.min.css';

document.querySelectorAll('.filters-price').forEach(filtersPrice => {
  const inputFrom = filtersPrice.querySelector('.filters-price__input_from');
  const inputTo = filtersPrice.querySelector('.filters-price__input_to');

  const range = noUiSlider.create(filtersPrice.querySelector('.filters-price__range'), {
    start: [parseFloat(filtersPrice.dataset.from), parseFloat(filtersPrice.dataset.to)],
    connect: true,
    step: 1000,
    range: {
      'min': parseFloat(filtersPrice.dataset.from),
      'max': parseFloat(filtersPrice.dataset.to)
    }
  });

  range.on('update', values => {
    inputFrom.value = Number(values[0]);
    inputTo.value = Number(values[1]);
  });

  [inputFrom, inputTo].forEach(input => input.addEventListener('change', () => {
    range.set([inputFrom.valueAsNumber, inputTo.valueAsNumber]);
  }));
});
