import {parse} from '../src'
import { render } from 'posthtml-render'

describe('posthtml-render', () => {

  it('render AST to html', () => {
    const ast = parse('[size=150][b]PostHTML render test[/b][/size]');
    const html = render(ast);

    expect(html).toBe('<size 150="150"><b>PostHTML render test</b></size>')
  })

});
