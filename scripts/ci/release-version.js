const { unlink, readFileSync } = require('fs');

try {
  const config = JSON.parse(readFileSync('./release.json'));
  const commitMessage = `v${config.releases[0].newVersion}`;
  // eslint-disable-next-line no-console
  console.log(commitMessage);
} catch (e) {
  // eslint-disable-next-line no-console
  console.log(e);
}

unlink('./release.json', () => {});
