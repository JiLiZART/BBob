
import { BBobCoreTagNodeTree, BBobPluginFunction, BBobPluginOptions } from "./core.js";
import { TagNodeObject } from "./common.js";

export type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>

export type PresetTagsDefinition<
    Key extends string = string,
    TagValue extends any = any
> = Record<Key, PresetTagFunction<TagNodeObject<TagValue>>>

export type PresetOptions = Record<string, unknown>

export type ProcessorFunction<Tags extends PresetTagsDefinition = PresetTagsDefinition, Options extends PresetOptions = PresetOptions> = (
    tags: Tags,
    tree: BBobCoreTagNodeTree,
    core: BBobPluginOptions,
    options: Options
) => BBobCoreTagNodeTree

export type ProcessorReturnType = ReturnType<ProcessorFunction>;

export interface PresetTagFunction<Node extends TagNodeObject = TagNodeObject, Options extends PresetOptions = PresetOptions> {
  (
      node: Node,
      data: BBobPluginOptions,
      options: Options
  ): Node
}

export interface PresetExtendCallback<Tags, NewTags = Tags, Options extends PresetOptions = PresetOptions> {
  (defTags: Tags, options?: Options): NewTags
}

export interface PresetExecutor<Options extends PresetOptions = PresetOptions> extends BBobPluginFunction {
  (tree: BBobCoreTagNodeTree, core?: BBobPluginOptions): BBobCoreTagNodeTree;
  options: Options;
}

export interface PresetFactory<
    Tags extends PresetTagsDefinition = PresetTagsDefinition,
    RootOptions extends PresetOptions = PresetOptions,
> {
  <Options extends RootOptions>(opts?: Options): PresetExecutor<Options>;
  options?: RootOptions;
  extend: <NewTags extends PresetTagsDefinition = PresetTagsDefinition>(
      cb: PresetExtendCallback<Tags, NewTags, RootOptions>
  ) => PresetFactory<NewTags, RootOptions>;
}
