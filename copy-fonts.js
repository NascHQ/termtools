#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

module.exports = function (fontsPath) {
    if (fontsPath) {
        fs.copyFileSync(
            path.resolve(__dirname, 'fonts', 'Special-DroidSans-Powerline-NF-Mono.otf'),
            path.resolve(fontsPath, 'Droid_Sans_Mono_for_Powerline_Plus_Nerd_File_Types_Mono.otf')
        )
    } else {
        console.error('You need to pass in, the path for the fonts')
    }
}
