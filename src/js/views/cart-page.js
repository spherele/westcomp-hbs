const calculateResultPrice = () => {
  document.querySelectorAll('.sidebar-result').forEach(sidebarResult => {
    const discountElement = sidebarResult.querySelector('.sidebar-result-items-item_discount');

    const productsAmount = [...document.querySelectorAll('.products-item')].map(productsItem =>
      productsItem.querySelector('.products-item-amount__input').valueAsNumber)
      .reduce((a, b) => a + b);

    let price = [...document.querySelectorAll('.products-item')].map(productsItem =>
      productsItem.querySelector('.products-item-amount__input').valueAsNumber * parseFloat(productsItem.dataset.price))
      .reduce((a, b) => a + b);

    if (sidebarResult.dataset.discount !== undefined && !isNaN(parseFloat(sidebarResult.dataset.discount))) {
      price -= parseFloat(sidebarResult.dataset.discount);

      if (discountElement !== null) {
        discountElement.style.display = '';
        discountElement.querySelector('.sidebar-result-items-item__price').textContent =
          `- ${Intl.NumberFormat('ru', { currency: 'RUB', style: 'currency', maximumFractionDigits: 0 }).format(parseFloat(sidebarResult.dataset.discount))}`;
      }
    } else if (discountElement !== null) {
      discountElement.style.display = 'none';
    }

    sidebarResult.querySelector('.sidebar-result-price__value').textContent =
      Intl.NumberFormat('ru', { currency: 'RUB', style: 'currency', maximumFractionDigits: 0 }).format(price);

    sidebarResult.querySelector('.sidebar-result-items-item_summary .sidebar-result-items-item__name').textContent =
      `Товары — ${productsAmount} шт.`;
  });
};

document.querySelectorAll('.products-item').forEach(productsItem => {
  const priceWrapper = productsItem.querySelector('.products-item-price');
  const initialPrice = isNaN(parseFloat(productsItem.dataset.price)) ? 0 : parseFloat(productsItem.dataset.price);

  const price = priceWrapper.querySelector('.products-item-price__value');
  const amount = productsItem.querySelector('.products-item-amount__input');

  amount.addEventListener('input', () => {
    price.textContent = Intl.NumberFormat('ru', { currency: 'RUB', style: 'currency', maximumFractionDigits: 0 }).format(amount.valueAsNumber * initialPrice);
    calculateResultPrice();
  });

  price.textContent = Intl.NumberFormat('ru', { currency: 'RUB', style: 'currency', maximumFractionDigits: 0 }).format(amount.valueAsNumber * initialPrice);
});

document.querySelectorAll('.products-item-amount').forEach(inputNumber => {
  const input = inputNumber.querySelector('.products-item-amount__input');
  const minusButton = inputNumber.querySelector('.products-item-amount__button_minus');
  const plusButton = inputNumber.querySelector('.products-item-amount__button_plus');

  const options = {
    min: isNaN(parseFloat(input.min)) ? -Infinity : parseFloat(input.min),
    step: isNaN(parseFloat(input.step)) ? 1 : parseFloat(input.step),
    max: isNaN(parseFloat(input.max)) ? Infinity : parseFloat(input.max)
  };

  input.addEventListener('input', () => {
    if (!input.value.length && isFinite(options.min)) {
      input.value = options.min;
      input.dispatchEvent(new InputEvent('input'));
    } else if (isFinite(options.min) && parseFloat(input.valueAsNumber) < options.min) {
      input.valueAsNumber = options.min;
    } else if (isFinite(options.max) && parseFloat(input.valueAsNumber) > options.max) {
      input.valueAsNumber = options.max;
    }
  });

  minusButton.addEventListener('click', () => {
    if (input.valueAsNumber !== options.step) {
      input.valueAsNumber -= options.step;
    }

    input.dispatchEvent(new InputEvent('input'));
  });

  plusButton.addEventListener('click', () => {
    if (input.valueAsNumber !== options.max) {
      input.valueAsNumber += options.step;
    }

    input.dispatchEvent(new InputEvent('input'));
  });

  if (isNaN(input.valueAsNumber)) {
    input.value = isFinite(options.min) ? options.min : 0
  }
});

calculateResultPrice();
