import { TagNodeTree } from "./types";

export interface ParseError {
  tagName: string;
  lineNumber: number;
  columnNumber: number;
}

export interface TagNode {
  readonly tag: string
  attrs?: Record<string, unknown>
  content?: TagNodeTree
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

export interface LexerOptions {
  openTag?: string;
  closeTag?: string;
  onlyAllowTags?: string[];
  enableEscapeTags?: boolean;
  contextFreeTags?: string[];
  onToken?: (token?: Token<string>) => void;
}

export interface ParseOptions {
  createTokenizer?: (input: string, options?: LexerOptions) => LexerTokenizer;
  openTag?: string;
  closeTag?: string;
  onlyAllowTags?: string[];
  contextFreeTags?: string[];
  enableEscapeTags?: boolean;
  onError?: (error: ParseError) => void;
}
