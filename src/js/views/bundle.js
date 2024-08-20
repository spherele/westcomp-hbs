// scss
import '@scss/styles.scss';

// svg
import '@modules/_svg';

// components
// import '@components/Scrollbar';
// import '@components/Modal';
// import '@components/Dropdown';
// import '@components/Select';
import '@components/Mask';
import '@components/PasswordToggler';
import '@components/Accordion';
import '@components/TabsController';
import '@components/CardActionBar';
import '@components/VideoPlayer';
import '@components/SearchBar';
import '@components/FiltersPrice';
import '@components/Catalog';
import '@components/AccordionMenu';
import '@components/CatalogMenu';
import '@components/HamburgerMenu';
import '@components/Header';
import '@components/CatalogPopup';
import '@components/Footer';
import '@components/ConfiguratorSection';

// modules
import '@modules/phoneinput';
import '@modules/tippy';
import '@modules/sliders/slider-card';
import '@modules/sliders/slider-hero';
import '@modules/sliders/slider-advantages';
import '@modules/sliders/slider-products-cards';
import '@modules/sliders/slider-about-us';
import '@modules/sliders/slider-services';

// example async chunks
(async () => {
  await import(
    /* webpackChunkName: "Scrollbar" */
    '@components/Scrollbar'
  );
  await import(
    /* webpackChunkName: "Modal" */
    '@components/Modal'
  );
  await import(
    /* webpackChunkName: "Dropdown" */
    '@components/Dropdown'
  );
  await import(
    /* webpackChunkName: "Select" */
    '@components/Select'
  );
})();
