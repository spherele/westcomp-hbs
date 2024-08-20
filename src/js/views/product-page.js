import { ScrollObserver } from '../helpers/scroll.observer';

document.querySelectorAll('.product-hero').forEach(hero => {
  if (hero.querySelector('.product-hero-slider__inner') === null) {
    return;
  }

  const slider = hero.querySelector('.product-hero-slider__inner');
  const slides = [...slider.querySelectorAll('.product-hero-slider__slide')];
  const slidesOffsets = [];
  let activeSlide = 0;

  slides.forEach(slide => {
    const slideXOffset = Math.abs(slider.getClientRects()[0].left - slide.getClientRects()[0].left);
    slidesOffsets.push(slideXOffset);
  });

  hero.querySelector('.product-hero-slider__button_previous').addEventListener('click', () => {
    onSlideChange(activeSlide - 1);
  });


  hero.querySelector('.product-hero-slider__button_next').addEventListener('click', () => {
    onSlideChange(activeSlide + 1);
  });

  const scrollObserver = new ScrollObserver(slider.querySelector('.product-hero-slider__wrapper'));

  slides.forEach((slide, slideIndex) => {
    slide.addEventListener('click', () => {
      onSlideChange(slideIndex);
    });
  });

  const onSlideChange = index => {
    if (index < 0 || index > slides.length - 1) {
      return;
    }

    hero.querySelector('.product-hero-slider__button_previous').classList.toggle('product-hero-slider__button_disabled', index === 0);
    hero.querySelector('.product-hero-slider__button_next').classList.toggle('product-hero-slider__button_disabled', index === slides.length - 1);

    slides.forEach((slide, slideIndex) => {
      if (slideIndex === index) {
        slide.classList.toggle('product-hero-slider__slide_active', true);
        hero.querySelector('.product-hero__image').src = slide.querySelector('img').src;
        const wrapper = slider.querySelector('.product-hero-slider__wrapper');

        scrollObserver.onElVisible(({ ratio }) => {
          if (ratio !== 1) {
            wrapper.scroll({
              left: slide.offsetLeft - 94 - wrapper.scrollLeft,
              behavior: 'smooth'
            })
          }

          scrollObserver.unobserveEl(slide);
        });

        scrollObserver.observe({ elements: [slide] });
      } else {
        slide.classList.toggle('product-hero-slider__slide_active', false);
      }
    });

    activeSlide = index;
  };

  onSlideChange(activeSlide);
});


document.querySelectorAll('.product-config__price-wrapper').forEach(priceWrapper => {
  const initialPrice = isNaN(parseFloat(priceWrapper.dataset.price)) ? 0 : parseFloat(priceWrapper.dataset.price);

  const price = priceWrapper.querySelector('.product-config-price__text');
  const amount = priceWrapper.querySelector('.product-config-amount__control');

  amount.addEventListener('input', () => (price.textContent = Intl.NumberFormat('ru', { currency: 'RUB', style: 'currency', maximumFractionDigits: 0 }).format(amount.valueAsNumber * initialPrice)));
  price.textContent = Intl.NumberFormat('ru', { currency: 'RUB', style: 'currency', maximumFractionDigits: 0 }).format(amount.valueAsNumber * initialPrice);
});

document.querySelectorAll('.product-config-amount').forEach(inputNumber => {
  const input = inputNumber.querySelector('.product-config-amount__control');
  const minusButton = inputNumber.querySelector('.product-config-amount__button_minus');
  const plusButton = inputNumber.querySelector('.product-config-amount__button_plus');

  const options = {
    min: isNaN(parseFloat(input.min)) ? -Infinity : parseFloat(input.min),
    step: isNaN(parseFloat(input.step)) ? 1 : parseFloat(input.step),
    max: isNaN(parseFloat(input.max)) ? Infinity : parseFloat(input.max)
  };

  const updateButtonStates = () => {
    minusButton.classList.toggle('product-config-amount__button_disabled', input.valueAsNumber === options.min);
    plusButton.classList.toggle('product-config-amount__button_disabled', input.valueAsNumber === options.max);
  };

  input.addEventListener('input', () => {
    if (!input.value.length && isFinite(options.min)) {
      input.value = options.min;
    } else if (isFinite(options.min) && parseFloat(input.valueAsNumber) < options.min) {
      input.valueAsNumber = options.min;
    } else if (isFinite(options.max) && parseFloat(input.valueAsNumber) > options.max) {
      input.valueAsNumber = options.max;
    }

    updateButtonStates();
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

  updateButtonStates();
});

