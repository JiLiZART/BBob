import type { ParseOptions, TagNode } from "@bbob/parser";
import type {
  NodeContent,
  PartialNodeContent,
  TagNodeTree,
} from "@bbob/plugin-helper";
import type { IterateCallback, iterate } from "./utils";

export interface BBobCoreOptions<
  Data = unknown | null,
  Options extends ParseOptions = ParseOptions
> extends ParseOptions {
  skipParse?: boolean;
  parser?: (source: string, options?: Options) => TagNode[];
  render?: (ast?: TagNodeTree, options?: Options) => string;
  data?: Data;
}

export interface BBobPluginOptions<
  Options extends ParseOptions = ParseOptions
> {
  parse: BBobCoreOptions["parser"];
  render: (ast?: TagNodeTree, options?: Options) => string;
  iterate: typeof iterate;
  data: unknown | null;
}

export interface BBobPluginFunction {
  (tree: BBobCoreTagNodeTree, options: BBobPluginOptions): BBobCoreTagNodeTree;
}

export interface BBobCore<
  InputValue = string | TagNode[],
  Options extends BBobCoreOptions = BBobCoreOptions
> {
  process(
    input: InputValue,
    opts?: Options
  ): {
    readonly html: string;
    tree: BBobCoreTagNodeTree;
    raw: TagNode[] | string;
    messages: unknown[];
  };
}

export interface BBobCoreTagNodeTree extends Array<NodeContent> {
  messages: unknown[];
  options: BBobCoreOptions;
  walk: (cb: IterateCallback<NodeContent>) => BBobCoreTagNodeTree;
  match: (
    expression: PartialNodeContent | PartialNodeContent[],
    cb: IterateCallback<NodeContent>
  ) => BBobCoreTagNodeTree;
}

export type BBobPlugins = BBobPluginFunction | BBobPluginFunction[];
