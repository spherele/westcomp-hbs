import Inputmask from 'inputmask';

export default class Mask {
  constructor($el) {
    this.$el = $el;

    this.maxLength = this.$el.maxLength <= 0 ? 5 : this.$el.maxLength;

    this.config = {
      showMaskOnHover: false,
    };

    this.init();
  }

  init() {
    this.instance = Inputmask(this.config).mask(this.$el);
    this.mask = this;
  }

  static initAll() {
    const $els = document.querySelectorAll('.j_mask');
    $els.forEach(($el) => new Mask($el));
  }
}

window.Mask = Mask;

Mask.initAll();
