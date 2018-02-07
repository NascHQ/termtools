#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const colors = require('./colors')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function createCustomFile (homeFilePath, theme) {
    const themePath = path.resolve(__dirname, `themes/${theme}.js`)
    if (!fs.existsSync(themePath)) {
        console.error(colors.red('[x] '), 'Sorry, this theme is not installed!\n')
        return
    }
    try {
        fs.copyFileSync(
            themePath,
            homeFilePath,
        )
        console.log(
            'Created file at ' + colors.bold.underline(homeFilePath) +
            '\nFeel free to apply changes to that file.',
            '\nFollow the comments in it, or refer to our documentation.'
        )
    } catch (error) {
        console.error(colors.red('[x] '), 'Could not create your custom file!\n', error)
    }
}

module.exports = function (homePath, theme = 'default') {
    const homeFilePath = path.resolve(homePath, '.bash_profile.js')
    let fileExists = false
    try {
        fs.accessSync(homeFilePath)
        fileExists = true
    } catch (error) {}
    if (fileExists) {
        rl.question('You already have a custom file in your home directory.\n' +
            `Are your sure you want to ${colors.bold('overwrite')} it?\n`+
            'You WILL LOOSE any customization you had in your ~/.bash_profile.js and this can\'t be undone!\n' +
            `\n    yes or no ? `, (answer) => {
            console.log('')
            if (answer.toLowerCase().startsWith('y')) {
                createCustomFile(homeFilePath, theme)
            }
            rl.close()
        });
    } else {
        createCustomFile(homeFilePath, theme)
        rl.close()
    }
}