# Boilerplate

**[UI Demo](http://f0436264.xsph.ru/boilerplate/UI.html)**

## Development mode

```
yarn dev
```

## Production mode

```
yarn build
```

## Production mode for backend

Если используются чанки в `js`, то нужно указать определенный путь, откуда будут запрашиваться чанки

Путь указан в `config/paths.js`

```js
// For Backend
publicProduction: '/local/templates/example/assets/',
```

```
yarn build:prod
```

Пример асинхронных чанков

```js
// bundle.js
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
```

Сохраняется в папке /dist, там же архивируется с названием проекта

## Описание

- **[Основная структура страницы](#основная-структура-страницы)**
- **[Модальные окна](#модальные-окна)**
- **[Дропдауны](#дропдауны)**
- **[Селекты](#селекты)**
- **[Рекомендации](#рекомендации)**

## Основная структура страницы

```hbs
<!DOCTYPE html>
<html data-theme="light" class="page page--{{ title }}" {{#if isDev }} data-dev {{/if}}>
  <head>
    {{> layouts/head }}

    <title>{{ title }}</title>
  </head>
  <body>
    <div class="content">
      {{> layouts/header }}

      <main>
        {{> section/section1 }}
        {{> section/section2 }}
        {{> section/section3 }}
      </main>

      {{> layouts/footer }}
    </div>

    {{> layouts/modals }}
    {{> layouts/tooltips }}
  </body>
</html>
```

## Handebars

Все компоненты хранятся в `src/partials`.

если компонент находится в `src/partials/examples/example.hbs`, то получить его можно

```hbs
{{> examples/example }}
```

В компоненты можно передать свойства

```hbs
<!-- partials/components/example -->
<div class="example">
  {{ firstName }} {{ secondName }}

  <img src="{{ src }}" alt="" class="example__img" />
</div>

<!-- использование -->
{{> components/example
  firstName="Foo"
  secondName="Bar"
  src="../img/svg/done.svg"
}}

{{> components/example
  firstName="Foo2"
  secondName="Bar2"
  src="../img/svg/done.svg"
}}
```

## Модальные окна

Реализация модальных окон лежит в `src/js/components/Modal.js`

Инициализация происходит через атрибут `data-modal`

> ⚠️ `defaults.selectors.el` (`data-modal`) не изменять!

Пример модалки

```html
<div id="modal-example" class="modal-wrapper modal-wrapper--example" data-modal>
  <div class="modal">
    <div class="modal__wrap">
      <div class="modal__header"> modal title </div>

      <div class="modal__body">
        <div class="modal__content"> <p class="modal__text"> modal text </p> </div>
      </div>

      <div class="modal__footer">
        <p class="modal__text"> modal footer text </p>
      </div>
    </div>
  </div>
</div>
```

Пример использования API

```js
const $modal = document.querySelector('#modal-example');

console.log($modal.modal); // экземпляр класса

const initCallback = (e) => console.log('init', e);
const openCallback = (e) => console.log('open', e);
const closeCallback = (e) => console.log('close', e);

$modal.addEventListener('modal:init', initCallback);
$modal.addEventListener('modal:open', openCallback);
$modal.addEventListener('modal:close', closeCallback);

$modal.modal.open();
$modal.modal.close();

// init
Modal.initAll();
```

Стандартные опции модалки

```js
const defaults = {
  closeOnDocumentClick: false,
  scrollLock: true,
  openOnLoad: false,
  openOnFocus: false,
  preventCloseOnMouseMove: true,

  classes: {
    active: 'active',
  },

  events: {
    init: 'modal:init',
    open: 'modal:open',
    close: 'modal:close',
  },

  selectors: {
    el: '[data-modal]', // READONLY
    toggleBtns: '.j_toggleModal',
    openBtns: '[data-modal-target="#$0"]',
    closeBtns: '.j_closeModal',
    additionalEls: '.j_additionalEl',
  },
};
```

Опции модалки можно передать в JSON формате в атрибут `data-modal`

```html
<div
  id="modal-example"
  class="modal-wrapper modal-wrapper--example"
  data-modal='{"openOnLoad": true}'
>
  <!-- ... -->
</div>
```

Или если нужно переназначить глобальные опции для всех модалок, их можно добавить перед bundle.js

```html
<script>
  window.modalDefaults = {
    openOnLoad: true,
  };
</script>
```

## Дропдауны

Реализация дропдаунов лежит в `src/js/components/Dropdown.js`

Инициализация происходит через атрибут `data-dropdown`

> ⚠️ `defaults.selectors.el` (`data-dropdown`) не изменять!

Пример дропдауна

```html
<div id="dropdown-example" class="dropdown" data-dropdown>
  <button class="button dropdown__button j_toggleDropdown">
    <span> Dropdown </span>
    <div class="dropdown__arrow-wrapper">
      <svg class="svg dropdown__arrow">
        <use xlink:href="svg/sprite.svg#arrow-down"></use>
      </svg>
    </div>
  </button>

  <div class="dropdown__content"> Dropdown content </div>
</div>
```

Пример использования API

```js
const $dropdown = document.querySelector('#dropdown-example');

console.log($dropdown.dropdown); // экземпляр класса

const initCallback = (e) => console.log('init', e);
const openCallback = (e) => console.log('open', e);
const closeCallback = (e) => console.log('close', e);

$dropdown.addEventListener('dropdown:init', initCallback);
$dropdown.addEventListener('dropdown:open', openCallback);
$dropdown.addEventListener('dropdown:close', closeCallback);

$dropdown.dropdown.open();
$dropdown.dropdown.close();

// init
Dropdown.initAll();
```

Стандартные опции дропдауна

```js
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
```

Опции дропдауна можно передать в JSON формате в атрибут `data-dropdown`

```html
<div id="dropdown-example" class="dropdown" data-dropdown='{"closeOnDocumentClick": true}'>
  <!-- ... -->
</div>
```

Или если нужно переназначить глобальные опции для всех дропдаунов, их можно добавить перед bundle.js

```html
<script>
  window.dropdownDefaults = {
    closeOnDocumentClick: false,
  };
</script>
```

## Селекты

Реализация селектов лежит в `src/js/components/Select.js`

Инициализация происходит через атрибут `data-select`

> ⚠️ `defaults.selectors.el` (`data-select`) не изменять!

Пример селекта

```html
<select
  id="select-example"
  name="select-name-1"
  class="select button button-select"
  size="1"
  data-select
>
  <option value="dog"> Dog </option>
  <option value="cat" disabled> Cat </option>
  <option value="hamster"> Hamster </option>
  <option value="parrot"> Parrot </option>
  <option value="macaw"> Macaw </option>
  <option value="albatross"> Albatross </option>
  <option value="mouse"> Mouse </option>
  <option value="crocodile"> Crocodile </option>
  <option value="pig"> Pig </option>
  <option value="bear"> Bear </option>
  <option value="chicken"> Chicken </option>
</select>
```

Пример использования API

```js
const $select = document.querySelector('#select-example');

console.log($select.select); // экземпляр класса

const initCallback = (e) => console.log('init', e, e.detail);
const openCallback = (e) => console.log('open', e, e.detail);
const closeCallback = (e) => console.log('close', e, e.detail);
const selectCallback = (e) => console.log('select', e, e.detail);
const unselectCallback = (e) => console.log('unselect', e, e.detail);
const resetCallback = (e) => console.log('reset', e, e.detail);

$select.addEventListener(':init', initCallback);
$select.addEventListener(':open', openCallback);
$select.addEventListener(':close', closeCallback);
$select.addEventListener(':select', selectCallback);
$select.addEventListener(':unselect', unselectCallback);
$select.addEventListener(':reset', resetCallback);

$select.select.open();
$select.select.close();
$select.select.select('dog');
$select.select.select(['dog', 'cat']); // если multiple:true
$select.select.unselect('dog');
$select.select.unselect(['dog', 'cat']); // если multiple:true
$select.select.reset();
$select.select.setLoading(); // показать спиннер
$select.select.setLoading(false); // скрыть спиннер

// init
Select.initAll();
```

Стандартные опции селекта

```js
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
  startTags: 0, // кол-во выбранных, после которого ставятся теги; если -1 - тегов не будет
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
```

Опции селекта можно передать в JSON формате в атрибут `data-select`

```html
<select
  id="select-example"
  name="select-name-1"
  class="select button button-select"
  size="1"
  data-select='{"placeholder": "Other placeholder", "svgPath": "foo/bar/svg/sprite.svg"}'
>
  <!-- ... -->
</select>
```

Или если нужно переназначить глобальные опции для всех селектов, их можно добавить перед bundle.js

```html
<script>
  window.selectDefaults = {
    placeholder: 'Other placeholder',
    svgPath: 'foo/bar/svg/sprite.svg',
  };
</script>
```

## Рекомендации

### Структура

Каждая секция выносится в `src/partials/sections/`

Каждый блок, повторяющийся более 1го раза выносится в `src/partials/components/`

### `<picture>` и `<svg>`

Все картинки оборачивать в `<picture>`, каждый `<img>` должен быть с атрибутами `width` и `height`

```hbs
<picture class="picture-ratio">
  <source srcset="https://via.placeholder.com/400x200.webp" type="image/webp">
  <img src="https://via.placeholder.com/400x200.jpg" width="400" height="200">
</picture>
```

**Note**: для VS Code есть сниппет для `<picture>` : `pic` + `Tab`

Аналогично с `<svg>`:

```hbs
<svg width="20" height="20">
  <use xlink:href="svg/sprite.svg#arrow-right"></use>
</svg>
```

Также у `<img>` и `<svg>` должны всегда заданы размеры в css, чтобы в случае вставки изображения или иконки большего размера, чем предполагалось, верстка вела себя также, как и ожидалось

### Стили

Перед началом разработки, посмотреть на уже имеюищиеся стили, в частности на:

- `<html>`, `<body>`, `<main>`
- `.content`,
- `.container`, `.container__wrap`, `.container__left`, `.container__right`
- `<picture>`, `<img>`, `<svg>`
- компоненты в `views/UI.hbs`

Желательно все размеры задавать в `rem` и обязательно, если нужен пропорциональный адаптив(как картинка). Управлять размером только в `<html>` `font-size`:

```scss
// global/_typography.scss
html {
  font-size: calc(16px * var(--zoom, 1));

  // example
  // --zoom: var(--client-width) / 1920;
  // or
  // --zoom in .js
}
```

Таким образом всё будет зависеть от одного свойства `font-size` в `<html>`

Свойство `line-height` до мобильной версии всегда использовать в `em`(его можно опустить, указав, только значение)

Несколько тем можно добавить в `/variables/_colors.scss`:

```scss
// variables/_colors.scss
$colors: (
  light: (
    white: #fff,
    black: #000,
  ),
  dark: (
    white: #000,
    black: #fff,
  ),
  green: (
    white: green,
    black: red,
  ),
);
```

из `$colors` генерируются все цвета в `<html>`:

```scss
// html
--white: #fff;
--white-rgb: 255, 255, 255;
--base-white: #fff;
--base-white-rgb: 255, 255, 255;
--black: #000;
--black-rgb: 0, 0, 0;
--base-black: #000;
--base-black-rgb: 0, 0, 0;

// html[data-theme="dark"]
--white: #000;
--white-rgb: 0, 0, 0;
--black: #fff;
--black-rgb: 255, 255, 255;

// html[data-theme="green"]
--white: green;
--white-rgb: 0, 128, 0;
--black: red;
--black-rgb: 255, 0, 0;
```

### Наследование

Внимательно смотреть за имеющимися компонентами и добавлением новых классов на уже имеющиеся у них стили, в частности css переменные.

Если у компонента нужно изменить `padding`, а он у него задан через css переменную, то при наследовании от другого родителя, нужно изменять саму css переменную, не ломая изначальное поведение компонента.

Также если у компонента уже заданы размеры, если нужно изменить их, изменять то свойство, от которого они зависят.

Пример:

```scss
.example {
  width: 1em;
  min-width: 1em;
  height: 1em;
  min-height: 1em;
  font-size: 20px;
}
```

то решение будет следующим:

```scss
.other {
  .example {
    font-size: 24px;
  }
}
```

Аналогично, если размеры будут зависеть от css переменной:

```scss
.example {
  --size: 20px;

  width: 1em;
  min-width: 1em;
  height: 1em;
  min-height: 1em;
}
```

то:

```scss
.other {
  .example {
    --size: 24px;
  }
}
```

### Скрипты

Внимательно следить за подключенными скриптами. Если это часто использующийся компонент на многих страницах, то он должен быть в `bundle.js`, если это единичные случаи для него, подключать непосредственно на ту страницу, где он находится - `js/views/example.js`, когда страница `src/views/example.hbs`.

Желательно подключать компоненты асинхронно, через чанки, тем более, если большой размер компонентов. Также подключать по надобности: если компонент нужен только в мобильной версии, то подгружать непосредственно в ней.

Пример:

```js
// bundle.js
import css from '@utils/css';

(async () => {
  if (css.isMobile()) {
    await import(
      /* webpackChunkName: "MobileChunk" */
      '@components/MobileChunk'
    );
  } else {
    await import(
      /* webpackChunkName: "DesktopChunk" */
      '@components/DesktopChunk'
    );
  }
})();
```
