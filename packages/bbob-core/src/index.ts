import { parse } from '@bbob/parser';
import { iterate, match } from './utils';
import { C1, C2 } from './errors'

import type { IterateCallback } from './utils';
import type { TagNodeTree, TagNode, NodeContent, PartialNodeContent } from "@bbob/plugin-helper";
import type { ParseOptions } from "@bbob/parser";

export interface BBobCoreOptions<Data = unknown | null, Options extends ParseOptions = ParseOptions> extends ParseOptions {
  skipParse?: boolean
  parser?: (source: string, options?: Options) => TagNode[]
  render?: (ast: TagNodeTree, options?: Options) => string
  data?: Data
}

export interface BbobPluginOptions<Options extends ParseOptions = ParseOptions> {
  parse: BBobCoreOptions['parser'],
  render: (ast: TagNodeTree, options?: Options) => string,
  iterate: typeof iterate,
  data: unknown | null,
}

export interface BBobPluginFunction {
  (tree: BBobCoreTagNodeTree, options: BbobPluginOptions): BBobCoreTagNodeTree
}

export interface BBobCore<InputValue = string | TagNode[], Options extends BBobCoreOptions = BBobCoreOptions> {
  process(input: InputValue, opts?: Options): {
    readonly html: string,
    tree: BBobCoreTagNodeTree,
    raw: TagNode[] | string,
    messages: unknown[],
  }
}

export interface BBobCoreTagNodeTree extends Array<TagNode> {
  messages: unknown[],
  options: BBobCoreOptions,
  walk: (cb: IterateCallback<NodeContent>) => BBobCoreTagNodeTree
  match: (expression: PartialNodeContent | PartialNodeContent[], cb: IterateCallback<NodeContent>) => BBobCoreTagNodeTree
}

export type BBobPlugins = BBobPluginFunction | BBobPluginFunction[]

function createTree<Options extends BBobCoreOptions = BBobCoreOptions>(tree: TagNode[], options: Options) {
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

export default function bbob<InputValue = string | TagNode[], Options extends BBobCoreOptions = BBobCoreOptions>(
    plugs: BBobPlugins
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
      let tree = options.skipParse && Array.isArray(input) ? createTree((input || []) as TagNode[], options) : createTree(raw, options)

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
