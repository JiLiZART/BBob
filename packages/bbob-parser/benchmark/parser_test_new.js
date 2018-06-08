const parse = require('../index');

const options = {
    closableTags: ['ch', 'syllable', 'tab']
};

const textStub = require("./test/stub");

const count = 0;
const parsers3 = [];

console.time('newParser');
for (let i = 0; i <= count; i++) {
    const parser3 = parse(textStub, options);

    parsers3.push(parser3);
}
console.timeEnd('newParser');
// console.log(JSON.stringify(parsers3));