import html from '@bbob/html'
import presetHTML5 from '@bbob/preset-html5'

export function run(stdin = process.stdin, stdout = process.stdout) {
  stdin.setEncoding('utf8');

  let inputData = '';

  // Read data from stdin
  stdin.on('readable', () => {
    const chunk = stdin.read();

    if (chunk !== null) {
      inputData += chunk;
    }
  });

  // Once there's no more data to read, reverse the input and write it to stdout
  stdin.on('end', () => {
    const reversedData = html(inputData, presetHTML5()).toString();

    stdout.write(reversedData);
  });
}
