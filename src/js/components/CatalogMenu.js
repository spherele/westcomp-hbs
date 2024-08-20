document.addEventListener('DOMContentLoaded', () => {
  const catalogMenu = document.getElementById('catalog-menu');

  if (catalogMenu.dataset.menus === undefined) {
    return;
  }

  let items = [];

  try {
    items = JSON.parse(catalogMenu.dataset.menus)
  } catch (error) {
    console.error(error);
  }

  const showMenu = menus => {
    [...catalogMenu.children].forEach(element => element.remove());
    const parentMenu = items.find(menu => menu.menuId === menus[0].parentMenuId);

    const itemsContainer = document.createElement('div');
    itemsContainer.classList.add('catalog-menu-items');

    const previousTabButton = document.createElement('button');
    previousTabButton.classList.add('catalog-menu-items-item', 'catalog-menu-items-item_previous-tab');
    previousTabButton.type = 'button';

    previousTabButton.innerHTML = `
      <svg class="catalog-menu-items-item__icon" width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.01718 0L5.68265 0L0.914062 6.00118L5.68265 12H8.01718L3.24622 6.00118L8.01718 0Z" fill="currentColor" />
      </svg>
      <div class="catalog-menu-items-item__text">${parentMenu.name}</div>
    `;

    previousTabButton.addEventListener('click', () => {
      if (parentMenu.type === 'gridItem') {
        initMenu()
      } else {
        showMenu(items.filter(item => item.parentMenuId === parentMenu.parentMenuId));
      }
    });

    itemsContainer.appendChild(previousTabButton);

    menus.forEach(item => {
      if (item.url !== undefined) {
        const itemElement = document.createElement('a');
        itemElement.classList.add('catalog-menu-items-item', 'catalog-menu-items-item_link');
        itemElement.href = item.url;
        itemElement.textContent = item.name;
        itemsContainer.appendChild(itemElement);
      } else if (item.parentMenuId !== undefined) {
        const itemElement = document.createElement('button');
        itemElement.classList.add('catalog-menu-items-item', 'catalog-menu-items-item_tab');
        itemElement.type = 'button';

        itemElement.innerHTML = `
          <div class="catalog-menu-items-item__text">${item.name}</div>
          <svg class="catalog-menu-items-item__icon" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.000402451 12L2.33493 12L7.10352 5.99882L2.33492 4.13626e-07L0.000401393 6.16123e-07L4.77136 5.99882L0.000402451 12Z" fill="currentColor" />
          </svg>
        `;

        itemElement.addEventListener('click', () => {
          showMenu(items.filter(item2 => item.menuId === item2.parentMenuId));
        });

        itemsContainer.appendChild(itemElement);
      }
    });

    catalogMenu.appendChild(itemsContainer);
  };

  const initMenu = () => {
    [...catalogMenu.children].forEach(element => element.remove());

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('catalog-menu-grid');

    const gridInner = document.createElement('div');
    gridInner.classList.add('catalog-menu-grid__inner', 'container');

    items.filter(menu => menu.type === 'gridItem').forEach(gridItem => {
      const gridButton = document.createElement('button');
      gridButton.classList.add('catalog-menu-grid-item');
      gridButton.type = 'button';

      gridButton.style.backgroundColor = gridItem.color;
      gridButton.style.backgroundImage = `url(${gridItem.image})`;

      const gridButtonText = document.createElement('div');
      gridButtonText.classList.add('catalog-menu-grid-item__text', `catalog-menu-grid-item__text_${gridItem.textPosition}`);
      gridButtonText.textContent = gridItem.name;

      gridButton.addEventListener('click', () => {
        showMenu(items.filter(item => item.parentMenuId === gridItem.menuId));
      });

      gridButton.appendChild(gridButtonText);
      gridInner.appendChild(gridButton);
    });

    gridContainer.appendChild(gridInner);
    catalogMenu.appendChild(gridContainer);
  };

  const calculateMenuRects = () => {
    const headerHeight = parseFloat(getComputedStyle(document.querySelector('.header-wrapper')).height);
    const footerMenuHeight = parseFloat(getComputedStyle(document.querySelector('.footer-menu')).height);

    catalogMenu.style.top = `${headerHeight}px`;
    catalogMenu.style.height = isNaN(footerMenuHeight) ? `calc(100dvh - ${headerHeight}px)` : `calc(100dvh - ${headerHeight}px - ${footerMenuHeight}px)`;
  };

  document.querySelectorAll('[data-catalog-menu]').forEach(catalogMenuButton => {
    catalogMenuButton.addEventListener('click', () => {
      if (getComputedStyle(document.querySelector('.header-wrapper')).position !== 'sticky') {
        window.scroll({ top: 0, behavior: 'instant' });
      }

      const isShown = catalogMenu.classList.toggle('catalog-menu_shown');
      catalogMenuButton.classList.toggle('header-catalog-button_active', isShown);
      document.body.style.overflow = isShown ? 'hidden' : '';
      isShown && initMenu();
    });
  });

  window.addEventListener('resize', () => {
    if (window.outerWidth >= 1600) {
      document.body.style.overflow = '';

      document.querySelectorAll('.header-catalog-button_active').forEach(element =>
        element.classList.toggle('header-catalog-button_active', false));

      catalogMenu.classList.toggle('catalog-menu_shown', false);
    }

    calculateMenuRects();
  });

  window.addEventListener('scroll', () => calculateMenuRects());
  window.addEventListener('load', () => calculateMenuRects());

  calculateMenuRects();
});
