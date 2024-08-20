document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.getElementById('hamburger-menu');

  document.querySelectorAll('[data-hamburger-menu]').forEach(element => {
    element.addEventListener('click', () => {
      if (getComputedStyle(document.querySelector('.header-wrapper')).position !== 'sticky') {
        window.scroll({ top: 0, behavior: 'instant' });
      }

      const isShown = hamburgerMenu.classList.toggle('hamburger-menu_shown');
      document.body.style.overflow = isShown ? 'hidden' : '';
    })
  });

  hamburgerMenu.querySelectorAll('.hamburger-menu-accordion').forEach(accordion => {
    accordion.querySelector('.hamburger-menu-accordion-button').addEventListener('click', () => {
      accordion.classList.toggle('hamburger-menu-accordion_expanded');
    });
  });

  const calculateMenuRects = () => {
    const headerHeight = parseFloat(getComputedStyle(document.querySelector('.header-wrapper')).height);
    const footerMenuHeight = parseFloat(getComputedStyle(document.querySelector('.footer-menu')).height);

    hamburgerMenu.style.top = `${headerHeight}px`;
    hamburgerMenu.style.height = isNaN(footerMenuHeight) ? `calc(100dvh - ${headerHeight}px)` : `calc(100dvh - ${headerHeight}px - ${footerMenuHeight}px)`;
  };

  window.addEventListener('resize', () => calculateMenuRects());
  window.addEventListener('scroll', () => calculateMenuRects());
  window.addEventListener('load', () => calculateMenuRects());

  calculateMenuRects();
});
