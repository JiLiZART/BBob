export type StringNode = string | number

export interface TagNodeObject<TagValue extends any = any> {
  readonly tag: TagValue
  attrs?: Record<string, unknown>
  content?: TagNodeTree<TagValue>
}

export type NodeContent<TagValue extends any = any> = TagNodeObject<TagValue> | StringNode | null

export type PartialNodeContent<TagValue extends any = any> = Partial<TagNodeObject<TagValue>> | StringNode | null

export type TagNodeTree<TagValue extends any = any> = NodeContent<TagValue> | NodeContent<TagValue>[] | null
