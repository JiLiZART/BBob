'use strict';

const fs = require('fs');
const program = require('commander');
const version = require('../package.json').version;

program
  .version(version)
  .parse(process.argv);

function readFile(filename, encoding, callback) {
  if (options.file === '-') {
    // read from stdin
    const chunks = [];

    process.stdin.on('data', function (chunk) { chunks.push(chunk); });

    process.stdin.on('end', function () {
      return callback(null, Buffer.concat(chunks).toString(encoding));
    });
  } else {
    fs.readFile(filename, encoding, callback);
  }
}
