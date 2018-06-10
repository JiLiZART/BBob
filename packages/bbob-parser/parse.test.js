const parse = require('./index');

const options = {
    allowOnlyTags: ['ch', 'syllable', 'tab'],
};

describe("parse", () => {
    test("tag with spaces", () => {
        const ast = parse(`[Verse 2]`);

        expect(ast).toEqual([{tag: 'Verse 2', attrs: {}, content: []}]);
    });

    // test("pass invalid tags", () => {
    //     const inputs = [
    //         '[]',
    //         '![](image.jpg)',
    //         'x html([a. title][, alt][, classes]) x',
    //         '[/y]',
    //         '[sc',
    //         '[sc / [/sc]',
    //         '[sc arg="val',
    //     ];
    //
    //     const ast1 = parse(inputs[0]);
    //
    //
    //
    //     console.log('ast1', ast1);
    //
    //
    //
    //     expect(ast1).toEqual([
    //
    //     ]);
    // })
});