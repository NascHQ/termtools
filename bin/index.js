#!/usr/bin/env node
const fs = require('fs')

// apply // applies the new bash_profile
// reload // applies the default
// remove // comments the source line in bash_profile
// restore // alias for remove
// help // shows the contents from readme
// customize // create a custom file for you to edit (based on the current default)
const param = process.argv[2]
const detail = process.argv[3]

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
        require('../customize.js')(detail)
        break
    }
    case "copy-fonts" : {
        require('../copy-fonts.js')(detail)
        break
    }
    case "help" : {
        let helpContent = `# TermTools
Nasc terminal tools based in JavaScript.

### Usage:
    termtools [apply|restore|remove|reload|help|customize]

    `
        helpContent += fs.readFileSync('./README.md', 'utf8').toString()
        console.log(helpContent)
    }
    default: {

    }
}
