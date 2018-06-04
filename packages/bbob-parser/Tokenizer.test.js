const Tokenizer = require('./Tokenizer');

describe("Tokenizer", () => {
    it("tokenize single tag", () => {
        const input = `[SingleTag]`;

        const tokens = new Tokenizer(input).tokenize();

        console.log('tokens', tokens);

        expect(tokens).toBeInstanceOf(Array);
        expect(tokens[0]).toEqual(['tag', 'SingleTag', 0, 0])
    })
});