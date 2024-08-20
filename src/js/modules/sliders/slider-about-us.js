import Swiper from '@/node_modules/swiper/swiper-bundle';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.about-us-page-carousel-swiper').forEach(carousel => {
    new Swiper(carousel, {
      wrapperClass: 'about-us-page-carousel-swiper__wrapper',
      slideClass: 'about-us-page-carousel-swiper__slide',

      navigation: {
        prevEl: '.about-us-page-carousel-swiper__button_previous',
        nextEl: '.about-us-page-carousel-swiper__button_next'
      }
    });
  });
});
