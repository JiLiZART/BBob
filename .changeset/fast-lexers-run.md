---
"@bbob/parser": patch
---

Faster lexer and parser with no API or output changes: char-code scanning instead of per-char strings, single-pass tag and attribute scanning, fewer per-token allocations, and work skipped when the options that need it (`contextFreeTags`, `whitespaceInTags`) are not set. Parsing is roughly 2–5x faster than 4.3.1 depending on the input.
