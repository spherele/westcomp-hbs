import Swiper from '@/node_modules/swiper/swiper';
import { Autoplay } from '@/node_modules/swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
  new Swiper('.educational-center-page-hero-swiper', {
    modules: [Autoplay],

    wrapperClass: 'educational-center-page-hero-swiper__wrapper',
    slideClass: 'educational-center-page-hero-swiper-slide',

    autoplay: true
  });
});
