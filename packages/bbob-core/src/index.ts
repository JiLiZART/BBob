import { parse } from '@bbob/parser';
import { iterate, same } from './utils';

import type { IterateCallback } from './utils';
import type { TagNodeTree, TagNode } from "@bbob/plugin-helper";
import type { ParseOptions } from "@bbob/parser";

export interface BBobCoreOptions<TagName = string, AttrValue = unknown> extends ParseOptions {
    skipParse?: boolean
    parser?: (source: string, options: ParseOptions) => TagNode<TagName, AttrValue>[]
    render: (ast: TagNodeTree<TagName, AttrValue>, options?: ParseOptions) => string
    data?: unknown | null
}

export interface BbobPluginOptions {
    parse: BBobCoreOptions['parser'],
    render: BBobCoreOptions['render'],
    iterate: typeof iterate,
    data: unknown | null,
}

export interface BBobPluginFunction<TagName = string, AttrValue = unknown> {
    (tree: TagNodeTree<TagName, AttrValue>, options: BbobPluginOptions): BbobCoreTagNodeTree<TagName, AttrValue>
}

export type BBobCore<TagName = string, AttrValue = unknown, InputValue = string | TagNode<TagName, AttrValue>[]> = {
    process(input: InputValue, opts?: BBobCoreOptions): {
        readonly html: string,
        tree: TagNode<TagName, AttrValue>[],
        raw: TagNode<TagName, AttrValue>[] | string,
        messages: unknown[],
    }
}

export type BbobCoreTagNodeTree<TagName = string, AttrValue = unknown> = {
    messages: unknown[],
    options: BBobCoreOptions,
    walk: (cb: IterateCallback<TagName, AttrValue>) => TagNodeTree<TagName, AttrValue>
    match: (expression: TagNode<TagName, AttrValue>[] | TagNode<TagName, AttrValue>, cb: IterateCallback<TagName, AttrValue>) => TagNode<TagName, AttrValue>[]
} & TagNode<TagName, AttrValue>[]

export default function bbob<TagName = string, AttrValue = unknown>(
    plugs: BBobPluginFunction<TagName, AttrValue> | BBobPluginFunction<TagName, AttrValue>[]
): BBobCore<TagName, AttrValue> {
    const plugins = typeof plugs === 'function' ? [plugs] : plugs || [];
    const mockRender = () => ""

    return {
        process(input, opts = { skipParse: false, parser: parse, render: mockRender }) {
            const options = opts
            const parseFn = options.parser || parse;
            const renderFn = options.render;
            const data = options.data || null;

            if (typeof parseFn !== 'function') {
                throw new Error('"parser" is not a function, please pass to "process(input, { parser })" right function');
            }

            let tree = (options.skipParse ? (input || []) : parseFn(input as string, options)) as TagNode<TagName, AttrValue>[]

            // raw tree before modification with plugins
            const raw = [...tree];

            let extendedTree = tree as BbobCoreTagNodeTree

            extendedTree.messages = []
            extendedTree.options = options
            extendedTree.walk = function walk<TagName = string, AttrValue = unknown>(cb: IterateCallback<TagName, AttrValue>) {
                return iterate(this, cb);
            }
            extendedTree.match = function match<TagName = string, AttrValue = unknown>(
                expression: TagNode<TagName, AttrValue>[] | TagNode<TagName, AttrValue>,
                cb: IterateCallback<TagName, AttrValue>
            ) {
                return iterate<TagName, AttrValue>(this, (node) => {
                    if (Array.isArray(expression)) {
                        for (let idx = 0; idx < expression.length; idx++) {
                            if (same(expression[idx], node)) {
                                return cb(node);
                            }
                        }
                    }

                    return same(expression, node) ? cb(node) : node;
                }) as TagNode<TagName, AttrValue>[]
            }

            for (let idx = 0; idx < plugins.length; idx++) {
                const plugin = plugins[idx]

                if (typeof plugin === 'function') {
                    const newTree = plugin(extendedTree, {
                        parse: parseFn,
                        render: renderFn,
                        iterate,
                        data,
                    })

                    extendedTree = newTree || tree
                }
            }

            return {
                get html() {
                    if (typeof renderFn !== 'function') {
                        throw new Error('"render" function not defined, please pass to "process(input, { render })"');
                    }
                    return renderFn(extendedTree, extendedTree.options);
                },
                tree,
                raw,
                messages: extendedTree.messages,
            };
        },
    };
}
