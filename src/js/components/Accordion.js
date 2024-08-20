import EventObserver from '@helpers/EventObserver';

const eventObserver = new EventObserver();

const _instances = {};

export default class Accordion {
  constructor(options) {
    this.$el = options.el;
    this.id = options.id;
    this.$triggerBtn = options.triggerBtn;
    this.$hiddenEl = options.hiddenEl;
    // eslint-disable-next-line no-undef
    this.maxHeightHiddenEl = getComputedStyle(this.$hiddenEl).maxHeight.replace(/[^\d]/g, '');

    this.mutationConfig = {
      childList: true,
      subtree: true,
      characterDataOldValue: false,
    };

    this._isOpen = false;
    this._isOpenOnLoad = this.$el.classList.contains('active');
    this._isTypeCheckbox = this.$el.hasAttribute('data-accordion-checkbox');

    if (!this._isOpenOnLoad && this._isTypeCheckbox) {
      this._isOpenOnLoad = this.$triggerBtn.querySelector('input[type="checkbox"]:checked');
    }

    this.$linkedParent = this.$el.closest('[data-linked-accordions]');

    this.closeCallback = () => {};
    this.transitionEndCallback = () => {};
    this.openCallback = () => {};

    this.init();
  }

  init() {
    _instances[this.id] = this;
    this.$el.accordion = this;

    this._isOpenOnLoad && this.open();

    if (this.$triggerBtn) {
      this.$triggerBtn.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-modal-target')) return false;

        if (this._isOpen) {
          this.close();
        } else {
          this.open(e);
        }

        e.stopPropagation();
      });
    }

    this.$hiddenEl.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'max-height') {
        if (this._isOpen) {
          this.$hiddenEl.style.overflow = 'unset';
        } else {
          this.$hiddenEl.style.overflow = '';
        }

        // eslint-disable-next-line no-useless-call
        this.transitionEndCallback.call(this);
      }
    });

    window.addEventListener('resize', () => this._isOpen && this.updateHeight());

    // eslint-disable-next-line no-undef
    this.mutationObserver = new MutationObserver(this.updateHeight.bind(this));
    this.mutationObserver.observe(this.$hiddenEl, this.mutationConfig);

    if (this.$linkedParent) {
      eventObserver.subscribe(this.close.bind(this, true));
    }
  }

  open(e) {
    if (this._isOpen) return false;

    if (this._isTypeCheckbox) {
      const $checkbox = this.$triggerBtn.querySelector('input[type=checkbox]');
      if (!$checkbox.checked) return false;
    }

    if (this.$linkedParent) {
      eventObserver.broadcast();
    }

    this.$el.classList.add('active');
    this.$hiddenEl.style.maxHeight = this.$hiddenEl.scrollHeight + 'px';

    // eslint-disable-next-line no-useless-call
    this.openCallback.call(this);

    this._isOpen = true;
  }

  close(isEventObs = false) {
    if (!this._isOpen) return false;

    this.$el.classList.remove('active');
    this.$hiddenEl.style.overflow = '';
    this.$hiddenEl.style.maxHeight = '';

    if (!isEventObs && this._isTypeCheckbox) {
      const $checkbox = this.$triggerBtn.querySelector('input[type="checkbox"]');
      setTimeout(() => {
        if (!$checkbox.checked) {
          const unlockInstances = Accordion.getUnlockInstances();
          if (unlockInstances.length) {
            Accordion.open(unlockInstances[0].id);
          }
        }
      }, 0);
    }

    // eslint-disable-next-line no-useless-call
    this.closeCallback.call(this);

    this._isOpen = false;
  }

  updateHeight() {
    if (!this._isOpen) return false;
    this.$hiddenEl.style.maxHeight = this.$hiddenEl.scrollHeight + 'px';
  }

  static initAll() {
    const $els = document.querySelectorAll('[data-accordion]');

    $els.forEach((el) => {
      const id = el.getAttribute('data-accordion');
      const $hiddenEl = el.querySelector('[data-accordion-content]');
      const $triggerBtn = el.querySelector('[data-accordion-button]');

      // eslint-disable-next-line no-new
      new Accordion({
        el: el,
        id: id,
        triggerBtn: $triggerBtn,
        hiddenEl: $hiddenEl,
      });
    });
  }

  static open(id) {
    _instances[id].open();
  }

  static close(id) {
    _instances[id].close();
  }

  static setCloseCallback(id, callback) {
    _instances[id].closeCallback = callback;
  }

  static setTransitionEndCallback(id, callback) {
    _instances[id].transitionEndCallback = callback;
  }

  static setOpenCallback(id, callback) {
    _instances[id].openCallback = callback;
  }

  static getUnlockInstances() {
    const unlockInstances = [];
    for (const key in _instances) {
      if (_instances[key].$triggerBtn.querySelector('input:checked')) {
        unlockInstances.push(_instances[key]);
      }
    }

    return unlockInstances;
  }
}

Accordion.initAll();
window.Accordion = Accordion;
