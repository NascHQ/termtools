#!/usr/bin/env node

let colors = require('chalk')
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
const DEFAULT_ELLIPSIS_SIZE = 4
const DEFAULT_MAX_PATH_LENGTH = 40
// const batteryLevel = require('battery-level');

// batteryLevel().then(level => {
// 	console.log(level);
// 	//=> 0.55
// });


// const MACHINE = colors.bgBlackBright.white(' 🖥 \\h ')

// const IM = process.argv[ARG_POSITION + 7]
// const IS_ROOT = userInfo.username === 'root' || process.getuid && process.getuid() === 0
// console.log(userInfo)
const SESSION_TYPE = process.argv[ARG_POSITION + 7]
const ARGVLength = process.argv.length
const TIME = process.argv[ARGVLength - 3]
const UUNAME = process.argv[ARGVLength - 2]
const BATTERY = parseInt(process.argv[ARGVLength - 4], 10)
const IS_CHARGING = parseInt(process.argv[ARGVLength - 5], 10)
const IS_WRITABLE = parseInt(process.argv[ARGVLength - 6], 10)
const USE_CUSTOM_SETTINGS = process.argv[ARGVLength - 1] == 1

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
const IS_ROOT = UUNAME == 'root'
// const IS_ROOT = fs.readFileSync(`${HOME}/.uis`, 'utf8')
// console.log('>>>>' + JSON.stringify(IS_ROOT) + '<<<<')
// console.log('>>>'+ IS_ROOT + ' > ' + (new Date).getTime())
// console.log("UUNAME: '"+JSON.stringify(UUNAME)+"'", UUNAME == 'root')//, JSON.stringify(UUNAME).split(''))
// let IS_ROOT = ''
// console.log('>>>>', JSON.stringify(IS_ROOT))
// console.log('.'+JSON.stringify(USER_NAME)+'.', process.getuid(), USER_NAME.toString() == 'root', IS_ROOT)
// const USER = '\\'+'u'//colors.bgBlueBright.white(' \\u ') + colors.bgBlackBright.blueBright('')
const USER = UUNAME//colors.bgBlueBright.white(' \\u ') + colors.bgBlackBright.blueBright('')
// const USER = ''

const HOST_NAME = process.argv[ARG_POSITION + 5].replace(/\.[^\.]+$/, '')
// const HOST_NAME = process.argv[process.argv.length - 3]
const HOME = process.argv[ARG_POSITION + 6]
const IP = process.argv[ARG_POSITION + 7]
const MACHINE = IS_ROOT ? [' 🖥 \\h '] : ` 🖥 ${HOST_NAME} `

let BASENAME = IS_ROOT ? '' : path.basename(process.cwd()).toString()
const PATH = IS_ROOT ? ['\\w '] : path.dirname(process.cwd().replace(HOME, ' ~')).split(path.sep)
if (!IS_ROOT && PATH.join('') === '.') {
    BASENAME = '~'
}
// console.log(HOME, process.cwd(), path.dirname(path.sep))
// colors = colors({
//     enabled: true,
//     level: 3,
//     wrapper: {
//         pre: '\\[',
//         post: '\\]',
//     }
// })
colors.enabled = true
colors.level = 3
colors.wrapper = {
    pre: '\\[',
    post: '\\]',
}

let SETTINGS = require('./default-settings.js', 'utf8')({
    IS_TTY,
    IS_ROOT,
    IP,
    BATTERY,
    IS_WRITABLE,
    IS_CHARGING,
    colors,
})

function getPath (opts) {
    let str = ''
    let thePATH = Array.from(PATH)
    let sep = SETTINGS.decorators.pathSeparator || path.sep

    if (thePATH[0] === '.' || thePATH[0] === '~') {
        thePATH[0] = ''
    }

    if (thePATH[0] === '') {
        if (thePATH[1]) {
            thePATH[1] = path.sep + thePATH[1]
            thePATH.shift()
        }
    }
    if (thePATH.join('') === '') {
        return ' '
    }

    if (opts.ellipsis && !opts.cut) {
        let ellipsisSize = opts.ellipsis === true
            ? DEFAULT_ELLIPSIS_SIZE
            : opts.ellipsis

        let last = thePATH.length - 1
        thePATH = thePATH.map((dir, i) => {
            // if last part of the path, we will not ellipse it
            if (!i || i === last) { return dir }
            if (dir.length > ellipsisSize + 1) {
                dir = dir.substr(0, ellipsisSize) + '…'
            }
            return dir
        })
    }

    thePath = thePATH.join(sep)
    thePath = thePath === sep ? '' : thePath

    let l = opts.maxLength || DEFAULT_MAX_PATH_LENGTH
    if (opts.cut && thePath.length > l - 6) {
        if (opts.cut === 'center') {
            l = l / 2 -3
            thePath = thePath.slice(0, l) + '...' + thePath.slice(-1 * l)
        }
        if (opts.cut === 'left') {
            l = l - 4
            thePath = ' …' + thePath.slice(-1 * l)
        }
        if (opts.cut === 'right') {
            l = l - 4
            thePath = thePath.slice(0, l) + '… '
        }
    }
    return thePath.length ? thePath + ' ' : ''
}

const sectionSeparator = SETTINGS.decorators.section
const VARS = {
    string: '',
    time: IS_ROOT ? ' \\t ' : ` ${TIME} `,
    machine: `${MACHINE}`,
    basename: `${BASENAME || (IS_ROOT ? '': ' / ')}`,
    path: getPath,
    entry: '',
    readOnly: IS_WRITABLE ? '' : 'R+ ', // 🔒🔐👁
    separator: sectionSeparator,
    battery: ` ${IS_CHARGING ? '⚡' : '◒'}${BATTERY}% `,
    userName: ` ${USER} ` //) + colors.bgBlackBright.blueBright('◣▶')
}

if (USE_CUSTOM_SETTINGS) {
    try {
        let custom = require('./custom-user-settings.js')
        if (typeof custom == 'function') {
            custom = custom({
                IS_TTY,
                IS_ROOT,
                IP,
                BATTERY,
                IS_CHARGING,
                IS_WRITABLE,
                colors
            })
        }

        custom.ps1 = custom.ps1 || {}
        
        SETTINGS.ps1.parts = Object.assign({}, SETTINGS.ps1.parts, custom.ps1.parts || {})
        SETTINGS.ps1.decorators = Object.assign({}, SETTINGS.ps1.decorators, custom.ps1.decorators || {})
        SETTINGS.ps1.effects = Object.assign({}, SETTINGS.ps1.effects, custom.ps1.effects || {})
        // SETTINGS = Object.assign({}, SETTINGS, custom)
        // SETTINGS.parts = custom.parts || SETTINGS.parts // we force use the customized list of parts
    } catch (e) {
        if (e.message.indexOf('Cannot find module') < 0) {
            console.log(colors.red('[x] ') + 'Failed importing settings.\n' + e.message)
        }
    }
}

// dealing with the parts of PS1
function colorNameParser (applier, color, prefix) {
    if (color.startsWith('#')) {
        if (prefix) {
            return applier[prefix + 'Hex'](color)
        } else {
            return applier.hex(color)
        }
    } else {
        if (prefix) {
            if (color === 'gray' || color === 'grey') {
                color = 'blackBright'
            }
            color = prefix + color[0].toUpperCase() + color.substr(1)
        } else if (color === 'blackBright') {
            color = 'gray'
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

const effectsMap = new Map()
function applyEffects (part, str) {
    let fx = SETTINGS.ps1.effects[part.name]
    let applier = colors

    if (fx) {
        if (fx.bgColor) {
            str = colorNameParser(applier, fx.bgColor, 'bg')(str)
        }
        if (fx.color) {
            str = colorNameParser(applier, fx.color)(str)
        }
        if (fx.bold) {
            str = colors.bold(str)
        }
        if (fx.italic) {
            str = colors.italic(str)
        }
        if (fx.dim) {
            str = colors.dim(str)
        }
        if (fx.underline) {
            str = colors.underline(str)
        }
        return str
    }
    return str
}

let PS1Parts = []
// SETTINGS.ps1.parts.forEach((part, i) => {
for (let partName in SETTINGS.ps1.parts) { // ((part, i) => {
    let tmp = ''

    if (IS_ROOT && partName == 'basename') {continue}

    let part = SETTINGS.ps1.parts[partName]
    part.name = partName
    if (!part.enabled) {
        continue
    }
    if (partName === 'string' || partName === 'entry') {
        tmp += applyEffects(part, part.content)// + colors.reset()
    } else {
        if (VARS[partName]) {
            let value = VARS[partName]
            if (typeof value === 'function') {
                value = value(part)
            }
            tmp += applyEffects(part, value)// + colors.reset()
        }
    }
    // PS1Parts.push(fixTerminalColors(tmp))
    // PS1Parts.push(tmp.replace(/\[/g, '\\\['))
    // PS1Parts.push('\\[' +tmp+ '\\]')
    effectsMap.set(tmp, {
        fx: SETTINGS.ps1.effects[part.name],
        part
    })
    PS1Parts.push(tmp)
}//)

const nonSections = new Set([/*'basename'/*, 'entry'*/])
function isSection (part) {
    return !nonSections.has(part.name)
}

PS1Parts = PS1Parts.map((part, i) => {
    let nextPart = PS1Parts[i + 1] || null
    let curFx = effectsMap.get(part)
    let nextFx = effectsMap.get(nextPart)
    let sep = sectionSeparator

    if (!nextPart && curFx && curFx.fx && curFx.fx.bgColor) {
        // this is the end of the PS1
        return part + colorNameParser(colors, curFx.fx.bgColor)(sep)
    }

    if (!nextFx || !isSection(nextFx.part)) {
        return part
    }
    // if the current section does not have any effects, we will
    // not use any separator
    if (curFx) {
        if (curFx.fx && curFx.fx.bgColor) {
            sep = colorNameParser(colors, curFx.fx.bgColor)(sep)
        } else {
            return part
        }
    } else {
        // for  separator to work, we need at least a background
        return part
    }
    if (nextFx) {
        if (nextFx.fx && nextFx.fx.bgColor) {
            sep = colorNameParser(colors, nextFx.fx.bgColor, 'bg')(sep)
        }
    }
    return part + sep
}).join('')

// console.log(colors.enabled, colors.level, colors.red(123).replace(/001B/g, '\\u001B'))
// console.log(colors.enabled, colors.level, escape(colors.red(123)))
process.stdout.write(PS1Parts + colors.reset())
// console.log('\u001B[94m XXX')
// console.log(PS1Parts.join(''))
