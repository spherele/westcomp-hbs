export default class PasswordToggler {
  constructor($btn) {
    this.$btn = $btn;
    this.$wrapper = this.$btn.closest('.input-wrapper');
    this.$input = this.$wrapper && this.$wrapper.querySelector('input');

    this._isShow = this.$btn.classList.contains('active');

    !this.passwordToggler && this.init();
  }

  init() {
    this.check();

    this.$btn.addEventListener('click', this.onClick.bind(this));

    this.passwordToggler = this;
  }

  onClick() {
    this.toggle();
    this.check();
  }

  toggle() {
    this.$btn.classList.toggle('active');
  }

  check() {
    this._isShow = this.$btn.classList.contains('active');
    this.$input.setAttribute('type', this._isShow ? 'text' : 'password');
  }

  static init() {
    const $el = document.querySelector('.j_togglePassword');

    if ($el) {
      const passwordToggler = new PasswordToggler($el);
    }
  }

  static initAll() {
    const $els = document.querySelectorAll('.j_passwordToggler');

    $els.forEach(($el) => new PasswordToggler($el));
  }
}

PasswordToggler.initAll();
