import { isVisiblePage } from '@utils/global';

export default class ThemeController {
  constructor() {
    this.$el = document.querySelector('[data-theme-switcher]');

    this.key = 'theme';
    this.theme = localStorage.getItem(this.key) || 'light';

    this.init();
  }

  init() {
    this.change(this.theme);
    this.updateStateSwitch();

    // window.addEventListener('load', this.onLoadWindow.bind(this));
    window.addEventListener('storage', this.onStorageWindow.bind(this));
    window.addEventListener('focus', this.onFocusWindow.bind(this));

    this.$el && this.$el.addEventListener('change', this.onChange.bind(this));
  }

  onLoadWindow() {
    this.updateStateSwitch();
  }

  onStorageWindow(e) {
    if (e.storageArea !== window.localStorage) return;
    if (e.key === this.key) {
      this.change(e.newValue);
    }
  }

  onFocusWindow() {
    setTimeout(() => {
      this.updateStateSwitch();
      document.firstElementChild.classList.remove('transition-theme-animate');
    }, 0);
  }

  onChange() {
    this.theme = this.$el && this.$el.checked ? 'dark' : 'light';
    localStorage.setItem(this.key, this.theme);
    this.change(this.theme);
  }

  change(theme = this.theme) {
    this.updateStateSwitch();

    const event = new CustomEvent('theme:change', { detail: theme });

    document.firstElementChild.classList.add('transition-theme-animate');
    document.firstElementChild.setAttribute('data-theme', theme);

    document.dispatchEvent(event);

    if (isVisiblePage()) {
      setTimeout(() => {
        document.firstElementChild.classList.remove('transition-theme-animate');
      }, 0);
    }
  }

  updateStateSwitch() {
    if (this.$el) {
      this.theme = localStorage.getItem(this.key);
      this.$el.checked = this.theme === 'dark';
    }
  }

  static init() {
    return new ThemeController();
  }
}
