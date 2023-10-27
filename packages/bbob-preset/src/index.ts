/* eslint-disable indent */
import { isTagNode, NodeContent } from '@bbob/plugin-helper'

import type { BbobCoreTagNodeTree, BbobPluginOptions } from '@bbob/core'
import type { TagNode } from '@bbob/plugin-helper'

export type PresetFactoryOptions = Record<string, unknown>

export type PresetTagFunction<TagName = string, AttrValue = unknown> = (
    node: TagNode<TagName, AttrValue>,
    core: BbobPluginOptions,
    options: PresetFactoryOptions
) => NodeContent<TagName, AttrValue>

export type PresetTagsDefinition<TagName = string, AttrValue = unknown> =
    Record<string, PresetTagFunction<TagName, AttrValue>>

function process<TagName extends string = string, AttrValue = unknown>(
    tags: PresetTagsDefinition<TagName, AttrValue>,
    tree: BbobCoreTagNodeTree<TagName, AttrValue>,
    core: BbobPluginOptions,
    options: PresetFactoryOptions = {}
) {
    return tree.walk((node) => {
        if (isTagNode(node) && typeof tags[node.tag] === 'function') {
            const tag = node.tag
            const tagCallback = tags[tag]

            return tagCallback(node, core, options)
        }

        return node
    });
}

export type ProcessorFunction = typeof process

export type PresetExecutor<TagName extends string = string, AttrValue = unknown> = {
    (tree: BbobCoreTagNodeTree<TagName, AttrValue>, core: BbobPluginOptions): ReturnType<ProcessorFunction>
    options: PresetOptions,
}

export type PresetOptions = Record<string, unknown>
export type PresetExtendCallback = (defTags: PresetTagsDefinition, options: PresetOptions) => PresetTagsDefinition

export type PresetFactory<TagName extends string = string, AttrValue = unknown> = {
    (opts?: PresetOptions): PresetExecutor<TagName, AttrValue>,
    options?: PresetOptions,
    extend: (cb: PresetExtendCallback) => PresetFactory<TagName, AttrValue>
}

/**
 * Create a preset plugin for @bbob/core
 */
function createPreset(defTags: PresetTagsDefinition, processor: ProcessorFunction = process) {
  const presetFactory: PresetFactory = (opts: PresetOptions = {}) => {
    presetFactory.options = Object.assign(presetFactory.options || {}, opts);

    const presetExecutor: PresetExecutor = (tree, core) =>
        processor(defTags, tree, core, presetFactory.options);

    presetExecutor.options = presetFactory.options;

    return presetExecutor;
  };

  presetFactory.extend = (callback: PresetExtendCallback) => createPreset(
      callback(defTags, presetFactory.options || {}),
      processor,
  );

  return presetFactory;
}

export { createPreset };
export default createPreset;
