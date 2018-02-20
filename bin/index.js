#!/usr/bin/env node
const fs = require('fs')
const colors = require('../colors.js')

// apply // applies the new bash_profile
// reload // applies the default
// remove // comments the source line in bash_profile
// restore // alias for remove
// help // shows the contents from readme
// customize // create a custom file for you to edit (based on the current default)
const param = process.argv[2]
const args = Array.from(process.argv).slice(3)

switch (param) {
    case "install" : {
        require('../install')
        break
    }
    case "remove" : {
        require('../remove')
        break
    }
    case "version" : {
        const pkg = require('../package.json')
        console.log(pkg.version)
        break
    }
    case "check":
    case "test" : {
        require('../test-fonts.js')
        break
    }
    case "customize" : {
        require('../customize.js')(args[0])
        break
    }
    case "copy-fonts" : {
        require('../copy-fonts.js')(args[0])
        break
    }
    case "set" : {
        if (args[1] === 'theme') {
            require('../customize.js')(args[0], args[2])
        }
        break
    }
    case "help" :
    default: {
        let helpContent = `TermTools
Easy to customize, built on top of the power of JavaScript and Bash, it ads a bunch of aliases, functions, features and extra funcionality for your bash profile.
The perfect tool to optimize the JavaScript developer command line.

Usage:
  termtools [apply|restore|remove|reload|help|check|set theme|customize]

Options:
  
  help           Shows the help contenbt
  apply          Applies the termtools PS1 effects
  reload         Reloads the bash profile
  restore        Disables the effects, restoring your PS1 to what is was before
  customize      Will copy the default theme into your _home_ directory for you
                 to customize it.
                 ${colors.bold("BE CAREFUL:")} It will overwrite your
                 "~/.bash_profile.js" if it already exists and you may loose
                 any customization you had applied to it
  set theme      Replaces the current theme with an existing one.
                 Use [tab] to see the list of installed themes.
                 ${colors.bold("BE CAREFUL:")} It will overwrite your
                 "~/.bash_profile.js" if it already exists and you may loose
                 any customization you had applied to it
  check          Shows a test block for you to verify if the font was
                 correctly installed.

    `
        console.log(helpContent)
    }
}
