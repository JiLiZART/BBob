const fs = require('fs');
const path = require('path');
const parse = require('../../packages/bbob-parser/lib/index').parse;
const render = require('../../packages/bbob-html/lib/index').render;


const data = fs.readFileSync(path.resolve('./yahoo.html'));

console.time('parse html');
const ast = parse(data, { openTag: '<', closeTag: '>' });
console.timeEnd('parse html');

fs.writeFileSync(path.resolve('./yahoo.json'), JSON.stringify(ast));
