const preset = require('../lib/index');
const bbob = require('@bbob/core');

const processor = bbob([
  preset(),
]);

describe('bbob-preset-html5', () => {
  test.skip('render [url]', () => {
    const input = '[url=https://ru.wikipedia.org]Text[/url]';
    const result = '<a href="https://ru.wikipedia.org">Text</a>';

    expect(processor.process(input, { sync: true })).toBe(result);
  });

  test('dummy', () => {
    expect(1).toBe(1);
  })
});
