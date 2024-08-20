import Swiper from '@/node_modules/swiper/swiper';
import { Navigation } from '@/node_modules/swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.configurator-product').forEach(configuratorProduct => {
    const image = configuratorProduct.querySelector('.configurator-product__image');

    const carousel = new Swiper(configuratorProduct.querySelector('.configurator-product-carousel'), {
      modules: [Navigation],

      wrapperClass: 'configurator-product-carousel__wrapper',
      slideClass: 'configurator-product-carousel__slide',

      spaceBetween: 10,
      slidesPerView: 'auto',

      loop: true,
      slideToClickedSlide: true,
      allowTouchMove: false,

      navigation: {
        prevEl: configuratorProduct.querySelector('.configurator-product-carousel-wrapper__button_previous'),
        nextEl: configuratorProduct.querySelector('.configurator-product-carousel-wrapper__button_next')
      },

      breakpoints: {
        0: {
          slidesPerView: 2
        },
        769: {
          slidesPerView: 'auto'
        }
      }
    });

    carousel.on('slideChange', () => {
      image.src = carousel.slides[carousel.activeIndex].src;
    });
  });
});
