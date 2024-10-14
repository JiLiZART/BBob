import { TagNodeTree, TagPosition } from "./common";

export interface ParseError {
  tagName: string;
  lineNumber: number;
  columnNumber: number;
}

export interface TagNode {
  readonly tag: string
  attrs?: Record<string, unknown>
  content?: TagNodeTree,
  start?: TagPosition;
  end?: TagPosition;
}

export interface Token<TokenValue = string> {
  readonly t: number // type
  readonly v: string // value
  readonly l: number // line
  readonly r: number // row
}

export interface LexerTokenizer {
  tokenize: () => Token<string>[];
  isTokenNested?: (token: Token<string>) => boolean;
}

export interface CommonOptions {
  openTag?: string;
  closeTag?: string;
  onlyAllowTags?: string[];
  enableEscapeTags?: boolean;
  caseFreeTags?: boolean;
  contextFreeTags?: string[];
}

export interface LexerOptions extends CommonOptions {
  onToken?: (token?: Token<string>) => void;
}

export interface ParseOptions extends CommonOptions {
  createTokenizer?: (input: string, options?: LexerOptions) => LexerTokenizer;
  onError?: (error: ParseError) => void;
}
