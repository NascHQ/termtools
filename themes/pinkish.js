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
    const gitBranchFX = parseGitEffects(data)

    return {
        // the name of the theme, used just for identification
        name: 'pinkish',
        // extending the pinkish theme
        extends: 'pinkish',
        // customize or add some aliases for your terminal
        // note that the values here, are BASH COMMANDS
        // For example:
        // { commit: "git commit -a" }
        aliases: {
            foo: "echo baz?",
            baz: "echo bar ^^",
            bar: "echo foo?!",
        },
        // these are the default decorators.
        // Plus some extra ones commented bellow, in case you might want to
        // use one of those we like the most :)
        //
        // You can use these symbols, for the font we installed:
        // \ue0b0 : arrow 
        // \ue0b1 : arrow thin
        // \ue0b2 : arrow left
        // \ue0b3 : arrow left thin
        // \ue0b4 : round
        // \ue0b5 : round thin
        // \ue0b6 : round left
        // \ue0b7 : round left thin
        // \ue0b8 : Angle bottom 
        // \ue0b9 : Angle bottom thin
        // \ue0ba : arrow bottom left
        // \ue0bb : arrow bottom left thin
        // \ue0bc : Angle top
        // \ue0bd : Angle top thin
        // \ue0be : Angle top left
        // \ue0bf : Angle top left thin

        // \ue0c0 : fire 
        // \ue0c1 : fire thin
        // \ue0c2 : fire left
        // \ue0c3 : fire left thin
        // \ue0c4 : small pixels
        // \ue0c5 : small pixels left
        // \ue0c6 : pixels
        // \ue0c7 : pixels left
        // \ue0c8 : dirt
        // \ue0c9 : empty
        // \ue0ca : dirt left
        // \ue0cb : empty
        // \ue0cc : blocks filled
        // \ue0cd : blocks empty
        // \ue0ce : lego horizontal
        // \ue0cf : leto vertical

        // \ue0d0 : lego front
        // \ue0d1 : lego left
        // \ue0d2 : bracket
        // \ue0d3 : empty
        // \ue0d4 : bracket left
        decorators: {
            pathSeparator: ' \ue0b1 ',
            section: '\ue0c6 ',
            readOnly: ' 🔐', // Other options: R+ 🔒 🔐 👁 \ue0a2
            git: ' ⎇ ' // Other options: ⑂ ᛘ ⎇ 
        },

        ps1: {
            // defines the parts of your PS1
            parts: {
                // by default, we will show the battery only if the
                // current % is less than MIN_BATTERY(18%)
                battery: {
                    enabled: /* !data.IS_CHARGING && */ data.BATTERY < MIN_BATTERY,
                    wrapper: ' $1% ' // adds spaces and the % symbol
                },
                time: { enabled: false, wrapper: '⏰ $1' },
                userName: { enabled: true, wrapper: ' $1 ' },
                // this is a general string...you enable and change its content
                // if you wish to simply show some text (it will also look for an
                // effet from the effects section)
                // string: { enabled: false, content: 'OMG :o ' },

                // we will only show the machine if running in a TTY environment
                // let's also add a cool icon to it :)
                machine: { enabled: data.IS_TTY, wrapper: ' 🖥 $1 ' },
                // play around these options to see what best fits your needs
                path: { enabled: true, ellipsis: 5, cut: 'left', maxLength: 40, wrapper: '$1 ' },
                basename: { enabled: true },
                // git is enabled only if currently in a git repository
                git: { enabled: data.GIT_BRANCH },
                // this is the string we will show in the end
                entry: { enabled: true, content: data.IS_ROOT ? ' # ' :  ' $ ' },
                // the "readOnly" flag is only enabled if the current user has
                // no write access in the current path
                readOnly: { enabled: !data.IS_WRITABLE, wrapper: '$1 ' }
            },
            effects: {
                // play around these settings to set colors or text effects
                // to the parts you enabled above
                userName: { color: 'white', bgColor: data.IS_ROOT ? 'redBright' : '#f0d', bold: data.IS_ROOT, italic: false, underline: false , dim: false},
                machine: { color: 'white', bgColor: '#000', bold: false, italic: false, underline: false, dim: false},
                time: { color: '#fff', bgColor: '#909', bold: false, italic: false, underline: false, dim: false},
                path: { color: '#fff', bgColor: '#909', bold: false, italic: false, underline: false, dim: !data.IS_ROOT },
                basename: { color: 'black', bgColor: 'white', bold: false, italic: false, underline: false, dim: false},
                entry: { color: 'white', bgColor: data.IS_ROOT ? 'redBright' : '#f0d', bold: false, italic: false, underline: false, dim: false},
                readOnly: { color: 'black', bgColor: 'yellow', bold: false, italic: false, underline: false, dim: false},
                git: gitBranchFX,
                // if the battery is low, we mark it in red...unless it is charging
                battery: {
                    color: data.IS_CHARGING && data.BATTERY >= MIN_BATTERY? 'gray': 'white',
                    bgColor: data.BATTERY < MIN_BATTERY ? 'red' : data.IS_CHARGING ? 'white' : false,
                    bold: false, italic: false, underline: false, dim: false
                }
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
function parseGitEffects (data) {
    // default effects
    const gitBranchFX = { color: 'white', bgColor: 'gray', bold: false }

    // if there is no branch, it means it is not a git repository
    // and we can simply ignore it, returning the default effects
    if (data.GIT_BRANCH !== '') {
        switch (data.GIT_STATUS) {
            case -2: {
                // COMMITS DIVERGED
                gitBranchFX.bgColor = '#000'
                gitBranchFX.color = 'red'
                break
            }
            case -1: {
                // COMMITS BEHIND
                gitBranchFX.bgColor = '#d09'
                gitBranchFX.color = 'white'
                break
            }
            case 0: {
                // NO CHANGES COLOR
                gitBranchFX.bgColor = '#999'
                gitBranchFX.color = '#000'
                break
            }
            case 1: {
                // COMMITS AHEAD
                gitBranchFX.bgColor = '#0b0'
                gitBranchFX.color = 'white'
                break
            }
            case 2: {
                // UNTRACKED CHANGES COLOR
                gitBranchFX.bgColor = '#f90'
                gitBranchFX.color = '#000'
                break
            }
            case 3: {
                // CHANGES TO BE COMMITTED
                gitBranchFX.bgColor = '#aa5'
                gitBranchFX.color = '#000'
                break
            }
            case 4: {
                // LOCAL AND UNTRACKED CHANGES COLOR
                gitBranchFX.bgColor = 'red'
                gitBranchFX.color = 'white'
                break
            }
            case 5: {
                // LOCAL CHANGES COLOR
                gitBranchFX.bgColor = 'yellow'
                gitBranchFX.color = 'black'
                break
            }
        }
        if (data.GIT_BRANCH === 'master') {
            gitBranchFX.bold = true
        }
    }
    // returns the customized object, or the default one
    return gitBranchFX
}
