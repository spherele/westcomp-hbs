import Mark from 'mark.js/dist/mark.es6.min';
import { createPopper } from '@popperjs/core';

import ClassToggler from '@components/ClassToggler';
import Scrollbar from '@components/Scrollbar';
import { extend } from '@utils/objects';
import { isDescendant, createElement, wrap } from '@utils/elements';
import css from '@utils/css';

const errors = {
  expected: {
    string: 'Expected a String, got:',
    stringOrArray: 'Expected a String or Array, got:',
  },

  notFound: {
    key: 'Not found option with key:',
    templateItem: 'Not fount template with id:',
  },
};

export default class Select extends ClassToggler {
  constructor($el, config = {}) {
    config = extend(
      {},
      defaults,
      Select.defaults,
      window.selectDefaults || {},
      config,
      (() => {
        try {
          return JSON.parse($el.getAttribute('data-select') || '{}');
        } catch (_) {
          console.error(_, $el);
          return {};
        }
      })()
    );

    super($el, config);
  }

  superInit() {
    if (this.$el.parentNode.select) return false;

    this.$popper = null;

    this.popper = null;
    this.mark = null;

    this.renderTemplate();

    this.$toggleBtns = this.$el.querySelectorAll(this.config.selectors.toggleBtns);
    this.$openBtns = this.$el.querySelectorAll(this.config.selectors.openBtns);
    this.$closeBtns = this.$el.querySelectorAll(this.config.selectors.closeBtns);

    super.superInit();

    this.init();
  }

  init() {
    this.initOptions();
    this.initScrollbar();
    this.initHandlers();
    this.initSearch();

    if (this.config.popper) {
      this.initPopper();
    }

    this.refreshSelectedOptions();
    this.checkStates();
    this.setTitle();

    this.$select.select = this;

    this._dispatchEvent(this.config.events.init, this, this.$select);
  }

  initOptions() {
    this.$title = this.$el.querySelector(this.config.selectors.title);
    this.$tagsContainer = this.$el.querySelector(this.config.selectors.tagsContainer);
    this.$templateTitle = this.$el.querySelector(this.config.selectors.templateTitle);
    this.$counter = this.$el.querySelector(this.config.selectors.counter);
    this.$content = this.$el.querySelector(this.config.selectors.content);
    this.$list = this.$el.querySelector(this.config.selectors.list);
    this.$options = [
      ...this.$list.querySelectorAll(
        `${this.config.selectors.option}:not(${this.config.selectors.selectAllBtn})`
      ),
    ];
    this.options = new Map(this.$options.map(($option) => [$option.dataset.key, $option]));
    this.$search = this.$el.querySelector(this.config.selectors.search);
    this.$selectAllBtn = this.$list.querySelector(this.config.selectors.selectAllBtn);

    this._isMultiple = this.$select.multiple;
    this._isDisabled = this.$select.disabled;
    this._isLoading = false;

    this._selected = [];
  }

  initHandlers() {
    this.$list.addEventListener('click', this.onClick.bind(this));
    this.$tagsContainer.addEventListener('click', this.tagHandler.bind(this));
    this.$select.addEventListener('change', this.onChangeSelectNative.bind(this));

    if (this.config.debug) {
      this.$select.addEventListener(this.config.events.init, this.onInit.bind(this));
      this.$select.addEventListener(this.config.events.select, this.onSelect.bind(this));
      this.$select.addEventListener(this.config.events.unselect, this.onUnselect.bind(this));
      this.$select.addEventListener(this.config.events.reset, this.onReset.bind(this));
    }
  }

  initScrollbar() {
    Scrollbar.init(this.$list);
  }

  initSearch() {
    if (this.config.search.enabled) {
      this.mark = new Mark(this.$list);
      this.$search.addEventListener('input', this.search.bind(this));
      this.search();
    }
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

      offsetPopperObj.options.offset = [+left, top];
    }
  }

  search() {
    const value = this.$search.value;

    this.mark.unmark();

    if (value.length) {
      this.hideAllItems();

      this.mark.mark(value, {
        each: ($mark) => {
          const $option = $mark.closest(this.config.selectors.option);
          $option && this.showItem($option);
        },
      });
    } else {
      this.showAllItems();
    }
  }

  onInit(e) {
    console.log(this.config.events.init, this.id, this.config);
  }

  onClick(e) {
    const option = e.target.closest(this.config.selectors.option);

    if (option && !option.classList.contains(this.config.classes.disabled)) {
      if (option === this.$selectAllBtn) {
        this.onClickSelectAllBtn();

        return;
      }

      if (this._isMultiple) {
        this.toggleSelect(option.dataset.key);
      } else {
        this.select(option.dataset.key);
      }
    }
  }

  onSelect(e) {
    console.log(this.config.events.select, e.detail);
  }

  onUnselect(e) {
    console.log(this.config.events.unselect, e.detail);
  }

  onReset(e) {
    console.log(this.config.events.reset);
  }

  onChangeSelectNative() {
    if (this._isMultiple) {
      const values = this.$selectOptions
        .filter((option) => option.selected)
        .map((option) => option.value);

      this.unselectStateAll();
      this.select(values);
    } else {
      this.select(this.$select.value);
    }
  }

  onClickSelectAllBtn() {
    const optionsArray = [...this.options].reduce(
      (acc, curr) => {
        if (!curr[1].classList.contains(this.config.classes.disabled)) {
          acc[0].push(curr[1]);

          if (curr[1].classList.contains(this.config.classes.checked)) {
            acc[1].push(curr[1]);
          }
        }

        return acc;
      },
      [[], []]
    );

    if (optionsArray[0].length === optionsArray[1].length) {
      this.unselectAll();
    } else {
      this.selectAll();
    }
  }

  update() {
    this.refreshSelectedOptions();
    this.checkStates();
    this.setTitle();
    this.updateSelectAllBtn();
    this.popper?.update();
  }

  updateSelectAllBtn() {
    if (this.config.selectAllBtn.enabled) {
      const notDisabledOptions = [...this.options].filter(
        (option) => !option[1].classList.contains(this.config.classes.disabled)
      );
      const $buttonText = this.$selectAllBtn.querySelector('.checkbox__text');

      if (this._selected.length === notDisabledOptions.length) {
        this.$selectAllBtn.classList.add(this.config.classes.checked);
        $buttonText.textContent = this.config.selectAllBtn.textUnselectAll;
      } else {
        this.$selectAllBtn.classList.remove(this.config.classes.checked);
        $buttonText.textContent = this.config.selectAllBtn.textSelectAll;
      }
    }
  }

  tagHandler(e) {
    const $tag = e.target.closest(this.config.selectors.tag);

    if ($tag) {
      const $cross = $tag.querySelector('.button-icon');
      const isTargetOfTagCross = isDescendant($cross, e.target);

      if (isTargetOfTagCross) {
        e.stopPropagation();
        this.unselect($tag.dataset.key.split(','));
      }
    }
  }

  resetStates() {
    this.$el.classList.remove(this.config.classes.selected);
    this.$el.classList.remove(this.config.classes.multiple);
    this.$el.classList.remove(this.config.classes.counter);
    this.$el.classList.remove(this.config.classes.tags);
    this.$el.classList.remove(this.config.classes.template);

    [...this.$openBtns, ...this.$toggleBtns].forEach(($btn) => $btn.removeAttribute('tabindex'));
  }

  checkStates() {
    this.resetStates();

    if (this._selected.length > 0) {
      this.$el.classList.add(this.config.classes.selected);
    }

    if (this._isMultiple) {
      this.$el.classList.add(this.config.classes.multiple);

      if (this.config.counter && this._selected.length > 0) {
        this.$el.classList.add(this.config.classes.counter);
      } else {
        if (this.config.startTags >= 0 && this._selected.length > this.config.startTags) {
          this.$el.classList.add(this.config.classes.tags);
        } else {
          if (
            this._selected.length > 0 &&
            this.config.templateItem &&
            this.config.isTemplateTitle
          ) {
            this.$el.classList.add(this.config.classes.template);
          }
        }
      }
    } else {
      if (this._selected.length > 0 && this.config.templateItem && this.config.isTemplateTitle) {
        this.$el.classList.add(this.config.classes.template);
      }
    }

    if (this.config.mode) {
      this.$el.classList.add(`select--${this.config.mode}`);
    }

    if (this._isDisabled) {
      [...this.$openBtns, ...this.$toggleBtns].forEach(($btn) =>
        $btn.setAttribute('tabindex', '-1')
      );
    }
  }

  setDefaultTitle() {
    this.$title.innerHTML = this.config.placeholder;
    this.$tagsContainer.innerHTML = '';
    this.$templateTitle.innerHTML = '';
    this.$counter.innerHTML = '';
  }

  setTitle() {
    if (this._selected.length > 0) {
      if (this._isMultiple) {
        if (this.config.counter) {
          this.setCounterTitle();
          return;
        }

        if (this.config.startTags >= 0 && this._selected.length > this.config.startTags) {
          this.setTagsTitle();
        } else {
          if (this.config.templateItem && this.config.isTemplateTitle) {
            this.setTemplateTitle();
          } else {
            this.setSoloTitle();
          }
        }
      } else {
        if (this.config.templateItem && this.config.isTemplateTitle) {
          this.setTemplateTitle();
        } else {
          this.setSoloTitle();
        }
      }
    } else {
      this.setDefaultTitle();
    }
  }

  setTagsTitle() {
    const tagsArray = [];
    let tags = '';

    for (const $option of this.options.values()) {
      if ($option.classList.contains(this.config.classes.checked)) {
        tagsArray.push($option);
      }
    }

    const splicedTags = tagsArray.splice(this.config.maxTags);

    if (splicedTags.length) {
      splicedTags.push(...tagsArray.splice(tagsArray.length - 1));
    }

    tagsArray.forEach(($option) => {
      tags += this.config.templates.tag.call(this, {
        key: $option.dataset.key,
        text: $option.dataset.text,
        disabled: $option.classList.contains(this.config.classes.disabled),
      });
    });

    if (splicedTags.length) {
      tags += this.config.templates.tag.call(this, {
        key: splicedTags.map(($option) => $option.dataset.key).join(','),
        text: `${this.config.tagsMore} ${splicedTags.length}`,
        disabled: false,
      });
    }

    this.$title.innerHTML = '';
    this.$templateTitle.innerHTML = '';
    this.$tagsContainer.innerHTML = tags;
  }

  setSoloTitle() {
    let title = '';
    let i = 0;

    for (const $option of this.options.values()) {
      if ($option.classList.contains(this.config.classes.checked)) {
        title += i > 0 ? `, ${$option.dataset.text}` : $option.dataset.text;

        i++;
      }
    }

    this.$tagsContainer.innerHTML = '';
    this.$templateTitle.innerHTML = '';
    this.$title.innerHTML = title;
  }

  setTemplateTitle() {
    let title = '';

    for (const $option of this.options.values()) {
      if ($option.classList.contains(this.config.classes.checked)) {
        title = $option.innerHTML;
      }
    }

    this.$tagsContainer.innerHTML = '';
    this.$title.innerHTML = '';
    this.$templateTitle.innerHTML = title;
  }

  setCounterTitle() {
    const title = this.config.placeholder;
    let counter = 0;

    for (const $option of this.options.values()) {
      if ($option.classList.contains(this.config.classes.checked)) {
        counter++;
      }
    }

    this.$tagsContainer.innerHTML = '';
    this.$templateTitle.innerHTML = '';
    this.$title.innerHTML = title;
    this.$counter.innerHTML = counter;
  }

  refreshSelectedOptions() {
    this._selected = [];

    for (const key of this.options.keys()) {
      this.options.get(key).classList.contains(this.config.classes.checked) &&
        this._selected.push(key);
    }
  }

  renderTemplate() {
    let layoutHTML = '';

    const children = this.$el.children;
    const $newEl = createElement('div');

    if (this.config.selectAllBtn.enabled) {
      layoutHTML += this.config.templates.selectAllBtn.call(this, {
        text: this.config.selectAllBtn.textSelectAll,
        checked: false,
        disabled: false,
      });
    }

    const selected = [...this.$el.options].find(
      (option) => option.selected && !option.hasAttribute('selected')
    );

    if (selected) {
      selected.selected = false;
      this.$el.value = '';
    }

    [...children].forEach((child) => {
      if (child.children.length) {
        let optionsHTML = '';

        child.children.forEach(
          (option) => (optionsHTML += this.config.templates.option.call(this, option))
        );

        layoutHTML += this.config.templates.optgroup.call(this, child.label, optionsHTML);
      } else {
        layoutHTML += this.config.templates.option.call(this, child);
      }
    });

    this.$el.classList.remove('button', 'button-select');
    $newEl.classList.add(...this.$el.className.split(' '));

    if (this.$el.multiple) $newEl.classList.add(this.config.classes.multiple);
    if (this.$el.disabled) $newEl.classList.add(this.config.classes.disabled);

    const layout = this.config.templates.layout.call(this, layoutHTML);

    $newEl.innerHTML = layout;

    this.$el.insertAdjacentElement('afterend', $newEl);
    this.$el = $newEl;
    this.$select = this.$el.parentNode.removeChild(this.$el.previousSibling);
    this.$selectOptions = [...this.$select.options];
    this.removeAttributesInSelect();
    this.$el.firstElementChild.insertAdjacentElement('beforebegin', this.$select);
  }

  selectStateAll() {
    for (const key of this.options.keys()) {
      this.setSelectedState(key, true);
    }
  }

  unselectStateAll() {
    for (const key of this.options.keys()) {
      this.setSelectedState(key, false);
    }
  }

  setSelectedState(key, flag = true) {
    if (typeof key === 'string') {
      if (!this.options.has(key)) {
        this._throwError(errors.notFound.key, key);
      }

      const option = this.options.get(key);
      const event = flag ? 'add' : 'remove';
      const condition =
        !this._isMultiple && !flag
          ? true
          : !option.classList.contains(this.config.classes.disabled);

      if (condition) {
        option.classList[event](this.config.classes.checked);
        !this._isMultiple && this.$selectOptions.forEach((option) => (option.selected = false));
        const $option = this.$selectOptions.find((option) => option.value === key);
        $option.selected = flag;
      } else {
        return false;
      }
    } else {
      this._throwError(errors.expected.string, key);
    }

    return true;
  }

  hideItem($option) {
    const isItemGroup = $option.closest(this.config.selectors.itemGroup) === $option;

    if (isItemGroup) {
      $option.classList.add(this.config.classes.hidden);
    } else {
      $option.closest(this.config.selectors.item).classList.add(this.config.classes.hidden);

      this.checkEmptyItemGroup();
    }
  }

  showItem($option) {
    const isItemGroup = $option.closest(this.config.selectors.itemGroup) === $option;

    if (isItemGroup) {
      $option.classList.remove(this.config.classes.hidden);
    } else {
      $option.closest(this.config.selectors.item).classList.remove(this.config.classes.hidden);

      this.checkEmptyItemGroup();
    }
  }

  hideAllItems() {
    this.$options.forEach(($option) => this.hideItem($option));
  }

  showAllItems() {
    this.$options.forEach(($option) => this.showItem($option));
  }

  checkEmptyItemGroup() {
    const $itemGroups = this.$el.querySelectorAll(this.config.selectors.itemGroup);

    $itemGroups.forEach(($itemGroup) => {
      const $items = [...$itemGroup.querySelectorAll(this.config.selectors.item)];
      const $visibleItems = $items.filter(
        ($item) => !$item.classList.contains(this.config.classes.hidden)
      );

      if (!$visibleItems.length) {
        this.hideItem($itemGroup);
      } else {
        this.showItem($itemGroup);
      }
    });
  }

  removeAttributesInSelect() {
    this.$select.removeAttribute('class');
  }

  /* API */
  open(e) {
    super.open(e);

    if (this.config.search.enabled && this.config.search.autofocus) {
      setTimeout(() => this.$search.select(), 100);
    }
  }

  close(e) {
    super.close(e);

    if (this.config.search.enabled) {
      this.$search.blur();
      this.$search.value = '';
      this.search();
    }
  }

  select(key, flag = true) {
    const event = flag ? this.config.events.select : this.config.events.unselect;

    if (this._isMultiple) {
      if (Array.isArray(key)) {
        for (let i = 0; i < key.length; i++) {
          this.setSelectedState(key[i], flag);
        }
      } else if (typeof key === 'string') {
        if (!this.setSelectedState(key, flag)) return false;
      } else {
        this._throwError(errors.expected.stringOrArray, key);
      }
    } else {
      const option = this.options.get(key);

      if (this.options.has(key) && !option.classList.contains(this.config.classes.checked)) {
        this.unselectStateAll();
      }

      this.setSelectedState(key, flag);
      this.close();
    }

    this.update();

    this._dispatchEvent(event, { key: key, selected: this._selected }, this.$select);

    return true;
  }

  selectAll() {
    this.select([...this.options.keys()]);
  }

  unselectAll() {
    this.select([...this.options.keys()], false);
  }

  unselect(key) {
    this.select(key, false);
  }

  toggleSelect(key) {
    const option = this.options.get(key);

    if (option.classList.contains(this.config.classes.checked)) {
      this.unselect(key, false);
    } else {
      this.select(key);
    }
  }

  reset() {
    this.unselectStateAll();
    this.update();

    this._dispatchEvent(this.config.events.reset, this, this.$select);
  }

  setLoading(bool = true) {
    if (this._isLoading === bool) return false;

    if (bool) {
      this.$el.classList.add(this.config.classes.loading);
    } else {
      this.$el.classList.remove(this.config.classes.loading);
    }

    this._isLoading = bool;
  }

  static initAll() {
    const $selects = document.querySelectorAll(defaults.selectors.el);

    $selects.forEach(($select) => new Select($select));
  }
}

const defaults = {
  // ClassToggler
  closeOnDocumentClick: true, // если true - закрыть при клике вне элемента

  // Global
  debug: false, // если true - выводить логи колбеков
  mode: '', // дополнительные класс button--${mode}
  placeholder: '', // текст селекта, если ничего не выбрано
  svgPath: 'svg/sprite.svg', // путь к svg спрайту
  templateItem: '', // id шаблона кастомного option'а
  isTemplateTitle: true, // если true - взять кастомный шаблон option'а из templateItem
  startTags: 0, // кол-во выбранных, после которого ставятся теги
  maxTags: 3, // кол-во тегов, которые будут видны кроме тега с кол-вом остальных
  tagsMore: 'Ещё', // текст тега с кол-вом остальных
  counter: false, // если true - показать счетчик выбранных

  selectAllBtn: {
    // кнопка выбрать все
    enabled: false, // если true - показать кнопку
    textSelectAll: 'Выбрать все', // текст, чтобы выбрать все
    textUnselectAll: 'Убрать все', // текст, чтобы убрать все
  },

  // Search
  search: {
    // Поиск
    enabled: false, // если true - включить поиск
    placeholder: 'Поиск', // placeholder инпута поиска
    value: '', // value инпута поиска
    autofocus: true, // если true - фокусировать поиск при открытии
    inside: false, // если true - поиск внутри селекта
  },

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

  // Selectors
  selectors: {
    el: '[data-select]', // READONLY
    title: '.select__title',
    tagsContainer: '.select__tags',
    templateTitle: '.select__template-title',
    counter: '.select__counter',
    tag: '.select__tag',
    content: '.select__content',
    list: '.select__list',
    item: '.select__item',
    itemGroup: '.select__itemgroup',
    option: '.select__option',
    selectAllBtn: '.select__option--select-all',
    toggleBtns: '.j_toggleSelect',
    openBtns: '.j_openSelect',
    closeBtns: '.j_closeSelect',
    search: '.select__search input',
  },

  // ClassNames
  classes: {
    active: 'active',
    selected: 'selected',
    checked: 'checked',
    disabled: 'disabled',
    multiple: 'multiple',
    tags: 'tags',
    hidden: 'hidden',
    template: 'template',
    counter: 'counter',
    loading: 'loading',
    popper: 'select__popper',
  },

  // Events
  events: {
    init: ':init',
    open: ':open',
    close: ':close',
    select: ':select',
    unselect: ':unselect',
    reset: ':reset',
  },

  // Templates
  templates: {
    layout(html = '') {
      const button = this.config.templates.button.call(this);
      let search = '';

      if (this.config.search.enabled) {
        search = this.config.templates.search.call(this);
      }

      return `
        <div class="select__button-wrapper">
          ${button}
          ${!this.config.search.inside ? search : ''}
        </div>

        <div class="select__content">
          <div class="select__container">
          ${this.config.search.inside ? search : ''}
    
            <ul data-scrollbar class="select__list">
              ${html}
            </ul>
          </div>
        </div>
      `;
    },
    button() {
      const mode = this.config.mode ? `button--${this.config.mode}` : '';

      return `
        <button
          type="button"
          class="button ${mode} button-select select__button j_toggleSelect"
        >
          <div class="select__title-wrapper"> 
            <div class="select__title"> ${this.config.placeholder} </div>
            <em class="select__counter"> </em>
          </div>

          <div class="select__tags-wrapper">  
            <div class="select__tags"> </div>
          </div>

          <div class="select__template-title"> </div>
    
          <div class="select__arrow-wrapper">
            <svg class="select__arrow">
              <use xlink:href="${this.config.svgPath}#arrow-down"></use>
            </svg>
          </div>
        </button>
      `;
    },
    search() {
      return `
        <div class="select__search">
          <div class="input-wrapper">
            <div class="input-container">
              <input type="text" class="input" placeholder="${this.config.search.placeholder}" value="${this.config.search.value}" />
    
              <div
                class="button button-icon button--flat-2 input-control"
              >
                <svg>
                  <use xlink:href="${this.config.svgPath}#search"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>
      `;
    },
    selectAllBtn(option) {
      const text = option.text || '';
      const key = option.value || '';
      const checked = option.selected ? this.config.classes.checked : '';
      const disabled = option.disabled ? this.config.classes.disabled : '';

      return `
        <li class="select__item select__item--select-all">
          <div
            class="select__option select__option--select-all checkbox ${checked}"
          >
            <div class="checkbox__wrap"> 
              <div class="checkbox__custom"> 
                <svg class="checkbox__icon">
                  <use xlink:href="${this.config.svgPath}#done"></use>
                </svg>
              </div>
              <p class="checkbox__text"> ${text} </p>
            </div>
          </div>
        </li>
      `;
    },
    optgroup(title = '', html) {
      return `
        <li class="select__itemgroup">
          <span class="select__label"> ${title} </span>
    
          <ul class="select__items">
            ${html}
          </ul>
        </li>
      `;
    },
    option(option) {
      if (this.config.templateItem) {
        return this.config.templates.customItem.call(this, option);
      } else {
        return this.config.templates.item.call(this, option);
      }
    },
    item(option) {
      const text = option.text || '';
      const key = option.value || '';
      const checked = option.selected ? this.config.classes.checked : '';
      const disabled = option.disabled ? this.config.classes.disabled : '';
      const isSelectAll = option.isSelectAll ? this.config.classes.disabled : '';

      return `
        <li class="select__item">
          <div
            class="select__option checkbox ${checked} ${disabled}"
            data-key="${key}"
            data-text="${text}"
          >
            <div class="checkbox__wrap"> 
              <div class="checkbox__custom"> 
                <svg class="checkbox__icon">
                  <use xlink:href="${this.config.svgPath}#done"></use>
                </svg>
              </div>
              <p class="checkbox__text"> ${text} </p>
            </div>
          </div>
        </li>
      `;
    },
    customItem(option) {
      const text = option.text || '';
      const key = option.value || '';
      const checked = option.selected ? this.config.classes.checked : '';
      const disabled = option.disabled ? this.config.classes.disabled : '';

      const template = document.getElementById(this.config.templateItem);

      if (!template) {
        this._throwError(errors.notFound.templateItem, this.config.templateItem);
      }

      const clone = template && template.cloneNode(true);
      const data = extend(
        {},
        (() => {
          try {
            return JSON.parse(option.dataset.option);
          } catch (_) {
            console.error(_, option);
            return {};
          }
        })()
      );

      clone.removeAttribute('id');
      clone.removeAttribute('style');

      if (template && data) {
        for (const key in data) {
          clone.innerHTML = clone.innerHTML.replaceAll(`{${key}}`, data[key]);
        }
      }

      return `
        <li class="select__item">
          <div
            class="select__option ${checked} ${disabled}"
            data-key="${key}"
            data-text="${text}"
          >
            ${clone.outerHTML}
          </div>
        </li>
      `;
    },
    tag({ key = '', text = '', isDisabled = false }) {
      const disabled = isDisabled ? this.config.classes.disabled : '';

      return `
        <div data-key="${key}" class="select__tag ${disabled}">
          <span> ${text} </span>
    
          <div class="button button-icon button--flat">
            <svg class="svg">
              <use xlink:href="${this.config.svgPath}#cross"></use>
            </svg>
          </div>
        </div>
      `;
    },
  },
};

Select.defaults = defaults;

window.Select = Select;

Select.initAll();
