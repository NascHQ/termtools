#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const colors = require('./colors')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function createCustomFile (homeFilePath) {
    fs.copyFileSync(
        path.resolve(__dirname, 'default-settings.js'),
        homeFilePath,
    )
    console.log(
        'Created file at ' + colors.bold(homeFilePath) +
        '\nFeel free to apply changes to that file.',
        '\nFollow the comments in it, or refer to our documentation.'
    )
}

module.exports = function (homePath) {
    const homeFilePath = path.resolve(homePath, '.bash_profile.js')
    let fileExists = false
    try {
        fs.accessSync(homeFilePath)
        fileExists = true
    } catch (error) {}
    if (fileExists) {
        rl.question('You already have a custom file in your home directory.\n' +
            `Are your sure you want to ${colors.bold('overwrite')} it? (y/N)`, (answer) => {
            if (answer.toLowerCase().startsWith('y')) {
                createCustomFile(homeFilePath)
            }
            rl.close();
        });
    } else {
        createCustomFile(homeFilePath)
    }
}