import type {
  BBobCoreTagNodeTree,
  BBobPluginOptions,
} from "@bbob/core";
import { isTagNode } from "@bbob/plugin-helper";
import type {
  PresetFactory,
  PresetExtendCallback,
  PresetOptions,
  PresetTagsDefinition,
  ProcessorFunction,
} from "./types";

export function process<Tags extends PresetTagsDefinition = PresetTagsDefinition, Options extends PresetOptions = PresetOptions>(
  tags: Tags,
  tree: BBobCoreTagNodeTree,
  core: BBobPluginOptions,
  options: Options
) {
  return tree.walk((node) => {
    if (isTagNode(node)) {
      const tag = node.tag;
      const tagCallback = tags[tag];

      if (typeof tagCallback === "function") {
        return tagCallback(node, core, options);
      }
    }

    return node;
  });
}

/**
 * Create a preset plugin for @bbob/core
 */
function createPreset<Tags extends PresetTagsDefinition = PresetTagsDefinition, RootOptions extends PresetOptions = PresetOptions,>(
  defTags: Tags,
  processor: ProcessorFunction<Tags> = process
) {
  const presetFactory: PresetFactory<typeof defTags, RootOptions> = <Options extends RootOptions>(opts: Options) => {
    presetFactory.options = Object.assign(presetFactory.options || {}, opts);

    function presetExecutor(
      tree: BBobCoreTagNodeTree,
      core: BBobPluginOptions
    ) {
      return processor(defTags, tree, core, presetFactory.options || {});
    }

    presetExecutor.options = presetFactory.options as Options;

    return presetExecutor;
  };

  presetFactory.extend = function presetExtend<NewTags extends PresetTagsDefinition = PresetTagsDefinition>(
    callback: PresetExtendCallback<Tags, NewTags, RootOptions>
  ) {
    const newTags = callback(defTags, presetFactory.options)

    return createPreset<typeof newTags, RootOptions>(newTags, processor as unknown as ProcessorFunction<NewTags>);
  };

  return presetFactory;
}

export { createPreset };
export default createPreset;
