import html from '@bbob/html';
import html5Preset from '@bbob/preset-html5';

import type { BBobHTMLOptions } from '@bbob/html';
import type { BBobPluginFunction, BBobPlugins } from '@bbob/types';

// Raw text is not escaped by @bbob/html, so escape before parsing to keep HTML in the source inert.
const escapeHTML = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const registry = new Map<string, BBobPluginFunction>();
const connected = new Set<BBCodeElement>();

export class BBCodeElement extends HTMLElement {
  static get observedAttributes() {
    return ['html5', 'use', 'options'];
  }

  /**
   * Registers a plugin or a preset instance under a name usable in the `use` attribute.
   * Elements already on the page re-render, so it can be called after they are upgraded.
   */
  static define(name: string, plugin: BBobPluginFunction) {
    registry.set(name, plugin);
    connected.forEach((el) => el.render());
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
    connected.add(this);
    this.render();
  }

  disconnectedCallback() {
    connected.delete(this);
  }

  render() {
    if (!this.shadowRoot) {
      return;
    }

    const plugins: BBobPluginFunction[] = [];

    if (this.hasAttribute('html5')) {
      plugins.push(html5Preset() as BBobPluginFunction);
    }

    (this.getAttribute('use') || '').split(/\s+/).forEach((name) => {
      const plugin = registry.get(name);

      if (plugin) {
        plugins.push(plugin);
      }
    });

    this.shadowRoot.innerHTML = html(escapeHTML(this.textContent || ''), plugins.concat(this._plugins), this._options);
  }
}

export default BBCodeElement;
