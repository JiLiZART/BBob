/* eslint-disable indent */
import { isTagNode } from '@bbob/plugin-helper'

import type { BBobCoreTagNodeTree, BbobPluginOptions } from '@bbob/core'
import type { TagNode, NodeContent } from '@bbob/plugin-helper'
import type { BBobPluginFunction } from "@bbob/core";

export type PresetFactoryOptions = Record<string, unknown>

export type PresetTagFunction = (
    node: TagNode,
    core: BbobPluginOptions,
    options: PresetFactoryOptions
) => NodeContent

export type PresetTagsDefinition<Names extends string = string> =
    Record<Names, PresetTagFunction>

function process<TagName extends string = string, AttrValue = unknown>(
    tags: PresetTagsDefinition,
    tree: BBobCoreTagNodeTree,
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

type ProcessorReturnType = ReturnType<ProcessorFunction>

export interface PresetExecutor<TagName extends string = string, AttrValue = unknown> extends BBobPluginFunction {
    (tree: BBobCoreTagNodeTree, core?: BbobPluginOptions): ProcessorReturnType
    options: PresetOptions,
}

export type PresetOptions = Record<string, unknown>
export type PresetExtendCallback = (defTags: PresetTagsDefinition, options: PresetOptions) => PresetTagsDefinition

export type PresetFactory<TagName extends string = string, AttrValue = unknown> = {
    (opts?: PresetOptions): PresetExecutor,
    options?: PresetOptions,
    extend: (cb: PresetExtendCallback) => PresetFactory
}

/**
 * Create a preset plugin for @bbob/core
 */
function createPreset(defTags: PresetTagsDefinition, processor: ProcessorFunction = process) {
  const presetFactory: PresetFactory = (opts: PresetOptions = {}) => {
    presetFactory.options = Object.assign(presetFactory.options || {}, opts);

    function presetExecutor(tree: BBobCoreTagNodeTree, core: BbobPluginOptions) {
      return processor(defTags, tree, core, presetFactory.options)
    }

    presetExecutor.options = presetFactory.options;

    return presetExecutor;
  };

  presetFactory.extend = function presetExtend(callback: PresetExtendCallback){
    return createPreset(
        callback(defTags, presetFactory.options || {}),
        processor,
    )
  }

  return presetFactory;
}

export { createPreset };
export default createPreset;
