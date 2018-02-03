#!/usr/bin/env node

const colors = require('chalk')
const path = require('path')
const fs = require('fs')
const execSync = require('child_process').execSync

const os = require('os')
const userInfo = os.userInfo()
const IS_DEBUGGING = process.argv[1] === 'inspect'
const ARG_POSITION = IS_DEBUGGING ? 1 : 0

const NODE_BIN = process.argv[0]
const PROFILER_JS_PATH = process.argv[ARG_POSITION + 2]
const PROFILER_SH_PATH = process.argv[ARG_POSITION + 3]
const DIR_NAME = path.dirname(PROFILER_JS_PATH)
const IS_TTY = process.argv[ARG_POSITION + 4] == '1' ? true : false
// const MACHINE = colors.bgBlackBright.white(' 🖥 \\h ')

const HOST_NAME = process.argv[ARG_POSITION + 5]
const HOME = process.argv[ARG_POSITION + 6]
const IP = process.argv[ARG_POSITION + 7]
const MACHINE = ` 🖥 ${HOST_NAME} `

// const IM = process.argv[ARG_POSITION + 7]
// const IS_ROOT = userInfo.username === 'root' || process.getuid && process.getuid() === 0
// console.log(userInfo)
const SESSION_TYPE = process.argv[ARG_POSITION + 7]
// let USER_NAME
const UUNAME = process.argv[process.argv.length - 2]
// console.log(IS_ROOT)
const USE_CUSTOM_SETTINGS = process.argv[process.argv.length - 1] === 1
// const USER_NAME = execSync('id -u | xargs echo -n').toString()//colors.bgBlueBright.white(' \\u ') + colors.bgBlackBright.blueBright('')
// const USER_NAME = execSync('echo `whoami` | xargs echo -n').toString()//colors.bgBlueBright.white(' \\u ') + colors.bgBlackBright.blueBright('')
// const USER_NAME = execSync('echo $LOGNAME').toString().replace(/\n/g, '')//colors.bgBlueBright.white(' \\u ') + colors.bgBlackBright.blueBright('')
// const USER_NAME = execSync('echo $USER').toString().replace(/\W/g, '')//colors.bgBlueBright.white(' \\u ') + colors.bgBlackBright.blueBright('')
// console.log('>>>', JSON.stringify(execSync('who am i').toString().split('   ').shift()))
// let IS_ROOT = JSON.stringify(execSync('OUTPUT="$USER" && echo "${OUTPUT}"').toString().replace(/\n/, ''))
// let IS_ROOT = JSON.stringify(execSync('echo $USER > ~/.tmp.un.txt && cat ~/.tmp.un.txt && rm ~/.tmp.un.txt').toString().replace(/\n/, ''))
// let IS_ROOT = JSON.stringify(execSync('echo $USER_IS_SUDO').toString().replace(/\n/, ''))
// let IS_ROOT = JSON.stringify(execSync('node -e "console.log(process.env.USER_IS_SUDO)"').toString().replace(/\n/, ''))
// const IS_ROOT = JSON.stringify(execSync('cat ~/.uis').toString())
// console.log(`${HOME}/.uis`)
// const IS_ROOT = execSync(`cat ${HOME}/.uis`).toString().replace(/\n/g, '')
const IS_ROOT = 0
// const IS_ROOT = fs.readFileSync(`${HOME}/.uis`, 'utf8')
// console.log('>>>>' + JSON.stringify(IS_ROOT) + '<<<<')
// console.log('>>>'+ IS_ROOT + ' > ' + (new Date).getTime())
console.log("UUNAME: '"+JSON.stringify(UUNAME)+"'", UUNAME == 'root')//, JSON.stringify(UUNAME).split(''))
// let IS_ROOT = ''
// console.log('>>>>', JSON.stringify(IS_ROOT))
// console.log('.'+JSON.stringify(USER_NAME)+'.', process.getuid(), USER_NAME.toString() == 'root', IS_ROOT)
// const USER = '\\'+'u'//colors.bgBlueBright.white(' \\u ') + colors.bgBlackBright.blueBright('')
const USER = UUNAME//colors.bgBlueBright.white(' \\u ') + colors.bgBlackBright.blueBright('')
// const USER = ''

colors.enabled = true
colors.level = 3

const VARS = {
    string: '',
    machine: `${MACHINE}`,
    userName: ` ${USER} ` //) + colors.bgBlackBright.blueBright('')
}

let SETTINGS = require('./default-settings.js', 'utf8')({
    IS_TTY,
    IS_ROOT,
    IP,
    colors,
})

if (USE_CUSTOM_SETTINGS) {
    try {
        let custom = require('./custom-user-settings.js')
        if (typeof custom == 'function') {
            custom = custom({
                IS_TTY,
                IS_ROOT,
                IP,
                colors
            })
        }
        SETTINGS = Object.assign({}, SETTINGS, custom)
        SETTINGS.parts = custom.parts || SETTINGS.parts // we force use the customized list of parts
    } catch (e) {
        if (e.message.indexOf('Cannot find module') < 0) {
            console.log(colors.red('[x] ') + 'Failed importing settings.\n' + e.message)
        }
    }
}


// // dealing with the parts of PS1
function colorNameParser (applier, color, prefix) {
    if (color.startsWith('#')) {
        return applier.hex(color)
    } else {
        if (prefix) {
            color = prefix + color[0].toUpperCase() + color.substr(1)
        }
        if (applier[color]) {
            return applier[color]
        }
        return arg => arg
    }
}

function fixTerminalColors (str) {
    return unescape(escape(str).replace(/\%1B/i, '%1B'))
}

function applyEffects (part) {
    let fx = SETTINGS.ps1.effects[part.name]
    let applier = colors

    if (fx) {
        if (fx.bgColor) {
            applier = colorNameParser(applier, fx.bgColor, 'bg')
        }
        if (fx.color) {
            applier = colorNameParser(applier, fx.color)
        }
        if (fx.bold) {
            applier = applier.bold
        }
        if (fx.italic) {
            applier = applier.italic
        }
        if (fx.underline) {
            applier = applier.underline
        }
        return applier
    }
    return arg => arg
}

const PS1Parts = []
SETTINGS.ps1.parts.forEach((part, i) => {
    let tmp = ''
    if (!part.enabled) {
        return
    }
    if (part.name === 'string') {
        tmp += applyEffects(part)(part.content)
    } else {
        if (VARS[part.name]) {
            // console.log(applyEffects(part)(VARS[part.name]))
            tmp += applyEffects(part)(VARS[part.name])
        }
    }
    PS1Parts.push(fixTerminalColors(tmp))
})
// console.log(colors.enabled, colors.level, colors.red(123).replace(/001B/g, '\\u001B'))
// console.log(colors.enabled, colors.level, escape(colors.red(123)))
process.stdout.write(PS1Parts.join(''))
// console.log('\u001B[94m XXX')
// console.log(PS1Parts.join(''))
