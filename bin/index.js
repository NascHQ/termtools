#!/usr/bin/env node
const fs = require('fs')

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
        let helpContent = `# TermTools
Nasc terminal tools based in JavaScript.

### Usage:
    termtools [apply|restore|remove|reload|help|customize]

    `
        helpContent += fs.readFileSync('./README.md', 'utf8').toString()
        console.log(helpContent)
    }
}
