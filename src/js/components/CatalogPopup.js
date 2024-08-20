import { autoUpdate, computePosition, flip } from '@/node_modules/@floating-ui/dom/dist/floating-ui.dom.esm';

document.addEventListener('DOMContentLoaded', () => {
  const catalogPopup = document.getElementById('catalog-popup');

  let intervalHandle = null;
  let mouseX = 0;
  let mouseY = 0;

  const cleanupfc = [];

  window.addEventListener('mousemove', ({ x, y }) => {
    mouseX = x;
    mouseY = y;
  });

  document.querySelectorAll('[data-catalog-popup]').forEach(element => {
    if (element.dataset.disabled !== undefined) {
      return;
    }

    element.addEventListener('mouseenter', () => {
      clearInterval(intervalHandle);
      catalogPopup.style.display = '';
      document.querySelectorAll('.header-navigation-item').forEach(navigationItem => navigationItem.classList.toggle('header-navigation-item_expanded', false));

      intervalHandle = setInterval(() => {
        const elements = document.elementsFromPoint(mouseX, mouseY);

        if (!elements.includes(catalogPopup) && !elements.includes(element)) {
          catalogPopup.style.display = 'none';
          clearInterval(intervalHandle);
        }
      }, 500);
    });
  });

  catalogPopup.querySelectorAll('.catalog-popup-tabs__item[data-tab-id]').forEach(tabButton => {
    const tabContent = catalogPopup.querySelector(`.catalog-popup-tab-content[data-tab-id="${tabButton.dataset.tabId}"]`);

    if (tabContent === null) {
      return;
    }

    tabButton.addEventListener('click', () => {
      catalogPopup.querySelectorAll('.catalog-popup-tabs__item[data-tab-id]')
        .forEach(tabButton => tabButton.classList.toggle('catalog-popup-tabs__item_active', false));

      catalogPopup.querySelectorAll('.catalog-popup-tab-content').forEach(tabContent => (tabContent.style.display = 'none'));
      tabButton.classList.toggle('catalog-popup-tabs__item_active', true);

      tabContent.style.display = '';
    });
  });

  catalogPopup.querySelectorAll('.catalog-popup-tab-content').forEach(tabContent => {
    tabContent.addEventListener('scroll', () => {
      cleanupfc.forEach(item => item && item());
    });
  });

  catalogPopup.querySelectorAll('.catalog-popup-dropdown').forEach(dropdown => {
    const button = dropdown.querySelector('.catalog-popup-dropdown-button');
    const list = dropdown.querySelector('.catalog-popup-dropdown-list');

    // list.remove();
    // document.body.append(list);

    let cleanupAutoUpdate;

    // const dropdownIntervalHandle = setInterval(() => {
    //   if (dropdown.classList.contains('catalog-popup-dropdown_expanded')) {
    //     const elements = document.elementsFromPoint(mouseX, mouseY);

    //     if (elements.includes(button) || elements.includes(list)) {
    //       return;
    //     }

    //     cleanupAutoUpdate && cleanupAutoUpdate().then(() => { console.log(123) });
    //     clearInterval(dropdownIntervalHandle);

    //     // list.style.visibility = 'hidden';
    //     dropdown.classList.toggle('catalog-popup-dropdown_expanded', false);
    //   } else {
    //     cleanupAutoUpdate && cleanupAutoUpdate();
    //     clearInterval(dropdownIntervalHandle);
    //     list.style.visibility = 'hidden';
    //   }
    // }, 1000);

    button.addEventListener('mouseenter', () => {
      document.querySelectorAll('.catalog-popup-dropdown_expanded').forEach(element =>
        element.classList.toggle('catalog-popup-dropdown_expanded', false));
      dropdown.classList.toggle('catalog-popup-dropdown_expanded', true);

      cleanupAutoUpdate = autoUpdate(button, list, () => {
        computePosition(button, list, {
          middleware: [flip({ crossAxis: false })],
          placement: 'right-start'
        }).then(({ x, y, placement }) => {
          list.classList.toggle('catalog-popup-dropdown-list_position-left-start', placement === 'left-start');
          Object.assign(list.style, {
            visibility: 'visible',
            left: `${x}px`,
            top: `${y}px`
          });
        });
      });

      cleanupfc.push(cleanupAutoUpdate);
    });

    dropdown.addEventListener('mouseleave', () => {
      cleanupAutoUpdate && cleanupAutoUpdate();
      dropdown.classList.toggle('catalog-popup-dropdown_expanded', false);
      // list.visibility
      list.style.visibility = 'hidden';
      // window.removeEventListener('mousemove', mouseMoveHandler);
    });

    list.addEventListener('mouseleave', () => {
      cleanupAutoUpdate && cleanupAutoUpdate();
      dropdown.classList.toggle('catalog-popup-dropdown_expanded', false);
      // list.visibility
      list.style.visibility = 'hidden';
      // window.removeEventListener('mousemove', mouseMoveHandler);
    });

    // list.addEventListener('mouseleave', () => {
    //   dropdown.classList.toggle('catalog-popup-dropdown_expanded', false);
    //   // list.style.visibility = 'hidden';
    //   // window.removeEventListener('mousemove', mouseMoveHandler);
    // });
  });

  catalogPopup.querySelectorAll('.catalog-popup-accordion').forEach(accordion => {
    const declOfNum = (number, titles) => {
      const cases = [2, 0, 1, 1, 1, 2];
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    const content = accordion.querySelector('.catalog-popup-accordion__content');
    const button = accordion.querySelector('.catalog-popup-accordion-button');
    button.querySelector('.catalog-popup-accordion-button__text').textContent = `Ещё ${content.children.length} ${declOfNum(content.children.length, ['категория', 'категории', 'категорий'])}`;

    button.addEventListener('click', () => {
      const isExpanded = accordion.classList.toggle('catalog-popup-accordion_expanded');
      button.querySelector('.catalog-popup-accordion-button__text').textContent =
        isExpanded ? 'Свернуть' : `Ещё ${content.children.length} ${declOfNum(content.children.length, ['категория', 'категории', 'категорий'])}`;
    });
  });

  const calculateCatalogPopupMaxHeight = () => {
    const d = getComputedStyle(document.querySelector('.header-wrapper')).height;
    catalogPopup.style.maxHeight = `calc(100dvh - ${d})`;
  };

  window.addEventListener('resize', calculateCatalogPopupMaxHeight);
  calculateCatalogPopupMaxHeight();
});
