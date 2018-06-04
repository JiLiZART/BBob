const parse = require('./index');
const OldParser = require('./benchmark/OldParser');
const tabText = require('./benchmark/test/stub');

const options = {
    closableTags: ['ch', 'syllable', 'tab'],
    allowOnlyTags: ['ch', 'syllable', 'tab'],
};

describe("parse", () => {
    test("tag with spaces", () => {
        const ast = parse(`[Verse 2]`);

        expect(ast).toEqual([{tag: 'Verse 2', attrs: {}, content: []}]);
    });

    test("same as old parser", () => {
        const ast1 = parse(tabText, options);
        const ast2 = OldParser.parse(tabText);

        expect(ast1).toEqual(ast2);
    })
});