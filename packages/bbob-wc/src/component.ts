import html from '@bbob/html';
import html5Preset from '@bbob/preset-html5';

import type { BBobHTMLOptions } from '@bbob/html';
import type { BBobPlugins } from '@bbob/types';

// Raw text is not escaped by @bbob/html, so escape before parsing to keep HTML in the source inert.
const escapeHTML = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export class BBCodeElement extends HTMLElement {
  static get observedAttributes() {
    return ['html5', 'options'];
  }

  private _plugins: BBobPlugins = [];

  private _options: BBobHTMLOptions = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /** Plugins are functions, so they are set as a property, not an attribute. */
  get plugins(): BBobPlugins {
    return this._plugins;
  }

  set plugins(value: BBobPlugins) {
    this._plugins = value;
    this.render();
  }

  get options(): BBobHTMLOptions {
    return this._options;
  }

  set options(value: BBobHTMLOptions) {
    this._options = value;
    this.render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === 'options') {
      this._options = JSON.parse(newValue || '{}');
    }

    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }

    const plugins = this.hasAttribute('html5') ? [html5Preset(), ...this._plugins] : this._plugins;

    this.shadowRoot.innerHTML = html(escapeHTML(this.textContent || ''), plugins, this._options);
  }
}

export default BBCodeElement;
