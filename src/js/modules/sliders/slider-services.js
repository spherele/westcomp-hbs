import Swiper from '@/node_modules/swiper/swiper-bundle';
import Navigation from '@/node_modules/swiper/modules/navigation.min.mjs';

document.addEventListener('DOMContentLoaded', () => {
  new Swiper('.services-carousel', {
    modules: [Navigation],

    slideClass: 'services-carousel__slide',
    wrapperClass: 'services-carousel__wrapper',

    navigation: {
      prevEl: '.services__button_previous',
      nextEl: '.services__button_next'
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
        grid: undefined
      },
      415: {
        slidesPerView: 2,
        grid: {
          fill: 'row',
          rows: 2
        }
      },
      769: {
        slidesPerView: 3,
        grid: {
          fill: 'row',
          rows: 2
        }
      },
      1025: {
        slidesPerView: 5,
        grid: {
          fill: 'row',
          rows: 2
        }
      }
    }
  });

  document.querySelectorAll('.card-service').forEach(cardService => {
    cardService.addEventListener('click', () => window.outerWidth <= 1024 && cardService.classList.toggle('card-service_expanded'));
    cardService.addEventListener('mouseenter', () => window.outerWidth > 1024 && cardService.classList.toggle('card-service_expanded', true));
    cardService.addEventListener('mouseleave', () => window.outerWidth > 1024 && cardService.classList.toggle('card-service_expanded', false));
  });
});
