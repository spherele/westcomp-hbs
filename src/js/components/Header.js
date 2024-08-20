document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.header').forEach(header => {
    const search = header.querySelector('.header-search');
    search.querySelector('.header-search__icon').addEventListener('click', () => {
      if (search.querySelector('.header-search__control').value.length) {
        search.submit();
      } else {
        if (search.classList.toggle('header-search_expanded')) {
          if (header.classList.contains('header_desktop')) {
            header.querySelector('.header-contacts').style.marginLeft = '30px';
            header.querySelector('.header-catalog-button').style.marginLeft = '30px';
            header.querySelector('.header-navigation').style.display = 'none';
            search.style.flexGrow = '1';
            search.style.marginLeft = '0px';
          }

          if (header.classList.contains('header_desktop-sm')) {
            header.querySelector('.header-contacts').style.display = 'none';
            header.querySelector('.header-catalog-button').style.display = 'none';
            header.querySelector('.header__hamburger-button').style.display = 'none';
            header.querySelector('.header__button').style.marginLeft = '30px';
            search.style.flexGrow = '1';
          }

          if (header.classList.contains('header_tablet')) {
            header.querySelector('.header-contacts').style.display = 'none';
            header.querySelector('.header-catalog-button').style.marginLeft = '30px';
            search.style.flexGrow = '1';
          }

          if (header.classList.contains('header_mobile')) {
            header.querySelector('.header__logotype').style.display = 'none';
            header.querySelector('.header-catalog-button').style.marginRight = '30px';
            search.style.flexGrow = '1';

            if (window.outerWidth < 360) {
              header.querySelector('.header-catalog-button').style.display = 'none';
            }
          }
        } else {
          if (header.classList.contains('header_desktop')) {
            header.querySelector('.header-contacts').style.marginLeft = '';
            header.querySelector('.header-catalog-button').style.marginLeft = '';
            header.querySelector('.header-navigation').style.display = '';
            search.style.flexGrow = '';
            search.style.marginLeft = '';
          }

          if (header.classList.contains('header_desktop-sm')) {
            header.querySelector('.header-contacts').style.display = '';
            header.querySelector('.header-catalog-button').style.display = '';
            header.querySelector('.header__hamburger-button').style.display = '';
            header.querySelector('.header__button').style.marginLeft = '';
            search.style.flexGrow = '';
          }

          if (header.classList.contains('header_tablet')) {
            header.querySelector('.header-contacts').style.display = '';
            header.querySelector('.header-catalog-button').style.marginLeft = '';
            search.style.flexGrow = '';
          }

          if (header.classList.contains('header_mobile')) {
            header.querySelector('.header__logotype').style.display = '';
            header.querySelector('.header-catalog-button').style.marginRight = '';
            search.style.flexGrow = '';

            if (window.outerWidth < 360) {
              header.querySelector('.header-catalog-button').style.display = '';
            }
          }
        }
      }
    });

    let mouseX = 0; let mouseY = 0;

    window.addEventListener('mousemove', ({ x, y }) => {
      mouseX = x;
      mouseY = y;
    });

    header.querySelectorAll('.header-navigation-item').forEach(navigationItem => {
      let intervalHandle = null;

      navigationItem.querySelector('.header-navigation-item-button').addEventListener('mouseenter', () => {
        clearInterval(intervalHandle);
        header.querySelectorAll('.header-navigation-item').forEach(navigationItem => navigationItem.classList.toggle('header-navigation-item_expanded', false));
        navigationItem.classList.toggle('header-navigation-item_expanded', true);
        document.getElementById('catalog-popup').style.display = 'none';

        intervalHandle = setInterval(() => {
          const elements = document.elementsFromPoint(mouseX, mouseY);
          if (!elements.includes(navigationItem.querySelector('.header-navigation-item-button')) && !elements.includes(navigationItem.querySelector('.header-navigation-item-list'))) {
            navigationItem.classList.toggle('header-navigation-item_expanded', false);
            clearInterval(intervalHandle);
          }
        }, 500);

        navigationItem.querySelector('.header-navigation-item-list').addEventListener('mouseleave', () => {
          navigationItem.classList.toggle('header-navigation-item_expanded', false);
          clearInterval(intervalHandle);
        }, { once: false });
      });

      window.addEventListener('click', event => {
        if (navigationItem.classList.contains('header-navigation-item_expanded') && !event.composedPath().includes(navigationItem)) {
          navigationItem.classList.toggle('header-navigation-item_expanded', false);
          clearInterval(intervalHandle);
        }
      });

      window.addEventListener('scroll', () => {
        navigationItem.classList.toggle('header-navigation-item_expanded', false);
        clearInterval(intervalHandle);
      });
    });
  });
});
