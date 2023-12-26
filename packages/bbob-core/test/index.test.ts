import { TagNode } from '@bbob/parser'
import core, { BBobPluginFunction, BBobPlugins } from '../src'
import { isTagNode } from "@bbob/plugin-helper";

const stringify = (val: unknown) => JSON.stringify(val);

const process = (plugins: BBobPlugins, input: string) => core(plugins).process(input, { render: stringify });

describe('@bbob/core', () => {
  test('parse bbcode string to ast and html', () => {
    const res = process([], '[style size="15px"]Large Text[/style]');
    const ast = res.tree;

    expect(res.html).toBe('[{"tag":"style","attrs":{"size":"15px"},"content":["Large"," ","Text"]}]');
    expect(ast).toBeInstanceOf(Array);
    expect(stringify(ast)).toEqual(stringify([
      {
        tag: 'style',
        attrs: { size: '15px' },
        content: ["Large", " ", "Text"]
      }
    ]))
  });

  test('plugin walk api node', () => {
    const testPlugin = () => {

      const plugin: BBobPluginFunction = (tree) => tree.walk(node => {
        if (isTagNode(node)) {
          if (node?.tag === 'mytag') {
            node.attrs = {
              pass: 1
            };

            if (Array.isArray(node.content)) {
              node.content.push('Test');
            }
          }

        }

        return node
      });

      return plugin
    }

    const res = process([testPlugin()], '[mytag size="15px"]Large Text[/mytag]');
    const ast = res.tree;

    expect(ast).toBeInstanceOf(Array);
    expect(ast.walk).toBeInstanceOf(Function);
    expect(stringify(ast)).toEqual(stringify([
      {
        tag: 'mytag',
        attrs: {
          pass: 1
        },
        content: [
          'Large',
          ' ',
          'Text',
          'Test'
        ]
      }
    ]));
  });

  test('plugin walk api string', () => {
    const testPlugin = () => {

      const plugin: BBobPluginFunction = (tree) => tree.walk(node => {
        if (node === ':)') {
          return TagNode.create('test-tag')
        }

        return node
      })

      return plugin
    };

    const res = process([testPlugin()], '[mytag]Large Text :)[/mytag]');
    const ast = res.tree;

    expect(ast).toBeInstanceOf(Array);
    expect(ast.walk).toBeInstanceOf(Function);
    expect(stringify(ast)).toEqual(stringify([
      {
        tag: 'mytag',
        attrs: {},
        content: [
          'Large',
          ' ',
          'Text',
          ' ',
          {
            tag: 'test-tag',
            attrs: {},
            content: [],
          }
        ]
      }
    ]));
  });

  test('plugin match api', () => {
    const testPlugin = () => {

      const plugin: BBobPluginFunction = (tree) => tree.match([{ tag: 'mytag1' }, { tag: 'mytag2' }], node => {
        if (isTagNode(node) && node.attrs) {
          node.attrs['pass'] = 1
        }

        return node
      })

      return plugin
    };

    const res = process([testPlugin()], `[mytag1 size="15"]Tag1[/mytag1][mytag2 size="16"]Tag2[/mytag2][mytag3]Tag3[/mytag3]`);
    const ast = res.tree;

    expect(ast).toBeInstanceOf(Array);
    expect(ast.walk).toBeInstanceOf(Function);
    expect(stringify(ast)).toEqual(stringify([
      {
        tag: 'mytag1',
        attrs: {
          size: '15',
          pass: 1
        },
        content: [
          'Tag1'
        ]
      },
      {
        tag: 'mytag2',
        attrs: {
          size: '16',
          pass: 1
        },
        content: [
          'Tag2'
        ]
      },
      {
        tag: 'mytag3',
        attrs: {},
        content: [
          'Tag3'
        ]
      }
    ]));
  })
});
