document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.configurator .configurator__button.button--underline').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('[data-modal-configurator]').style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    });
  });
});
