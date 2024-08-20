document.querySelectorAll('.catalog').forEach(catalog => {
  const gridViewButton = catalog.querySelector('.catalog-header-view-buttons__item_grid');
  const listViewButton = catalog.querySelector('.catalog-header-view-buttons__item_list');

  const resetActiveView = () => {
    catalog.classList.remove('catalog_grid', 'catalog_list');
    [gridViewButton, listViewButton].forEach(button => button.classList.remove('catalog-header-view-buttons__item_active'));
  };

  const setActiveView = view => {
    resetActiveView();

    switch (view) {
      case 'grid':
        catalog.classList.add('catalog_grid');
        gridViewButton.classList.add('catalog-header-view-buttons__item_active');
        break;

      case 'list':
        catalog.classList.add('catalog_list');
        listViewButton.classList.add('catalog-header-view-buttons__item_active');
        break;

      default:
        break;
    }
  };

  gridViewButton.addEventListener('click', () => setActiveView('grid'));
  listViewButton.addEventListener('click', () => setActiveView('list'));
});
