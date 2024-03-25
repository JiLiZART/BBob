const { exec } = require('child_process');
const path = require('path');

const pathToBin = path.resolve(__dirname, '../bin/bbob')

describe('@bbob/cli', () => {
  console.log('pathToBin', pathToBin)
  test('simple string', (done) => {
    exec(`echo "hello" | ${pathToBin}`, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stdout.trim()).toBe('olleh');
      done();
    });
  });

  test('string with bbcodes', (done) => {
    exec(`echo "[i]Text[/i]" | ${pathToBin}`, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stdout.trim()).toBe('<span style="font-style: italic;">Text</span>');
      done();
    });
  });

  test('empty string', (done) => {
    exec(`echo "" | ${pathToBin}`, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stdout.trim()).toBe('');
      done();
    });
  });

  test('multiline string', (done) => {
    exec(`echo -e "[i]Text[/i]\n[i]Text[/i]" | ${pathToBin}`, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stdout.trim()).toBe('<span style="font-style: italic;">Text</span>\n<span style="font-style: italic;">Text</span>');
      done();
    });
  });
});
