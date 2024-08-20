window.addEventListener('resize', () => {
  if (window.outerWidth <= 767) {
    document.querySelector('.catalog-header-view-buttons__item_grid').click();
  } else {
    document.querySelector('.catalog-header-view-buttons__item_list').click();
  }
});
