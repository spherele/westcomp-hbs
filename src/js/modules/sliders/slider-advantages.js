import Swiper from '@/node_modules/swiper/swiper-bundle';

function sliderHeroInit() {
  new Swiper('.js-slider-advantages', {
    slidesPerView: 'auto',
    spaceBetween: 15,
    speed: 600,

    navigation: {
      nextEl: '.js-slider-advantages__button--next',
      prevEl: '.js-slider-advantages__button--prev',
    },
    breakpoints: {
      0: {
        centeredSlides: true,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 16,

        grid: {
          fill: 'row',
          rows: 2
        }
      },
      1025: {
        grid: undefined,
        slidesPerView: 3
      },
      1440: {
        slidesPerView: 4
      }
    }
  });
}

window.addEventListener('load', sliderHeroInit);
