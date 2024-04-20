import type { TagNodeObject } from "@bbob/plugin-helper";
import type { BbobPluginOptions } from "@bbob/core";

export type PresetFactoryOptions = Record<string, unknown>

export type PresetTagFunction<Node extends object = TagNodeObject> = (
    node: Node,
    core: BbobPluginOptions,
    options: PresetFactoryOptions
) => Node

export type PresetTagsDefinition<Name extends string = string> = Record<Name | string, PresetTagFunction>

export type PresetOptions = Record<string, unknown>
export type PresetExtendCallback<Names extends string> = (defTags: PresetTagsDefinition<Names>, options: PresetOptions) => PresetTagsDefinition<Names>
