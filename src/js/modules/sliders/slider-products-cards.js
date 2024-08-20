import Swiper from '@/node_modules/swiper/swiper';

document.querySelectorAll('.products-cards-slider').forEach(sliderElement => {
  new Swiper(sliderElement.querySelector('.products-cards-slider-body'), {
    spaceBetween: 15,
    slidesPerView: sliderElement.classList.contains('products-cards-slider_special-offers') ? 4 : 3,

    wrapperClass: 'products-cards-slider-body__wrapper',
    slideClass: 'products-cards-slider__slide',

    navigation: {
      prevEl: sliderElement.querySelector('.products-cards-slider-header-buttons__item_previous'),
      nextEl: sliderElement.querySelector('.products-cards-slider-header-buttons__item_next'),
      disabledClass: 'products-cards-slider-header-buttons__item_disabled'
    },

    breakpoints: {
      0: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2
      },
      1920: {
        slidesPerView: sliderElement.classList.contains('products-cards-slider_special-offers') ? 4 : 3
      }
    }
  });
});
