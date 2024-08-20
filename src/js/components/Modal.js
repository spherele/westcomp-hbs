document.querySelectorAll('.modal-backdrop').forEach(modal => {
  modal.querySelector('.modal-header__close-button').addEventListener('click', () => {
    modal.style.visibility = '';
    document.body.style.overflow = '';
  });
});
