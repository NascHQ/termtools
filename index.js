#!/usr/bin/env node
const fs = require('fs')
const inspector = require('inspector')
const path = require('path')
const colors = require('chalk')
const execSync = require('child_process').execSync

const IS_DEBUGGING = process.argv[1] === 'inspect'
const ARG_POSITION = IS_DEBUGGING ? 1 : 0

if (IS_DEBUGGING) {
    inspector.open(9229, 'localhost')
}

let ARGV = Array.from(process.argv)
ARGV.shift()
// ARGV.shift()

// const NODE_BIN = process.argv[0]
const PROFILER_JS_PATH = process.argv[ARG_POSITION + 1]
// const PROFILER_SH_PATH = process.argv[ARG_POSITION + 2]
const DIR_NAME = path.dirname(PROFILER_JS_PATH)
// const IS_TTY = process.argv[ARG_POSITION + 3] == '1' ? true : false
// const MACHINE = colors.bgBlackBright.white(' 🖥 \\h ')
// const HOST_NAME = process.argv[ARG_POSITION + 4]
const HOME = process.argv[ARG_POSITION + 5]
// const IP = process.argv[ARG_POSITION + 6]
// // const IM = process.argv[ARG_POSITION + 7]
// const IS_ROOT = process.getuid && process.getuid() === 0
// const SESSION_TYPE = process.argv[ARG_POSITION + 7]
// // const USER = colors.bgBlueBright.white(' \\u ') + colors.bgBlackBright.blueBright('')

let useCustomSettings = 0
try {
    fs.copyFileSync(HOME + '/.bash_profile.js', DIR_NAME + '/custom-user-settings.js')
    useCustomSettings = 1
} catch (e) {
    if (e.message.indexOf('Cannot find module') < 0) {
        console.log(colors.red('[x] ') + 'Failed importing settings.\n' + e.message)
    }
}

// populating some aliases
let aliases = fs.readFileSync(DIR_NAME + '/aliases.sh', 'utf8').toString()

// for (let alias in SETTINGS.aliases) {
//     aliases += '\nalias ' + alias + '=' + JSON.stringify(SETTINGS.aliases[alias])
// }

aliases+= `
function testFncExpt () {
    echo 0 > ~/.uis
    #IS_ROOT=$(echo "$USER_IS_SUDO")
    #IS_ROOT=$USER_IS_SUDO
    #echo ">>$1<<"
    #if [ "$IS_ROOT" != 1 ]; then
       # IS_ROOT=0
    #else
     # echo ""
    #fi
    FORCE_COLOR=true && node ${DIR_NAME}/get-ps1-parts.js ${ARGV.join(' ')} ${useCustomSettings}
}
#export -f testFncExpt

COUNTER=0
#function buildPS1 () {
#    echo "\$(reallyBuildPS1)"
#}
echo 0 > ~/.uis
function buildPS1 () {
    #COUNTER=$((COUNTER + 1))
    #LOGNAME=$(logname)
    #UUSER=$([ "\${LOGNAME}" = "\${USER}" ] && echo \${USER} || echo '$(tput setaf 1)\${LOGNAME}$(tput sgr0) as \${USER}')

    #PS1="$(node ${DIR_NAME}/get-ps1-parts.js ${ARGV.join(' ')} \$(eval \"if [[ whoami -ne 'root' ]]; then echo 'NOTROOT'; else echo 'ROOT'; fi\") ${useCustomSettings})"
    echo "\$(now); \$(node ${DIR_NAME}/get-ps1-parts.js ${ARGV.join(' ')} \$(whoami) ${useCustomSettings})"
    #echo "\$COUNTER "
}
export -f buildPS1
#export -f reallyBuildPS1
`
// sudo bash -c "echo OI"

// let ps1 = `export PS1='${PS1Parts.join('')} \\W\\$ >> $(runNodePS1) $ '`
// let ps1 = `export PS1='\`node ${DIR_NAME}/get-ps1-parts.js \\"${JSON.stringify(SETTINGS)}\\"\`'`
let ps1 = `
#PROMPT_COMMAND="buildPS1"

#########PS1="\\$(buildPS1 || echo 123)"
PS1="\\$(if [ -n \\"\\$(type -t buildPS1)\\" ]; then buildPS1; else echo \\"IS THE FUCKING SUDOOO >>\\" ; fi)"



#PS1='\${PS2c##*[$((PS2c=0))-9]}- > '
#PS2='$((PS2c=PS2c+1)) > '
`
// let ps1 = `` 
let nodeBin = ''// `export PATH="$HOME/.node/bin:$PATH"`

// console.log("felipe  Felipes-MBP  var  www  powerline-shell  master  $ ")

const exportedContent = '' +
    `#!/bin/bash\n` +
    `${aliases}\n` +
    `${ps1}\n` +
    `${nodeBin}\n\n`

fs.writeFile(
    DIR_NAME + '/exported.sh',
    exportedContent,
    err => {
    if (err) {}
})
