import { ParseOptions } from "./parser";
import { NodeContent, PartialNodeContent, TagNodeObject, TagNodeTree } from "./types";

export interface BBobCoreOptions<
    Data = unknown | null,
    Options extends ParseOptions = ParseOptions
> extends ParseOptions {
  skipParse?: boolean;
  parser?: (source: string, options?: Options) => TagNodeObject[];
  render?: (ast?: TagNodeTree, options?: Options) => string;
  data?: Data;
}

export type IterateCallback<Content> = (node: Content) => Content

export interface BBobPluginOptions<
    Options extends ParseOptions = ParseOptions,
> {
  parse: BBobCoreOptions["parser"];
  render: (ast?: TagNodeTree, options?: Options) => string;
  iterate: <Content, Iterable = ArrayLike<Content> | Content>(t: Iterable, cb: IterateCallback<Content>) => Iterable;
  data: unknown | null;
}

export interface BBobPluginFunction {
  (tree: BBobCoreTagNodeTree, options: BBobPluginOptions): BBobCoreTagNodeTree;
}

export interface BBobCore<
    InputValue = string | TagNodeObject[],
    Options extends BBobCoreOptions = BBobCoreOptions
> {
  process(
      input: InputValue,
      opts?: Options
  ): {
    readonly html: string;
    tree: BBobCoreTagNodeTree;
    raw: TagNodeObject[] | string;
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
