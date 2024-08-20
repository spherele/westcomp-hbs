document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer').forEach(footer => {
    footer.querySelector('.footer__button-scroll-up').addEventListener('click', () => {
      window.scroll({ top: 0, behavior: 'smooth' });
    });
  });

  const hero = document.querySelector('.hero');
  const footerMenu = document.querySelector('.footer-menu');
  if (hero === null || footerMenu === null) {
    return;
  }


  const intersectionObserver = new IntersectionObserver(({ 0: { isIntersecting } }) => {
    footerMenu.style.display = isIntersecting ? 'none' : '';
  });

  intersectionObserver.observe(hero);
});
