document.querySelectorAll('.accordion-menu').forEach(accordion => {
  const header = accordion.querySelector('.accordion-menu-header');

  if (header.tagName === 'A') {
    header.querySelector('.accordion-menu-header__icon').addEventListener('click', event => {
      event.preventDefault();
      accordion.classList.toggle('accordion-menu_collapsed');
    });
  } else {
    header.addEventListener('click', () => accordion.classList.toggle('accordion-menu_collapsed'));
  }
});
