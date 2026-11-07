/**
 * Shared benchmark fixtures. Kept separate so the harness and any ad-hoc
 * probe script measure exactly the same inputs.
 */

// Tag-dense (chord sheet).
const CHORD = '[ch]Eb[/ch]           [ch]Fm[/ch]\n[ch]Ab[/ch]              [ch]Cm[/ch]\n';

// Attribute-heavy.
const URL_TAG = '[url=https://example.com/page?x=1 target="_blank" rel="noopener"]link[/url] ';

// Plain prose with sparse tags.
const PROSE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
  + 'Sed do [b]eiusmod[/b] tempor incididunt ut labore et dolore magna aliqua. ';

export const FIXTURES = [
  { name: 'tagDense', input: CHORD.repeat(200), opts: { onlyAllowTags: ['ch'] } },
  { name: 'attrs', input: URL_TAG.repeat(200), opts: {} },
  { name: 'prose', input: PROSE.repeat(200), opts: {} },
  { name: 'nested', input: '[a][b][c][d][e]deep[/e][/d][/c][/b][/a] '.repeat(200), opts: {} },
  {
    name: 'codeFree',
    input: '[code]if (a[0] < b[1]) { return [x]; }[/code] normal text '.repeat(200),
    opts: { contextFreeTags: ['code'] },
  },
];
