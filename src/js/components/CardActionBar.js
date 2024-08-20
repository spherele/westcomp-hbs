function cardActionBar() {
  const cardActionButtons = document.querySelectorAll('[data-card-action-btn]');

  if (cardActionButtons.length > 0) {
    cardActionButtons.forEach(function (cardActionButton) {
      cardActionButton.addEventListener('click', function (evt) {
        evt.preventDefault();

        this.classList.toggle('active');
      });
    });
  }
}

window.addEventListener('load', cardActionBar);
