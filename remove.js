#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const colors = require('./colors')
const execSync = require('child_process').execSync
const HOME = require('os').homedir()

try {
    const redirectSH = __dirname + path.sep + 'redirect.sh'
    const REDIRECT_FILE = fs.readFileSync(redirectSH, 'utf8')
        .toString()
        .split('\n')
    if (REDIRECT_FILE[0][0] === '#' && REDIRECT_FILE[1][0] === '#') {
        console.log('> Termtools was already disabled')
    } else {
        const commented = '# ' + REDIRECT_FILE.join('\n# ')
        fs.writeFileSync(redirectSH, commented + '\n', 'utf8')
    }
} catch (error) {
    
}
