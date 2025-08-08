import type {
  BBobCore,
  BBobCoreOptions,
  BBobCoreTagNodeTree,
  BBobPlugins,
  IterateCallback,
  NodeContent,
  PartialNodeContent
} from "@bbob/types";

import { parse } from '@bbob/parser';
import { iterate, match } from './utils.js';
import { C1, C2 } from './errors.js'

export function createTree<Options extends BBobCoreOptions = BBobCoreOptions>(tree: NodeContent[], options: Options) {
  const extendedTree = tree as BBobCoreTagNodeTree

  extendedTree.messages = [...(extendedTree.messages || [])]
  extendedTree.options = {...options, ...extendedTree.options}
  extendedTree.walk = function walkNodes(cb: IterateCallback<NodeContent>) {
    return iterate(this, cb);
  }
  extendedTree.match = function matchNodes(expr: PartialNodeContent | PartialNodeContent[], cb: IterateCallback<NodeContent>) {
    return match(this, expr, cb)
  }

  return extendedTree
}

export default function bbob<InputValue = string | NodeContent[], Options extends BBobCoreOptions = BBobCoreOptions>(
    plugs?: BBobPlugins
): BBobCore<InputValue, Options> {
  const plugins = typeof plugs === 'function' ? [plugs] : plugs || [];
  const mockRender = () => ""

  return {
    process(input, opts) {
      const options = opts || { skipParse: false, parser: parse, render: mockRender, data: null } as BBobCoreOptions
      const parseFn = options.parser || parse;
      const renderFn = options.render;
      const data = options.data || null;

      if (typeof parseFn !== 'function') {
        throw new Error(C1);
      }

      // raw tree before modification with plugins
      const raw = options.skipParse && Array.isArray(input) ? input : parseFn(input as string, options);
      let tree = options.skipParse && Array.isArray(input) ? createTree((input || []) as NodeContent[], options) : createTree(raw, options)

      for (let idx = 0; idx < plugins.length; idx++) {
        const plugin = plugins[idx]

        if (typeof plugin === 'function' && renderFn) {
          const newTree = plugin(tree, {
            parse: parseFn,
            render: renderFn,
            iterate,
            data,
          })

          tree = createTree(newTree || tree, options)
        }
      }

      return {
        get html() {
          if (typeof renderFn !== 'function') {
            throw new Error(C2);
          }

          return renderFn(tree, tree.options);
        },
        tree,
        raw,
        messages: tree.messages,
      };
    },
  };
}
