#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const colors = require('./colors')
const execSync = require('child_process').execSync
const HOME = require('os').homedir()
const PROFILE_PATH = HOME + path.sep + '.bash_profile'

// TODO, comment/uncomment the line in "redirect.sh"

let SOURCE_COMMAND = '\n  source ' + __dirname + path.sep + 'index.sh'

let bashProfileContent = fs.readFileSync(PROFILE_PATH, 'utf8').toString()
if (bashProfileContent.indexOf(SOURCE_COMMAND) >= 0) {
    let secondLine = SOURCE_COMMAND.split('\n')[1]
    bashProfileContent = bashProfileContent.replace(SOURCE_COMMAND, '\n#  ' + secondLine)

    fs.writeFileSync(PROFILE_PATH, bashProfileContent, 'utf8')
} else {
    console.log('> It was not found in your ~/.bash_profile\nPerhaps you moved it, importing it from some different file?')
}
