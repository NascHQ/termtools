/**
 * Builds the PS1 parts
 * 
 * This is the function that will return our custom configuration.
 * You will receive in data, an object with:
 * - IS_TTY
 * - IS_ROOT
 * - IP
 * - BATTERY
 * - IS_CHARGING
 * - GIT_STATUS
 * - GIT_SYMBOL
 * - GIT_BRANCH
 * - IS_WRITABLE
 * - colors
 * 
 * Read our documentation to know more about GIT_STATUS and GIT_SYMBOL.
 * Also, colors is an instance of chalk.
 * For more info about chalk, read https://www.npmjs.com/package/chalk
 * 
 * @param {Object} data
 */
module.exports = function (data) {

    // we will only show the battery status if it is <18%
    const MIN_BATTERY = 18
    // let's get the effects for the current git status
    // see the parseGitEffects function in the end of this file and
    // customize it as well
    const gitBranchFX = getGitEffects(data)

    return {
        // the name of the theme, used just for identification
        name: 'basic',
        // extending the default theme
        extends: 'basic',
        // customize or add some aliases for your terminal
        // note that the values here, are BASH COMMANDS
        // For example:
        // { commit: "git commit -a" }
        aliases: {},
        // Access the readme file to see some very promissing options for your
        // separators, from the font we already installed
        decorators: {
            pathSeparator: '/',
            section: ':',
            readOnly: '🔐', // Other options: R+ 🔒 🔐 👁 \ue0a2
            git: '' // Other options: ⑂ ᛘ ⎇ 
        },
        ps1: {
            // defines the parts of your PS1
            parts: {
                // by default, we will show the battery only if the
                // current % is less than MIN_BATTERY(18%)
                battery: { enabled: /* !data.IS_CHARGING && */ data.BATTERY < MIN_BATTERY },
                time: { enabled: false },
                userName: { enabled: true, wrapper: '$1::' },
                // this is a general string...you enable and change its content
                // if you wish to simply show some text (it will also look for an
                // effet from the effects section)
                // string: { enabled: false, content: 'OMG :o ' },

                // we will only show the machine if running in a TTY environment
                // let's also add a cool icon to it :)
                machine: { enabled: data.IS_TTY },
                path: { enabled: true, ellipsis: 5, cut: 'left', maxLength: 40, wrapper: '$1/' },
                basename: { enabled: true },
                // git is enabled only if currently in a git repository
                git: { enabled: data.GIT_BRANCH, wrapper: ' ($1)' },
                // the "readOnly" flag is only enabled if the current user has
                // no write access in the current path
                readOnly: { enabled: !data.IS_WRITABLE },
                // this is the string we will show in the end
                entry: { enabled: true, content: data.IS_ROOT ? ' # ' :  ' $ ' },
            },
            effects: {
                // for the basic theme, we will only apply effects to these
                userName: { color: data.IS_ROOT ? 'redBright' : 'blueBright', bgColor: false, bold: data.IS_ROOT},
                path: { color: 'dim', bgColor: false, bold: false, italic: false, underline: false, dim: !data.IS_ROOT },
                git: gitBranchFX
            }
        }
    }
}

/**
 * Specifies styles for the current git state
 * 
 * This function will decide which styles should be used, according
 * to the current branch and status
 * @param {Object} data 
 */
function getGitEffects (data) {
    const gitBranchFX = { color: 'white', bgColor: 'gray', bold: false }

    if (data.GIT_BRANCH !== '') {
        switch (data.GIT_STATUS) {
            case 0: {
                // NO_CHANGES_COLOR
                gitBranchFX.color = 'gray'
                break
            }
            case 1: {
                // COMMITS_AHEAD
                gitBranchFX.color = '#0b0'
                break
            }
            case -2: {
                // COMMITS_DIVERGED
                gitBranchFX.color = '#f00'
                break
            }
            case -1: {
                // COMMITS_BEHIND
                gitBranchFX.color = '#d09'
                break
            }
            case 2: {
                // UNTRACKED_CHANGES_COLOR
                gitBranchFX.color = '#f90'
                break
            }
            case 3: {
                // CHANGES_TO_BE_COMMITTED
                gitBranchFX.color = '#aa5'
                break
            }
            case 4: {
                // LOCAL_AND_UNTRACKED_CHANGES_COLOR
                gitBranchFX.color = 'red'
                break
            }
            case 5: {
                // LOCAL_CHANGES_COLOR
                gitBranchFX.color = 'yellow'
                break
            }
        }
        if (data.GIT_BRANCH === 'master') {
            gitBranchFX.bold = true
        }
        gitBranchFX.bgColor = false
    }
    return gitBranchFX
}
