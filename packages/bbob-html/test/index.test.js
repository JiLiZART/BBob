const render = require('../lib/index');
const parse = require('@bbob/parser');

const process = input => render(parse(input));

describe('@bbob/html', () => {
  test('render bbcode tag with single param as html tag', () => {
    const input = '[url=https://ru.wikipedia.org]Text[/url]';
    const result = '<url url="https://ru.wikipedia.org">Text</url>';

    expect(process(input)).toBe(result);
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
});
