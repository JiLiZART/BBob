Preset to render BBCode to HTML tags

## Spoiler Tag

The `[spoiler]` tag renders text hidden behind a black box. The text is invisible by default using inline styles (`background-color: #000; color: transparent`), so it works out of the box without any additional CSS.

To enable reveal-on-hover, add this CSS rule:

```css
.bb-spoiler:hover {
  color: inherit;
  background-color: inherit;
}
```

**Why a class?** CSS `:hover` pseudo-selectors cannot be expressed via inline styles (which is the only styling BBob produces), so the tag uses a `bb-spoiler` class to allow hover styling on your own.
