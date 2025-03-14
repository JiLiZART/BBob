import html from '@bbob/html';
import html5Preset from '@bbob/preset-html5';

import type { BBobHTMLOptions } from '@bbob/html';
import type { BBobPluginFunction } from '@bbob/types';

export class BBCodeElement extends HTMLElement {
  static get observedAttributes() {
    return ['html5', 'plugins', 'options'];
  }

  private _useHTML5 = false;
  private _plugins: string[] = [];
  private _options: BBobHTMLOptions = {};
  private _tag = 'div';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch(name) {
      case 'html5':
        this._useHTML5 = newValue !== null;
        break;
      case 'plugins':
        this._plugins = JSON.parse(newValue || '[]');
        break;
      case 'options':
        this._options = JSON.parse(newValue || '{}');
        break;
    }

    this.render();
  }

  connectedCallback() {
    this.render();
  }

  get plugins(): BBobPluginFunction[] {
    return this._plugins.map((plugin) => {
      return require(plugin);
    });
  }

  render() {
    if (this.shadowRoot) {
      const content = this.textContent || '';
    
      const plugins = this._useHTML5 ? [...this.plugins, html5Preset()] : this.plugins;

      this.shadowRoot.innerHTML = html(content, plugins, this._options);
    }
  }
}

export default BBCodeElement;
