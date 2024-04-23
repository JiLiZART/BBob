const { execSync } = require('child_process');
const path = require('path');

const pathToBin = path.resolve(__dirname, '../bin/bbob.js')

describe('@bbob/cli', () => {
  test('simple string', () => {
    const stdout = execSync(`echo "hello" | ${pathToBin}`);

    expect(String(stdout).trim()).toBe('hello');
  });

  test('string with bbcodes', () => {
    const stdout = execSync(`echo "[i]Text[/i]" | ${pathToBin}`);

    expect(String(stdout).trim()).toBe('<span style="font-style: italic;">Text</span>');
  });

  test('empty string', () => {
    const stdout = execSync(`echo "" | ${pathToBin}`);

    expect(String(stdout).trim()).toBe('');
  });

  test('multiline string', () => {
    const stdout = execSync(`echo "[i]Text[/i]\n[i]Text[/i]" | ${pathToBin}`);

    expect(String(stdout).trim()).toBe('<span style="font-style: italic;">Text</span>\n<span style="font-style: italic;">Text</span>');
  });
});
