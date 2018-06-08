const parse = require('./index');
const OldParser = require('./benchmark/OldParser');

const options = {
    allowOnlyTags: ['ch', 'syllable', 'tab'],
};

describe("parse", () => {
    test("tag with spaces", () => {
        const ast = parse(`[Verse 2]`);

        expect(ast).toEqual([{tag: 'Verse 2', attrs: {}, content: []}]);
    });

    test("same as old parser", () => {
        const input = `[Verse 2]
[ch]Eb[/ch]            [ch]Fm[/ch]
  I'm walking around
[ch]Ab[/ch]               [ch]Cm[/ch]
  With my little raincloud
[ch]Eb[/ch]                [ch]Fm[/ch]
  Hanging over my head
[ch]Cm[/ch]                    [ch]Ab[/ch]
  And it ain’t coming down
[ch]Eb[/ch]           [ch]Fm[/ch]
  Where do I go?
[ch]Ab[/ch]                   [ch]Cm[/ch]
  Gimme some sort of sign
[ch]Eb[/ch]            [ch]Fm[/ch]
  Hit me with lightning!
[ch]Cm[/ch]                [ch]Ab[/ch]
  Maybe I’ll come alive
`;
        const ast1 = parse(input, options);
        const ast2 = OldParser.parse(input);

        expect(ast1).toEqual(ast2);
    })
});