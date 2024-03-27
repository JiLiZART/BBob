export interface LexerTokenizer {
  tokenize: () => Token<string>[]
  isTokenNested?: (token: Token<string>) => boolean,
}

export type LexerOptions = {
  openTag?: string
  closeTag?: string
  onlyAllowTags?: string[]
  enableEscapeTags?: boolean
  contextFreeTags?: string[]
  onToken?: (token?: Token<string>) => void
}
