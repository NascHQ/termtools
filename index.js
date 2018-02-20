#!/usr/bin/env node
const fs = require('fs')
const inspector = require('inspector')
const path = require('path')
const colors = require('./colors')
const execSync = require('child_process').execSync

const IS_DEBUGGING = process.argv[1] === 'inspect'
const ARG_POSITION = IS_DEBUGGING ? 1 : 0

if (IS_DEBUGGING) {
    inspector.open(9229, 'localhost')
}

let ARGV = Array.from(process.argv)
ARGV.shift()

const PROFILER_JS_PATH = process.argv[ARG_POSITION + 1]
const DIR_NAME = path.dirname(PROFILER_JS_PATH)
const HOME = process.argv[ARG_POSITION + 5]

if (HOME.indexOf('/root/') >= 0) {
    HOME = require('os').homedir()
}

let useCustomSettings = 1
let SETTINGS = {}

try {
    // let's try and use the user's settings at ~/.bash_profile.js
    SETTINGS = require(HOME + '/.bash_profile.js')({})
    useCustomSettings = 1
} catch (e) {
    // if the file DOES exist, but there was an error:
    // if (e.message.toLowerCase().indexOf('enoent') < 0) {
    if (e.message.toLowerCase().indexOf('enoent') < 0 && e.message.indexOf('Cannot find module') < 0) {
        console.log(colors.red('[x] ') + 'Failed importing settings.\n' + e.message)
    }
    if (e.message.toLowerCase().indexOf('denied') >= 0) {
        console.log(
            colors.red('[x] '),
            'Permission denied to read your customized file.\n' +
            'Can you please set reading permissions for your ~/.bash_profile.js? \n' +
            '\n    chmod 555 ' + HOME + '/.bash_profile.js' + '\n\n')
    }
}

// populating some aliases
let aliases = fs.readFileSync(DIR_NAME + '/aliases.sh', 'utf8').toString()
if (SETTINGS.aliases) {
    for (let alias in SETTINGS.aliases) {
        aliases += '\nalias ' + alias + '=' + JSON.stringify(SETTINGS.aliases[alias])
    }
}

// adding git functions
let git = fs.readFileSync(DIR_NAME + '/get-git.sh', 'utf8').toString()
// battery manager
let battery = fs.readFileSync(DIR_NAME + '/battery.sh', 'utf8').toString()

/**
 * This is used to mark termtools as installed (by touching a ~/.uis file)
 * 
 * This will define the PS1 as a function to call our node manager.
 */
let ps1 = `
echo 0 > ~/.uis

# the battery_charge function updates some variables with information about the battery
battery_charge
function buildPS1ForReal () {
    # we will re-run battery_charge function every 10 seconds
    if ((SECONDS % 10 == "0")); then
        battery_charge
    fi

    # writtable checks if user has write access to the current directory
    WRITTABLE=0
    if [ -w \`pwd\` ]; then
        WRITTABLE=1
    fi

    # every time PS1 is rendered, we trigger this node call
    # ensuring it will bring its results up to date
    node ${DIR_NAME}/get-ps1-parts.js ${ARGV.join(' ')} $(getGit) \$WRITTABLE \$BATT_CONNECTED \$BATT_PCT \$(now) $1 ${useCustomSettings} 2>/dev/null
}

# This function is called only ONCE, as soon as the profile is applied
# it will write the PS1 in a way it will trigger buildPS1ForReal on new entries
# and will also write a default output for sudo
function buildPS1 () {
    PS2c=1
    PS1="\\$(if [ -n \\"\\$(type -t buildPS1ForReal)\\" ]; then echo \\"$(buildPS1ForReal $(whoami))\\"; else echo \\"$(cat ${DIR_NAME}/sudoed-ps1.txt 2>/dev/null)\\" ; fi)"
}

# here is where we use the current settings to generate the output for sudo
# we do this only once, too
node ${DIR_NAME}/get-ps1-parts.js ${ARGV.join(' ')} \$(now) root ${useCustomSettings} > ${DIR_NAME}/sudoed-ps1.txt 2>/dev/null

# exporting the function
export -f buildPS1

# as PROMPT_COMMAND is called before PS1 is rendered, we can update it there
PROMPT_COMMAND="buildPS1"

# also, we will deal with PS2, showing some line numbers while you type
# commands in multiple lines
PS1="\${PS2c##*[$((PS2c=1))-9]}\$PS1"
PS2="${colors.bgBlack.gray(" \\$((PS2c=PS2c+1)) ")}"
`

let nodeBin = ''

// joining all the resulting content
const exportedContent = '' +
    `#!/bin/bash\n` +
    `${aliases}\n` +
    `${git}\n` +
    `${battery}\n` +
    `${ps1}\n` +
    `${nodeBin}\n\n`

// and finally printing it all into the real .sh file
const exportedPath = DIR_NAME + '/exported.sh'

try {
    fs.writeFileSync(
        exportedPath,
        exportedContent
    )

    // let's set it as executable (trying it without sudo, and if failed, with sudo)
    execSync(`chmod +x ${exportedPath} || sudo chmod +x ${exportedPath}`)
} catch (e) {
    if (e.message.toLowerCase().indexOf('denied') < 0) {
        console.log(
            colors.red('[x] '),
            'Permission denied to write the output sh file.\n' +
            'Can you please set writing permissions to the following file? \n' +
            '\n    ' + exportedPath + '\n\n')
        console.log('\n'+
        'Do you have problem with sudo and global instalations? try running:\n\n   sudo chown -R $(whoami) ~/.npm\n\n')
    }
}
