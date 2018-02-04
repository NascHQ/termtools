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
const TIME = process.argv[process.argv.length - 3]
const UUNAME = process.argv[process.argv.length - 2]
const BATTERY = process.argv[process.argv.length - 4]
const IS_CHARGING = parseInt(process.argv[process.argv.length - 5], 10)
const USE_CUSTOM_SETTINGS = parseInt(process.argv[process.argv.length - 1] === 1, 10)
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
const MACHINE = ` 🖥 ${HOST_NAME} `

const BASENAME = path.sep + path.basename(process.cwd()).toString()
const PATH = path.dirname(process.cwd()).split(path.sep)

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
    IS_CHARGING,
    colors,
})

function getPath (opts) {
    // PATH.join(path.sep) + path.sep
    let str = ''
    let thePATH = Array.from(PATH)

    if (opts.cutMiddle && thePATH.length > 2) {
        let first = thePATH.shift()
        if (!first.length) {
            first+= path.sep + thePATH.shift()
        }
        thePATH = [
            first,
            '…',
            thePATH.pop(),
        ]
    }

    if (opts.ellipsis) {
        let ellipsisSize = opts.ellipsis === true
            ? 3
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

    thePath = thePATH.join(path.sep)
    return thePath === '/' ? '' : thePath
}

const VARS = {
    string: '',
    time: ` ${TIME} `,
    machine: `${MACHINE}`,
    basename: ` ${BASENAME}`,
    path: getPath,
    entry: '',
    battery: ` ${IS_CHARGING ? '⚡' : '◒'}${BATTERY}% `,
    userName: ` ${USER} ` //) + colors.bgBlackBright.blueBright('◣▶')
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

// dealing with the parts of PS1
function colorNameParser (applier, color, prefix) {
    if (color.startsWith('#')) {
        // console.log(applier.bgHex(color)(color))
        if (prefix) {
            return applier[prefix + 'Hex'](color)
        } else {
            return applier.hex(color)
        }
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

function applyEffects (part, str) {
    let fx = SETTINGS.ps1.effects[part.name]
    let applier = colors

    if (fx) {
        if (fx.bgColor) {
            // applier = colorNameParser(applier, fx.bgColor, 'bg')
            str = colorNameParser(applier, fx.bgColor, 'bg')(str)
        }
        if (fx.color) {
            // applier = colorNameParser(applier, fx.color)
            str = colorNameParser(applier, fx.color)(str)
        }
        if (fx.bold) {
            // applier = applier.bold
            str = colors.bold(str)
        }
        if (fx.italic) {
            // applier = applier.italic
            str = colors.italic(str)
        }
        if (fx.dim) {
            // applier = applier.italic
            str = colors.dim(str)
        }
        if (fx.underline) {
            // applier = applier.underline
            str = colors.underline(str)
        }
        return str
    }
    return str
}

const PS1Parts = []
SETTINGS.ps1.parts.forEach((part, i) => {
    let tmp = ''
    if (!part.enabled) {
        return
    }
    if (part.name === 'string' || part.name === 'entry') {
        tmp += applyEffects(part, part.content)// + colors.reset()
    } else {
        if (VARS[part.name]) {
            // console.log(applyEffects(part)(VARS[part.name]))
            let value = VARS[part.name]
            if (typeof value === 'function') {
                value = value(part)
            }
            tmp += applyEffects(part, value)// + colors.reset()
        }
    }
    // PS1Parts.push(fixTerminalColors(tmp))
    //   console.log(tmp.replace(/\[/g, '\\\\\['))
    // PS1Parts.push(tmp.replace(/\[/g, '\\\['))
    // PS1Parts.push('\\[' +tmp+ '\\]')
    PS1Parts.push(tmp)
})
// console.log(colors.enabled, colors.level, colors.red(123).replace(/001B/g, '\\u001B'))
// console.log(colors.enabled, colors.level, escape(colors.red(123)))
process.stdout.write(PS1Parts.join('') + colors.reset())
// console.log('\u001B[94m XXX')
// console.log(PS1Parts.join(''))
