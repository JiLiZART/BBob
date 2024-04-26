import type { TagNodeObject } from "@bbob/plugin-helper";
import type { BBobCoreTagNodeTree, BBobPluginFunction, BBobPluginOptions } from "@bbob/core";
import type { process } from "./preset";

type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>

export type PresetTagsDefinition<Key extends string = string> = PartialRecord<Key, PresetTagFunction>

export type PresetOptions = Record<string, unknown>

export type ProcessorFunction<Tags extends PresetTagsDefinition = PresetTagsDefinition> = typeof process<Tags>;

export type ProcessorReturnType<Tags extends PresetTagsDefinition = PresetTagsDefinition> = ReturnType<ProcessorFunction<Tags>>;

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

export interface PresetExecutor<Tags extends PresetTagsDefinition = PresetTagsDefinition, Options extends PresetOptions = PresetOptions> extends BBobPluginFunction {
  (tree: BBobCoreTagNodeTree, core?: BBobPluginOptions): ProcessorReturnType<Tags>;
  options: Options;
}

export interface PresetFactory<
    Tags extends PresetTagsDefinition = PresetTagsDefinition,
    RootOptions extends PresetOptions = PresetOptions,
> {
  <Options extends RootOptions>(opts: Options): PresetExecutor<Tags, Options>;
  options?: RootOptions;
  extend: <NewTags extends PresetTagsDefinition = PresetTagsDefinition>(
      cb: PresetExtendCallback<Tags, NewTags, RootOptions>
  ) => PresetFactory<NewTags, RootOptions>;
}
