import { extend } from '@utils/objects';

export default class TabsController {
  constructor($tabsContainer, config = {}) {
    this.config = extend({}, defaults, TabsController.defaults, config);
    this.attrs = extend({}, this.config.attributes);
    this.$tabsContainer = $tabsContainer;

    this.id = this.$tabsContainer.getAttribute(this.attrs.tabsContainer);

    this.$contentsContainer = document.querySelector(
      `[${this.attrs.contentsContainer}="${this.id}"]`
    );

    if (!this.$contentsContainer) return false;

    this.$tabs = [...this.$tabsContainer.querySelectorAll(`[${this.attrs.tab}]`)];
    this.$contents = this._getContents();

    this.map = this._getMap();

    this.$activeOnLoadTab = this.$tabs.find(($trigger) =>
      $trigger.classList.contains(this.config.classes.active)
    );

    this.activeOnLoadId = this._getTabId(this.$activeOnLoadTab) || this._getTabId(this.$tabs[0]);

    this._prevId = null;
    this._activeId = null;

    !this.$tabsContainer.tabs && this.init();
  }

  init() {
    this.$tabsContainer.tabs = this;

    this.$tabsContainer.addEventListener('click', this.onClick.bind(this));

    this._dispatchEvent(this.config.events.init, this);
    this.open(this.activeOnLoadId, false);
  }

  onClick(e) {
    const $tab = e.target.closest(`[${this.attrs.tab}]`);

    $tab && this.open(this._getTabId($tab));
  }

  open(id, runCallback = true) {
    this.close();

    this._activateTab(id);
    this._activateContent(id);

    this._prevId = this._activeId;
    this._activeId = id;

    if (runCallback) {
      this._dispatchEvent(this.config.events.open, {
        prevId: this._prevId,
        activeId: this._activeId,
      });
    }
  }

  close(id) {
    this._deactivateTab(id);
    this._deactivateContent(id);
  }

  _getMap() {
    return new Map(
      this.$tabs.map(($tab) => {
        const id = this._getTabId($tab);
        const $content = this.$contents.find(($content) => this._getContentId($content) === id);

        return [id, { $tab, $content }];
      })
    );
  }

  _getContents() {
    return (this.$contents = [
      ...this.$contentsContainer.querySelectorAll(`[${this.attrs.content}]`),
    ].filter(($content) => {
      const $contentsContainer = $content.closest(`[${this.config.attributes.contentsContainer}]`);
      return $contentsContainer === this.$contentsContainer;
    }));
  }

  _getTabId($tab) {
    return $tab?.getAttribute(`${this.attrs.tab}`);
  }

  _getContentId($content) {
    return $content?.getAttribute(`${this.attrs.content}`);
  }

  _activateTab(id) {
    this.map.get(id).$tab.classList.add(this.config.classes.active);
  }

  _activateContent(id) {
    this.map.get(id).$content.classList.add(this.config.classes.active);
  }

  _deactivateTab(id = this._activeId) {
    if (!this._activeId) return false;
    this.map.get(id).$tab.classList.remove(this.config.classes.active);
  }

  _deactivateContent(id = this._activeId) {
    if (!this._activeId) return false;
    this.map.get(id).$content.classList.remove(this.config.classes.active);
  }

  _dispatchEvent(eventName, detail) {
    const selectEvent = new CustomEvent(eventName, {
      detail,
    });

    this.$tabsContainer.dispatchEvent(selectEvent);
  }

  static initAll() {
    const $tabsContainers = document.querySelectorAll(`[${defaults.attributes.tabsContainer}]`);

    return [...$tabsContainers].map(($tabsContainer) => new TabsController($tabsContainer));
  }
}

const defaults = {
  idAttribute: 'data-tabs',

  attributes: {
    tabsContainer: 'data-tabs',
    tab: 'data-tab',
    contentsContainer: 'data-tabs-contents',
    content: 'data-tab-content',
  },

  classes: {
    active: 'active',
  },

  events: {
    init: 'tabs:init',
    open: 'tabs:open',
    close: 'tabs:close',
  },
};

TabsController.defaults = defaults;

window.TabsController = TabsController;

TabsController.initAll();
