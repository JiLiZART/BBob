export type StringNode = string | number

export interface TagNodeObject {
  readonly tag: string
  attrs?: Record<string, unknown>
  content?: TagNodeTree
}

export type NodeContent = TagNodeObject | StringNode | null

export type PartialNodeContent = Partial<TagNodeObject> | StringNode | null

export type TagNodeTree = NodeContent | NodeContent[] | null
