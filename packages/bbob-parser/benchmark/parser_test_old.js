const OldParser = require('./OldParser')

const textStub = require("./test/stub");

const count = 10;
const oldParsers3 = [];
console.time('oldParser');
for (let i = 0; i <= count; i++) {
    const oldParser3 = OldParser.parse(textStub);

    oldParsers3.push(oldParser3);
}
console.timeEnd('oldParser');
// console.log(JSON.stringify(oldParsers3));

