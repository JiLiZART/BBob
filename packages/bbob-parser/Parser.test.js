const Parser = require('./Parser');
const TOKEN = require('./token');

describe('Parser', () => {
  test('parse paired tags tokens', () => {
    const parser = new Parser([
      [TOKEN.TYPE_TAG, 'ch'],
      [TOKEN.TYPE_TAG, '/ch'],
    ]);
  });
});
