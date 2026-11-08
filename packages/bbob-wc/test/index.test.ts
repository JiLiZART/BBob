import BBCodeElement from '../src';

const mount = (markup: string) => {
  document.body.innerHTML = markup;

  return document.querySelector('bb-code') as BBCodeElement;
};

describe('@bbob/wc', () => {
  test('defines bb-code', () => {
    expect(customElements.get('bb-code')).toBe(BBCodeElement);
  });

  test('renders with html5 attribute', () => {
    const el = mount('<bb-code html5>[b]bolded text[/b]</bb-code>');

    expect(el.shadowRoot?.innerHTML).toBe('<span style="font-weight: bold;">bolded text</span>');
  });

  test('renders unknown tags as html without plugins', () => {
    const el = mount('<bb-code>[b]bolded text[/b]</bb-code>');

    expect(el.shadowRoot?.innerHTML).toBe('<b>bolded text</b>');
  });

  test('plugins property re-renders', () => {
    const el = mount('<bb-code>[b]bolded text[/b]</bb-code>');

    el.plugins = [(tree) => tree.walk((node) => (typeof node === 'string' ? node.toUpperCase() : node))];

    expect(el.shadowRoot?.innerHTML).toBe('<b>BOLDED TEXT</b>');
  });

  test('options attribute is parsed as JSON', () => {
    const el = mount('<bb-code html5 options=\'{"stripTags":true}\'>[b]bolded text[/b]</bb-code>');

    expect(el.shadowRoot?.innerHTML).toBe('bolded text');
  });
});
