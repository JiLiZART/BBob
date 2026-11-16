import html5Preset from '@bbob/preset-html5';

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

  test('raw html in source is escaped', () => {
    const el = mount('<bb-code html5>&lt;img src=x onerror="1"&gt;[b]a[/b]</bb-code>');

    expect(el.shadowRoot?.innerHTML).toBe('&lt;img src=x onerror="1"&gt;<span style="font-weight: bold;">a</span>');
  });

  test('options attribute is parsed as JSON', () => {
    const el = mount('<bb-code html5 options=\'{"stripTags":true}\'>[b]bolded text[/b]</bb-code>');

    expect(el.shadowRoot?.innerHTML).toBe('bolded text');
  });

  describe('define', () => {
    const upper = (tree: any) => tree.walk((node: any) => (typeof node === 'string' ? node.toUpperCase() : node));
    const preset = html5Preset.extend((tags) => ({
      ...tags,
      spoiler: (node) => ({ tag: 'details', attrs: {}, content: node.content }),
    }));

    test('use attribute applies a defined plugin', () => {
      BBCodeElement.define('upper', upper);

      const el = mount('<bb-code use="upper">[b]bolded text[/b]</bb-code>');

      expect(el.shadowRoot?.innerHTML).toBe('<b>BOLDED TEXT</b>');
    });

    test('use attribute applies a defined preset, in order with plugins', () => {
      BBCodeElement.define('upper', upper);
      BBCodeElement.define('my-preset', preset());

      const el = mount('<bb-code use="my-preset upper">[spoiler]hidden[/spoiler] [b]a[/b]</bb-code>');

      expect(el.shadowRoot?.innerHTML).toBe('<details>HIDDEN</details> <span style="font-weight: bold;">A</span>');
    });

    test('defining after the element is connected re-renders it', () => {
      const el = mount('<bb-code use="late">[b]bolded text[/b]</bb-code>');

      expect(el.shadowRoot?.innerHTML).toBe('<b>bolded text</b>');

      BBCodeElement.define('late', upper);

      expect(el.shadowRoot?.innerHTML).toBe('<b>BOLDED TEXT</b>');
    });
  });
});
