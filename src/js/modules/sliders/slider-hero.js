import Swiper from '@/node_modules/swiper/swiper-bundle';
import Navigation from '@/node_modules/swiper/modules/navigation.min.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const carouselElement = document.querySelector('.hero-carousel');

  if (carouselElement === null) {
    return;
  }

  const carousel = new Swiper(carouselElement, {
    modules: [Navigation],

    wrapperClass: 'hero-carousel__wrapper',
    slideClass: 'hero-carousel__slide',
    slidesPerView: 1
  });

  document.querySelector('.hero__button_previous')
    .addEventListener('click', () => carousel.slidePrev());

  document.querySelector('.hero-carousel__button_previous')
    .addEventListener('click', () => carousel.slidePrev());

  document.querySelector('.hero__button_next')
    .addEventListener('click', () => carousel.slideNext());

  document.querySelector('.hero-carousel__button_next')
    .addEventListener('click', () => carousel.slideNext());
});
