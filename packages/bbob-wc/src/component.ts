import html, { BBobHTMLOptions } from '@bbob/html';
import html5Preset from '@bbob/preset-html5';

export class BBCodeElement extends HTMLElement {
  static get observedAttributes() {
    return ['html5', 'plugins', 'options'];
  }

  private _useHTML5 = false;
  private _plugins: any[] = [];
  private _options: Record<string, any> = {};

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

  render() {
    const content = this.textContent || '';
    
    const plugins = this._useHTML5 ? [...this._plugins, html5Preset] : this._plugins;

    const parsedContent = html(content, plugins, this._options);
    
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = parsedContent;
    }
  }
}

if (typeof customElements !== 'undefined') {
  customElements.define('bb-code', BBCodeElement);
}

export default BBCodeElement;
