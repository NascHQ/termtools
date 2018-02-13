#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const colors = require('./colors')
const execSync = require('child_process').execSync
const HOME = require('os').homedir()
const PROFILE_PATH = HOME + path.sep + '.bash_profile'
const writeInBox = require('./box.js')

const redirectSH = __dirname + path.sep + 'redirect.sh'
let SOURCE_COMMAND = '\n  source ' + redirectSH
let SOURCE_COMMAND_STR = `
# Pointing bash_profile to load profiler js${SOURCE_COMMAND};
`

try {
    // if the user's bash_profile does not import our "redirect.sh" yet,
    // we will append a line to it
    const bashProfileContent = fs.readFileSync(PROFILE_PATH, 'utf8').toString()
    if (bashProfileContent.indexOf(SOURCE_COMMAND) < 0) {

        execSync(`echo "${SOURCE_COMMAND_STR}" >> ${PROFILE_PATH}`)

        const l = Math.max(60, SOURCE_COMMAND.length + 2)
        console.log('\n > New source created and added to your ~/.bash_profile\n\n')
    } else {
        // let's uncomment the lines in redirect.sh
        let redirectContent = fs.readFileSync(redirectSH, 'utf8')
        redirectContent = redirectContent.replace(/(^|\n)\# /g, '$1')
        fs.writeFileSync(redirectSH, redirectContent, 'utf8')
    }
} catch (error) {
    if (error.message.toLowerCase().indexOf('denied') < 0) {
        // if the problem was related to permission, we have to inform the user
        console.log(
            colors.red('[x] '),
            'Permission denied to access ~/.bash_profile.\n' +
            'You will need to add it to your bash_profile yourself: \n\n    ' +
            writeInBox(`\necho "${SOURCE_COMMAND.replace(/\n +/, '')}" >> ${PROFILE_PATH}`).join('\n    ') +
            '\n' + 
            '\nIt\'s required only once, after that, termtools takes care of it for you.'
        )
    }
}
