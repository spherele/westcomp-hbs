import Swiper from '@/node_modules/swiper/swiper-bundle';

function sliderCardInit() {
  new Swiper('.js-slider-card', {
    slidesPerView: 'auto',
    spaceBetween: 10,
    speed: 400,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: {
        spaceBetween: 16,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 16,
      },
      1600: {
        slidesPerView: 4,
        spaceBetween: 16,
      },
    },
  });
}

window.addEventListener('load', sliderCardInit);
