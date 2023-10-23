/**
 * @jest-environment jsdom
 */
import preset from '@bbob/preset-vue';
import { render } from '@testing-library/vue';
import Component from '../src/Component';

const renderBBCode = (input, options) => {
  const { html } = render(Component, {
    props: {
      plugins: [preset()],
      options,
    },
    slots: {
      default: input
    }
  })

  return html()
}

describe('@bbob/vue3', () => {
  test('[b]bolded text[/b]', () => {
    const html = renderBBCode('[b]bolded text[/b]');

    expect(html).toBe('<span><span style="font-weight: bold;">bolded text</span></span>')
  });

  test('[i]italicized text[/i]', () => {
    const html = renderBBCode('[i]italicized text[/i]');

    expect(html).toBe('<span><span style="font-style: italic;">italicized text</span></span>')
  });

  test('[u]underlined text[/u]', () => {
    const html = renderBBCode('[u]underlined text[/u]');

    expect(html).toBe('<span><span style="text-decoration: underline;">underlined text</span></span>')
  });

  test('[s]strikethrough text[/s]', () => {
    const html = renderBBCode('[s]strikethrough text[/s]');

    expect(html).toBe('<span><span style="text-decoration: line-through;">strikethrough text</span></span>')
  });

  test('[url]https://en.wikipedia.org[/url]', () => {
    const html = renderBBCode('[url]https://en.wikipedia.org[/url]');

    expect(html).toBe('<span><a href="https://en.wikipedia.org">https://en.wikipedia.org</a></span>')
  });

  test('[b]Testing[/b][hr]', () => {
    const html = renderBBCode('[b]Testing[/b][hr]');

    expect(html).toBe(`<span><span style="font-weight: bold;">Testing</span>
<hr></span>`)
  });

  test('render empty <slot></slot>', () => {
    const { html } = render(Component, {
      props: {
        plugins: [preset()],
      }
    })

    expect(html()).toBe('')
  })

  describe('options.onlyAllowTags', () => {
    test('render "[Super Feature] and [i]super[/i]" when only [i] allowed', () => {
      const html = renderBBCode('[Super Feature] and [i]super[/i]', { onlyAllowTags: ['i'] });

      expect(html).toBe('<span>[Super Feature] and <span style="font-style: italic;">super</span></span>')
    });
  });
})
