const fs = require('fs');
const program = require('commander');
const { version } = require('../package.json');

program
  .version(version)
  .parse(process.argv);

const options = {};

// eslint-disable-next-line no-unused-vars
function readFile(filename, encoding, callback) {
  if (options.file === '-') {
    // read from stdin
    const chunks = [];

    process.stdin.on('data', (chunk) => {
      chunks.push(chunk);
    });

    process.stdin.on('end', () => callback(null, Buffer.concat(chunks).toString(encoding)));
  } else {
    fs.readFile(filename, encoding, callback);
  }
}
