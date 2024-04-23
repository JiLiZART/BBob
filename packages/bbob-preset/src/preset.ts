import type {
  BBobCoreTagNodeTree,
  BbobPluginOptions,
  BBobPluginFunction,
} from "@bbob/core";
import { isTagNode } from "@bbob/plugin-helper";
import type {
  PresetExtendCallback,
  PresetFactoryOptions,
  PresetOptions,
  PresetTagsDefinition,
} from "./types";

function process<Name extends string = string>(
  tags: PresetTagsDefinition<Name>,
  tree: BBobCoreTagNodeTree,
  core: BbobPluginOptions,
  options: PresetFactoryOptions = {}
) {
  return tree.walk((node) => {
    if (isTagNode(node) && typeof tags[node.tag] === "function") {
      const tag = node.tag;
      const tagCallback = tags[tag];

      return tagCallback(node, core, options);
    }

    return node;
  });
}

export type ProcessorFunction = typeof process;

export type ProcessorReturnType = ReturnType<ProcessorFunction>;

export interface PresetExecutor<
  TagName extends string = string,
  AttrValue = unknown
> extends BBobPluginFunction {
  (tree: BBobCoreTagNodeTree, core?: BbobPluginOptions): ProcessorReturnType;
  options: PresetOptions;
}

export interface PresetFactory<
  TagName extends string = string,
  AttrValue = unknown,
  Names extends string = string
> {
  (opts?: PresetOptions): PresetExecutor;
  options?: PresetOptions;
  extend: (
    cb: PresetExtendCallback<Names>
  ) => PresetFactory<TagName, AttrValue, Names>;
}

/**
 * Create a preset plugin for @bbob/core
 */
function createPreset<Names extends string = string>(
  defTags: PresetTagsDefinition<Names>,
  processor: ProcessorFunction = process
) {
  const presetFactory: PresetFactory = (opts: PresetOptions = {}) => {
    presetFactory.options = Object.assign(presetFactory.options || {}, opts);

    function presetExecutor(
      tree: BBobCoreTagNodeTree,
      core: BbobPluginOptions
    ) {
      return processor(defTags, tree, core, presetFactory.options);
    }

    presetExecutor.options = presetFactory.options;

    return presetExecutor;
  };

  presetFactory.extend = function presetExtend<ExtendNames extends string>(
    callback: PresetExtendCallback<Names & ExtendNames>
  ) {
    return createPreset(
      callback(defTags, presetFactory.options || {}),
      processor
    );
  };

  return presetFactory;
}

export { createPreset };
export default createPreset;
