import html, { render } from '@bbob/html'
import core from '@bbob/core'

import preset from '../src'

const parse = (input: string) => {
  const tree = core(preset()).process(input, { render })

  return html(input, preset())
};

describe('@bbob/preset-html5', () => {
  test('[b]bolded text[/b]', () => {
    const input = '[b]bolded text[/b]';
    const result = '<span style="font-weight: bold;">bolded text</span>';
    expect(parse(input)).toBe(result);
  });

  test('[i]italicized text[/i]', () => {
    const input = '[i]italicized text[/i]';
    const result = '<span style="font-style: italic;">italicized text</span>';
    expect(parse(input)).toBe(result);
  });

  test('[u]underlined text[/u]', () => {
    const input = '[u]underlined text[/u]';
    const result = '<span style="text-decoration: underline;">underlined text</span>';
    expect(parse(input)).toBe(result);
  });

  test('[s]strikethrough text[/s]', () => {
    const input = '[s]strikethrough text[/s]';
    const result = '<span style="text-decoration: line-through;">strikethrough text</span>';
    expect(parse(input)).toBe(result);
  });

  test('[url]https://en.wikipedia.org[/url]', () => {
    const input = '[url]https://en.wikipedia.org[/url]';
    const result = '<a href="https://en.wikipedia.org">https://en.wikipedia.org</a>';

    expect(parse(input)).toBe(result);
  });

  test('[url=http://step.pgc.edu/]ECAT[/url]', () => {
    const input = '[url=http://step.pgc.edu/]ECAT[/url]';
    const result = '<a href="http://step.pgc.edu/">ECAT</a>';

    expect(parse(input)).toBe(result);
  });

  test('[img]https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Go-home-2.svg/100px-Go-home-2.svg.png[/img]', () => {
    const input = '[img]https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Go-home-2.svg/100px-Go-home-2.svg.png[/img]';
    const result = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Go-home-2.svg/100px-Go-home-2.svg.png"/>';

    expect(parse(input)).toBe(result);
  });

  test('[quote="author"]quoted text[/quote]', () => {
    const input = '[quote="author"]quoted text[/quote]';
    const result = '<blockquote><p>quoted text</p></blockquote>';

    expect(parse(input)).toBe(result);
  });

  test('[code]monospaced text[/code]', () => {
    const input = '[code]monospaced text[/code]';
    const result = '<pre>monospaced text</pre>';

    expect(parse(input)).toBe(result);
  });

  test('[style size="15px"]Large Text[/style]', () => {
    const input = '[style size="15px"]Large Text[/style]';
    const result = '<span style="font-size:15px;">Large Text</span>';

    expect(parse(input)).toBe(result);
  });

  test('[style color="red"]Red Text[/style]', () => {
    const input = '[style color="red"]Red Text[/style]';
    const result = '<span style="color:red;">Red Text</span>';

    expect(parse(input)).toBe(result);
  });

  test('[color="red"]Red Text[/color]', () => {
    const input = '[color="red"]Red Text[/color]';
    const result = '<span style="color: red;">Red Text</span>';

    expect(parse(input)).toBe(result);
  });

  test(`[list][*]Entry 1[/list]`, () => {
    const input = `[list][*]Entry 1[*]Entry 2[/list]`;
    const result = '<ul><li>Entry 1</li><li>Entry 2</li></ul>';

    expect(parse(input)).toBe(result);
  });

  test(`[list]*Entry 1[/list]`, () => {
    const input = `
    [list]
    *Entry 1
    *Entry 2
    [/list]`;
    const result = `
    <ul>
    <li>Entry 1
    </li><li>Entry 2
    </li></ul>`;

    expect(parse(input)).toBe(result);
  });

  test('[list=1][/list]', () => {
    const input = `[list=1][/list]`;
    const result = `<ol type="1"></ol>`;

    expect(parse(input)).toBe(result);
  });

  test('[list=A][/list]', () => {
    const input = `[list=A][/list]`;
    const result = `<ol type="A"></ol>`;

    expect(parse(input)).toBe(result);
  });

  test(`[table][/table]`, () => {
    const input = `[table][tr][td]table 1[/td][td]table 2[/td][/tr][tr][td]table 3[/td][td]table 4[/td][/tr][/table]`;
    const result = `<table><tr><td>table 1</td><td>table 2</td></tr><tr><td>table 3</td><td>table 4</td></tr></table>`;

    expect(parse(input)).toBe(result);
  });
});
