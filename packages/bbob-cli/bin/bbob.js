#!/usr/bin/env node
const html = require('@bbob/html').default;
const presetHTML5 = require('@bbob/preset-html5').default;

process.stdin.setEncoding('utf8');

let inputData = '';

// Read data from stdin
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    inputData += chunk;
  }
});

// Once there's no more data to read, reverse the input and write it to stdout
process.stdin.on('end', () => {
  const reversedData = html(inputData, presetHTML5()).toString();
  process.stdout.write(reversedData);
});
