#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const colors = require('./colors')
const execSync = require('child_process').execSync
const HOME = require('os').homedir()
const PROFILE_PATH = HOME + path.sep + '.bash_profile'
const writeInBox = require('./box.js')

let SOURCE_COMMAND = '\n  source ' + __dirname + path.sep + 'index.sh'
let SOURCE_COMMAND_STR = `
# Pointing bash_profile to load profiler js${SOURCE_COMMAND};
`

try {
    const bashProfileContent = fs.readFileSync(PROFILE_PATH, 'utf8').toString()
    if (bashProfileContent.indexOf(SOURCE_COMMAND) < 0) {

        execSync(`echo "${SOURCE_COMMAND_STR}" >> ${PROFILE_PATH}`)

        const l = Math.max(60, SOURCE_COMMAND.length + 2)
        console.log(' > New source created and added to your ~/.bash_profile')
    } else {
        console.log('> Looks like you already had it applied to your ~/.bash_profile')
    }

} catch (error) {
    if (error.message.toLowerCase().indexOf('denied') < 0) {
        console.log(
            colors.red('[x] '),
            'Permission denied to access ~/.bash_profile.\n' +
            'You will need to add it to your bash_profile yourself: \n\n            ' +
            writeInBox(`\necho "${SOURCE_COMMAND.replace(/\n +/, '')}" >> ${PROFILE_PATH}`).join('\n        ') +
            '\n'
            // `\n    echo "${SOURCE_COMMAND_STR}" >> ${PROFILE_PATH}` + '\n\n'
        )
    }
}
