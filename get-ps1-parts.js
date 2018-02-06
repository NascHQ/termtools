#!/usr/bin/env node

/**
 * This script is triggered on PROMPT_COMMAND every time PS1 is about to be
 * rendered. We will output here, what will be shown in PS1
 * 
 * This is a mess!
 */

// let's import some useful dependencies
// besides chalk, used for colors, everything else is native from node
const path = require('path')
const fs = require('fs')
const execSync = require('child_process').execSync
let colors = require('./colors')
// we will have to enforce chalk to use colors
// as it is running in a second level command, it will turn them off by default
colors.enabled = true
colors.level = 3
// we will also need to parse/escape the unprintable characters
// otherwise, the PS1 will act really weird with long lines and command history
colors.wrapper = {
    pre: '\\[',
    post: '\\]',
}

// also, let's defined some constants
const DEFAULT_ELLIPSIS_SIZE = 4
const DEFAULT_MAX_PATH_LENGTH = 40

// sadly enough...the only way we could get the arguments from bash was from 
// args passed to the node process :/
const IS_DEBUGGING = process.argv[1] === 'inspect'
const ARG_POSITION = IS_DEBUGGING ? 1 : 0

// the path where node we find the node executable file
const NODE_BIN = process.argv[0]
// the profiler js file (index.js in this project)
const PROFILER_JS_PATH = process.argv[ARG_POSITION + 2]
// the profiler js file (index.sh in this project)
const PROFILER_SH_PATH = process.argv[ARG_POSITION + 3]
// we will use this to find files from within this project
const DIR_NAME = path.dirname(PROFILER_JS_PATH)

// is it running under a TTY environment?
const IS_TTY = process.argv[ARG_POSITION + 4] == '1' ? true : false
// the session type
const SESSION_TYPE = process.argv[ARG_POSITION + 7]

// let's look for some of the arguments, from the other way around
const ARGVLength = process.argv.length
// the current time itself
const TIME = process.argv[ARGVLength - 3]
// the real user name
const USER = process.argv[ARGVLength - 2]
// and if the current user is root
const IS_ROOT = USER == 'root'
//  we will also use some useful info on the current battery status
// updated every 10 seconds
const BATTERY = parseInt(process.argv[ARGVLength - 4], 10)
const IS_CHARGING = parseInt(process.argv[ARGVLength - 5], 10)

// if user is root, we will not be able to update it from line to line (unless
// we had changed the root profile as well, what would require sudo permission
// and I was not much up to do so)
const IS_WRITABLE = IS_ROOT ? 1 : parseInt(process.argv[ARGVLength - 6], 10)

/**
 * This parses the gitinfo into git branch, status and symbol
 * 
 * The status may be from -2 to 5, meaning:
 * -2: COMMITS DIVERGED
 * -1: COMMITS BEHIND
 * 0: NO CHANGES
 * 1: COMMITS AHEAD
 * 2: UNTRACKED CHANGES
 * 3: CHANGES TO BE COMMITTED
 * 4: LOCAL AND UNTRACKED CHANGES
 * 5: LOCAL CHANGES
 * 
 * Symbols can be:
 * "-": COMMITS BEHIND
 * "+": COMMITS AHEAD
 * "!": COMMITS DIVERGED
 * "*": UNTRACKED
 * "": Anything else
 */

let GIT_INFO = IS_ROOT ? [] : process.argv[ARGVLength - 7].split('@@@')
const GIT_BRANCH = GIT_INFO[0] || ''
const GIT_STATUS = parseInt(GIT_INFO[1], 10) || ''
const GIT_SYMBOL = GIT_INFO[2] || ''

// this will be 1 when there are imported user customizations
const USE_CUSTOM_SETTINGS = process.argv[ARGVLength - 1] == 1

// the machine/host name
const HOST_NAME = process.argv[ARG_POSITION + 5].replace(/\.[^\.]+$/, '')

// this is the current user's home path
const HOME = process.argv[ARG_POSITION + 6]
// in case we will show the machine ip
const IP = process.argv[ARG_POSITION + 7]

// this is the real string we will use ahead, to show the hostname
const MACHINE = `${IS_ROOT ? '\\h' : HOST_NAME}`

// we will separate the basename from the rest of the path, and show them as
// two distinct sections
// but, again, as we will not be able to update this during sudo navigation
// we will use only one section, the path, with the full address
let BASENAME = IS_ROOT ? '' : path.basename(process.cwd()).toString()
const PATH = IS_ROOT ? ['\\w '] : path.dirname(process.cwd().replace(HOME, ' ~')).split(path.sep)
// node returns `path.dirname('~')` as "." instead of "~"
if (!IS_ROOT && PATH.join('') === '.') {
    BASENAME = '~'
}

// this is the resulting context for the current state
const context = {
    IS_TTY,
    IS_ROOT,
    IP,
    BATTERY,
    GIT_STATUS,
    GIT_BRANCH,
    GIT_SYMBOL,
    IS_WRITABLE,
    IS_CHARGING,
    colors,
}

// time to start preparing the PS1 itself
let SETTINGS = {}
// if the user has custom settings...
// (we have set this flag only once, so we can avoid looking for this file
// everytime we have to update the PS1, unless the user has customizations)
if (USE_CUSTOM_SETTINGS) {
    try {
        // users may export a function, or a straight object
        // let custom = require('./custom-user-settings.js')
        let custom = require(path.resolve(HOME, '.bash_profile.js'))
        if (typeof custom == 'function') {
            custom = custom(context)
        }
        SETTINGS = custom
    } catch (e) {
        if (e.message.indexOf('Cannot find module') < 0) {
            console.log(colors.red('[x] ') + 'Failed importing settings.\n' + e.message)
        }
    }
}

// here, we will require the default settings we have and will run it (as it
// is a function) using the current state (with everything we parsed so far)
let theme = SETTINGS.extends || 'default'
try {
    theme = require(`./themes/${theme}.js`, 'utf8')(context)
} catch (e) {
    console.error('Invalid theme!\nPlease, select one of the following:')
    
    let availableThemes = execSync(`ls ${DIR_NAME}/themes/`)
        .toString()
        .split('\n')
        .map(theme => theme.replace(/\.js$/, ''))
        .filter(theme => theme.length)

    console.log('\n - ' + availableThemes.join('\n - ') + '\n')
    console.log('Loading default theme instead')
    theme = require(`./themes/default.js`, 'utf8')(context)
}

// then, we will have to merge the current default options with
// the user's customization
SETTINGS.ps1 = SETTINGS.ps1 || {}
SETTINGS.ps1.parts = Object.assign({}, theme.ps1.parts, SETTINGS.ps1.parts || {})
SETTINGS.decorators = Object.assign({}, theme.decorators, SETTINGS.decorators || {})
SETTINGS.ps1.effects = Object.assign({}, theme.ps1.effects, SETTINGS.ps1.effects || {})
const sectionSeparator = SETTINGS.decorators.section

// these are the variables available to be used as parts of the PS1 string
// we will use the parts from SETTINGS, only if they exist here
const VARS = {
    string: '',
    time: getWrapper('time', IS_ROOT ? ' \\t ' : ` ${TIME} `),
    machine: getWrapper('machine', `${MACHINE}`),
    basename: getWrapper('basename', `${BASENAME || (IS_ROOT ? '': ' / ')}`),
    path: getWrapper('path', getPath),
    entry: getWrapper('entry', ''),
    readOnly: getWrapper('readOnly', IS_WRITABLE ? '' : SETTINGS.decorators.readOnly || 'R'), // 🔒🔐👁
    separator: sectionSeparator,
    git: getWrapper('git', `${SETTINGS.decorators.git}${GIT_BRANCH}${GIT_SYMBOL}`), // ⑂ᛘ⎇
    gitStatus: GIT_STATUS,
    battery: getWrapper('battery', `${IS_CHARGING ? '⚡ ' : '◒'}${BATTERY}`),
    userName: getWrapper('userName', USER)
}

// let's start by having the PS1Parts list empty
let PS1Parts = []
// this map will help us quickly find the effects for each part of PS1
const effectsMap = new Map()

// SETTINGS is now the merge between the default settings and the user's customizations
for (let partName in SETTINGS.ps1.parts) {
    let tmp = ''

    // remember that? We will not use the basename for sudos
    if (IS_ROOT && partName == 'basename') { continue }

    // the part itself, with its options
    let part = SETTINGS.ps1.parts[partName]
    part.name = partName

    // obviously...
    if (!part.enabled) {
        continue
    }

    // in case the current part is "string" or "entry", we will output that part
    // using their respective effects, adding their contents
    if (partName === 'string' || partName === 'entry') {
        tmp += applyEffects(part, part.content)
    } else {
        // for any other kind of part, we check if they exist in our valid list
        if (VARS[partName]) {
            // and, if so,
            // that may be either a string of a function that will return a string
            let value = VARS[partName]
            if (typeof value === 'function') {
                value = value(part)
            }
            // finally, we add the effects to it
            tmp += applyEffects(part, value)
        }
    }

    // if there is something to add...
    if (tmp) {
        // we set it in our map, for later use
        effectsMap.set(tmp, {
            fx: SETTINGS.ps1.effects[part.name],
            part
        })
        PS1Parts.push(tmp)
    }
}

/**
 * Time to think about the separators!
 * 
 * The hard part here is their logic.
 * For example:
 * the separator "" need to have the TEXT COLOR of the current section BGCOLOR,
 * and the BGCOLOR of the NEXT section's BGCOLOR.
 */
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


/******************************************************************************
 * HERE IS WHERE THE MAGIC HAPPENS!
 * not like that...just prints the result for the current context and
 * PS1 will use our output
 *****************************************************************************/

process.stdout.write(PS1Parts + colors.reset())

/******************************************************************************
 * Bellow here, we can find the functions we used above
 * long live hoisting!
 *****************************************************************************/

/**
 * Gets the configured wrapper for the content
 */
function getWrapper (partName, content) {
    let part = SETTINGS.ps1.parts[partName]
    if (part) {
        if (part.wrapper) {
            return part.wrapper.replace(/\$1/, content)
        }
    }
    return content
}

// we can use nonSections to avoid section separators
function isSection (part) {
    const nonSections = new Set([/*'basename'/*, 'entry'*/])
    return !nonSections.has(part.name)
}

/**
 * Get the current path with separators.
 * 
 * This function will treat the path parts and add separators and
 * effects as specified in the current context settings.
 * 
 * @param {object} opts The options for how to decorate the path
 */
function getPath (opts = {}) {
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
    return thePath.length ? thePath + '' : ''
}


/**
 * This function parses the colors
 * 
 * It will not only parse the colors themselves, but will also parse the effect
 * name. For example, "redBright", when used with the prefix "bg", becomes "bgRedBright".
 * Noticed the camel case?
 * Also, just for fun, there is a mix with gray, grey and blackBright when used with
 * or without "bg".
 * 
 * @param {Chalk} applier An instance of chalk. May already have effects applied to it
 * @param {String} color The color itself. May be a valid color name of an RGB code in hex starting with "#"
 * @param {String} prefix Optionally, adds a prefix to the effect function. Mainly used for prefixing colors with "bg"
 */
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

/**
 * This function will run through the parts of PS1 and apply their respective effects
 * dealing also with their separators.
 */
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

// not sure will ever be used again...but once it worked on TTYs...
// if we have any issue related to that again, we may come here and use it!
// function fixTerminalColors (str) {
//     return unescape(escape(str).replace(/\%1B/i, '%1B'))
// }