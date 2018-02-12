#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const colors = require('./colors')
const execSync = require('child_process').execSync
const HOME = require('os').homedir()
const PROFILE_PATH = HOME + path.sep + '.bash_profile'

// TODO, comment/uncomment the line in "redirect.sh"

try {
    const redirectSH = __dirname + path.sep + 'redirect.sh'
    const REDIRECT_FILE = fs.readFileSync(redirectSH, 'utf8')
        .toString()
        .split('\n')
    if (REDIRECT_FILE[0][0] === '#' && REDIRECT_FILE[1][0] === '#') {
        console.log('> Termtools was already disabled')
    } else {
        const commented = '# ' + REDIRECT_FILE.join('\n# ')
        fs.writeFileSync(redirectSH, commented, 'utf8')
    }
} catch (error) {
    
}

// let SOURCE_COMMAND = '\n  source ' + __dirname + path.sep + 'redirect.sh'

// let bashProfileContent = fs.readFileSync(PROFILE_PATH, 'utf8').toString()
// if (bashProfileContent.indexOf(SOURCE_COMMAND) >= 0) {
//     let secondLine = SOURCE_COMMAND.split('\n')[1]
//     bashProfileContent = bashProfileContent.replace(SOURCE_COMMAND, '\n#  ' + secondLine)

//     fs.writeFileSync(PROFILE_PATH, bashProfileContent, 'utf8')
// } else {
//     console.log('> It was not found in your ~/.bash_profile\nPerhaps you moved it, importing it from some different file?')
// }
