import BBCodeElement from './component';

if (typeof customElements !== 'undefined') {
    customElements.define('bb-code', BBCodeElement);
}

export default BBCodeElement;
