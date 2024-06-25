const config = require('./release.json');
const {unlink} = require('fs')

const commit_message = `v${config.releases[0].newVersion}`

unlink('./release.json', () => {})

console.log(commit_message)
