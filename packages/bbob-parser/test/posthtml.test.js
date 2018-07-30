const render = require('posthtml-render');
const parse = require('../lib');

describe('posthtml-render', () => {

  it('render AST to html', () => {
    const ast = parse('[size=150][b]PostHTML render test[/b][/size]');
    const html = render(ast);

    expect(html).toBe('<size size="150"><b>PostHTML render test</b></size>')
  })

});
