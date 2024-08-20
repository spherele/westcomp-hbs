import { createPopper } from '@popperjs/core';

import ClassToggler from '@components/ClassToggler';
import { extend } from '@utils/objects';
import { createElement, wrap } from '@utils/elements';
import css from '@utils/css';

export default class Dropdown extends ClassToggler {
  constructor($el, config = {}) {
    config = extend(
      {},
      defaults,
      Dropdown.defaults,
      window.dropdownDefaults || {},
      config,
      (() => {
        try {
          return JSON.parse($el.getAttribute('data-dropdown') || '{}');
        } catch (_) {
          console.error(_, $el);
          return {};
        }
      })()
    );

    super($el, config);
  }

  superInit() {
    this.popper = null;

    this.$toggleBtns = [...this.$el.querySelectorAll(this.config.selectors.toggleBtns)];
    this.$openBtns = [...this.$el.querySelectorAll(this.config.selectors.openBtns)];
    this.$closeBtns = [...this.$el.querySelectorAll(this.config.selectors.closeBtns)];
    this.$content = this.$el.querySelector(this.config.selectors.content);
    this.$popper = null;

    super.superInit();
    this.init();
  }

  init() {
    this.$el.dropdown = this;

    if (this.config.popper) {
      this.initPopper();
    }

    this._dispatchEvent(this.config.events.init, this);
  }

  initPopper() {
    this.$popper = createElement('div', { class: this.config.classes.popper });

    wrap(this.$content, this.$popper);

    this._setOffsetPopperIfNeed();

    this.popper = createPopper(this.$el.firstElementChild, this.$popper, this.config.popperOptions);

    window.addEventListener('load', this.popper.update.bind(this));
  }

  _setOffsetPopperIfNeed() {
    const offsetPopperObj = this.config.popperOptions.modifiers.find(
      (obj) => obj.name === 'offset'
    );

    if (offsetPopperObj?.options?.offset === 'css') {
      const top = css.style(this.$content, 'top') - this.$el.firstElementChild.offsetHeight;
      const left = css.style(this.$content, 'left');

      offsetPopperObj.options.offset = [left, top];
    }
  }

  static initAll() {
    const $els = document.querySelectorAll(defaults.selectors.el);

    return [...$els].map(($el) => new Dropdown($el));
  }
}

const defaults = {
  closeOnDocumentClick: true,
  scrollLock: false,

  // https://popper.js.org/docs/v2/
  popper: false,
  popperOptions: {
    placement: 'bottom-start',
    strategy: 'fixed',

    modifiers: [
      {
        name: 'sameWidth',
        enabled: true,
        phase: 'beforeWrite',
        requires: ['computeStyles'],
        fn: ({ state }) => {
          state.styles.popper.width = `${state.rects.reference.width}px`;
        },
        effect: ({ state }) => {
          state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
        },
      },
      {
        name: 'offset',
        options: {
          offset: 'css', // [x, y] | если 'css' = взять из css свойства [top, left] у selectors.content
        },
      },
      {
        name: 'preventOverflow',
        options: {
          mainAxis: false,
          rootBoundary: 'document',
        },
      },
      {
        name: 'flip',
        options: {
          rootBoundary: 'document',
          tether: false,
        },
      },
    ],
  },

  classes: {
    active: 'active',
    popper: 'dropdown__popper',
  },

  events: {
    init: 'dropdown:init',
    open: 'dropdown:open',
    close: 'dropdown:close',
  },

  selectors: {
    el: '[data-dropdown]', // READONLY
    content: '.dropdown__content',
    toggleBtns: '.j_toggleDropdown',
    openBtns: '.j_openDropdown',
    closeBtns: '.j_closeDropdown',
    additionalEls: '.j_additionalDropdownEl',
  },
};

Dropdown.defaults = defaults;

window.Dropdown = Dropdown;

Dropdown.initAll();
