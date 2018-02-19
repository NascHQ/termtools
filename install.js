#!/usr/bin/env node


const fs = require('fs')
const path = require('path')
const os = require('os');
const colors = require('./colors')
const execSync = require('child_process').execSync
const HOME = os.homedir()
const PLATFORM = os.platform();
const PROFILE_PATH = HOME + path.sep + (PLATFORM === 'darwin' ? '.bash_profile' : '.bashrc')
const writeInBox = require('./box.js')
const redirectSH = __dirname + path.sep + 'redirect.sh'

let SOURCE_COMMAND = 'source ' + redirectSH
let SOURCE_COMMAND_STR = `# Pointing ${PROFILE_PATH} to load profiler js\n${SOURCE_COMMAND};`


try {
    // if the user's .bash_profile/.bashrc file,
    // does not import our "redirect.sh" yet,
    // we will append a line to it
    const bashProfileContent = fs.readFileSync(PROFILE_PATH, 'utf8').toString()
    let isNotInstalled =  bashProfileContent.indexOf(SOURCE_COMMAND) < 0
    
    if(isNotInstalled) {
        execSync(`echo "${SOURCE_COMMAND_STR}" >> ${PROFILE_PATH}`)

        console.log(`\n> ${SOURCE_COMMAND} command ADDED to ${PROFILE_PATH} file\n\n`)
        return;
    }
    
    // let's uncomment the lines in redirect.sh
    // used to apply/restore command
    let redirectContent = fs.readFileSync(redirectSH, 'utf8')
    redirectContent = redirectContent.replace(/(^|\n)\# /g, '$1')

    fs.writeFileSync(redirectSH, redirectContent, 'utf8')

} catch(error) {
    let errorMessage = error.message.toLowerCase();
    let isErrorDenied = errorMessage.indexOf('denied') < 0;

    if (isErrorDenied) {
        // if the problem was related to permission, 
        // we have to inform the user
        console.log(
            colors.red(`[x] `),
            `Permission denied to access ${PROFILE_PATH}.\n` +
            `You will need to add it to your ${PROFILE_PATH} yourself: \n\n    ` +
            writeInBox(`\necho "${SOURCE_COMMAND.replace(/\n +/, '')}" >> ${PROFILE_PATH}`).join('\n    ') +
            `\n` + 
            `\nIt\'s required only once, after that, termtools takes care of it for you.`
        )
    }
}
