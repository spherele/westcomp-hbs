function searchBarInit() {
  const searchButtons = document.querySelectorAll('[data-button-search]');
  const searchBar = document.querySelector('[data-search-bar]');

  if (searchButtons) {
    searchButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const inputField = searchBar.querySelector('input');

        searchBar.classList.toggle('none');

        setTimeout(() => {
          inputField.value = '';
        }, 200);
      });
    });
  }
}

window.addEventListener('load', searchBarInit);
