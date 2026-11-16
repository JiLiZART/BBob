import { TagNode } from '@bbob/plugin-helper';
import toHTML, { BBobHTMLOptions, render } from '../src';

const process = (input: string, params?: BBobHTMLOptions) => toHTML(input, [], params);

describe('@bbob/html', () => {
  test('render bbcode tag with single param as html tag', () => {
    const input = '[url=https://ru.wikipedia.org]Text[/url]';
    const expected = '<url>Text</url>';
    const result = process(input);

    expect(result).toBe(expected);
  });

  test('render bbcode tag with multiple params as html tag', () => {
    const input = '[url href=https://ru.wikipedia.org target=_blank text="Foo Bar"]Text[/url]';
    const result = '<url href="https://ru.wikipedia.org" target="_blank" text="Foo Bar">Text</url>';

    expect(process(input)).toBe(result);
  });

  test('render bbcode tag without params as html tag', () => {
    const input = '[url]https://ru.wikipedia.org[/url]';
    const result = '<url>https://ru.wikipedia.org</url>';

    expect(process(input)).toBe(result);
  });

  test('strip tags', () => {
    const input = '[url]https://ru.wikipedia.org[/url]';
    const result = 'https://ru.wikipedia.org';

    expect(process(input, { stripTags: true })).toBe(result);
  });

  test('array of nodes', () => {
    const input = [
      'https://ru.wikipedia.org'
    ];
    const result = 'https://ru.wikipedia.org';

    expect(render(input)).toBe(result);
  });

  test('drops event handler attributes', () => {
    const input = '[img onerror=alert(1) src=x]x[/img]';

    expect(process(input)).toBe('<img src="x">x</img>');
  });

  test('drops malformed attribute names', () => {
    const input = '[a href=/x "onclick"=alert(1)]x[/a]';

    expect(process(input)).toBe('<a href="/x">x</a>');
  });

  test('ignores inherited attrs', () => {
    const attrs = Object.create({ onerror: 'alert(1)', inherited: 'x' });
    attrs.href = '/x';

    expect(render(TagNode.create('a', attrs, ['x']))).toBe('<a href="/x">x</a>');
  });
});
