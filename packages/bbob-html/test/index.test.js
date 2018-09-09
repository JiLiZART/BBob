import {parse} from '@bbob/parser'
import {render} from '../src';

const process = (input, params) => {
  const ast = parse(input);
  const html = render(ast, params);

  return html
};

describe('@bbob/html', () => {
  test('render bbcode tag with single param as html tag', () => {
    const input = '[url=https://ru.wikipedia.org]Text[/url]';
    const expected = '<url url="https://ru.wikipedia.org">Text</url>';
    const result = process(input)

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
});
