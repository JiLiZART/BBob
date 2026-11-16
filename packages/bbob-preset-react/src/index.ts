import presetHTML5 from '@bbob/preset-html5';
import { getUniqAttr } from "@bbob/plugin-helper";

import type { PresetTagsDefinition } from '@bbob/types';

const tagAttr = (style: Record<string, string>) => ({
  attrs: {
    style,
  },
});

// React throws on a string `style`, so convert 'font-size: 1px; color: red' to { fontSize: '1px', color: 'red' }
// shortcut: naive split on ';' — values containing ';' (e.g. url(data:...;base64)) are cut; use a real CSS parser if that matters
const toStyleObject = (style: string) =>
  style.split(';').reduce<Record<string, string>>((acc, rule) => {
    const idx = rule.indexOf(':');
    const prop = rule.slice(0, idx).trim();
    const value = rule.slice(idx + 1).trim();

    if (idx > 0 && prop && value) {
      acc[prop.startsWith('--') ? prop : prop.replace(/-([a-z])/gi, (_, c: string) => c.toUpperCase())] = value;
    }

    return acc;
  }, {});

const presetReact = presetHTML5.extend<PresetTagsDefinition>((tags) => ({
  ...tags,

  img: (...args) => {
    const node = tags.img(...args);
    const { class: className, style, ...attrs } = (node.attrs || {}) as Record<string, unknown>;

    if (typeof className === 'string') {
      attrs.className = className;
    }

    if (typeof style === 'string') {
      attrs.style = toStyleObject(style);
    }

    return { ...node, attrs };
  },

  b: (...args) => ({
    ...tags.b(...args),
    ...tagAttr({ fontWeight: 'bold' }),
  }),

  i: (...args) => ({
    ...tags.i(...args),
    ...tagAttr({ fontStyle: 'italic' }),
  }),

  u: (...args) => ({
    ...tags.u(...args),
    ...tagAttr({ textDecoration: 'underline' }),
  }),

  s: (...args) => ({
    ...tags.s(...args),
    ...tagAttr({ textDecoration: 'line-through' }),
  }),

  color: (...args) => ({
    ...tags.color(...args),
    ...tagAttr({ color: String(getUniqAttr(args[0].attrs)) }),
  }),

  size: (...args) => ({
    ...tags.size(...args),
    ...tagAttr({ fontSize: String(getUniqAttr(args[0].attrs)) }),
  }),
}));

export default presetReact;
