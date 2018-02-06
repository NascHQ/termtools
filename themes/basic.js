module.exports = function (data) {

    const minBat = 18
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

    return {
        aliases: {},
        decorators: {
            pathSeparator: '/',
            section: ':',
            readOnly: '🔐', // R+🔒🔐👁
            git: '' // ⑂ᛘ⎇ // \ue0c0
        },
        ps1: {
            parts: {
                battery: { enabled: /* !data.IS_CHARGING && */ data.BATTERY < minBat },
                time: { enabled: false },
                userName: { enabled: true, wrapper: '$1::' },
                // string: { enabled: false, content: 'OMG :o ' },
                machine: { enabled: data.IS_TTY },
                path: { enabled: true, ellipsis: 5, cut: 'left', maxLength: 40, wrapper: '$1/' },
                basename: { enabled: true },
                git: { enabled: data.GIT_BRANCH, wrapper: ' ($1)' },
                readOnly: { enabled: !data.IS_WRITABLE },
                entry: { enabled: true, content: data.IS_ROOT ? ' # ' :  ' $ ' },
            },
            effects: {
                userName: { color: data.IS_ROOT ? 'redBright' : 'blueBright', bgColor: false, bold: data.IS_ROOT},
                // machine: { color: 'black', bgColor: 'white', bold: false, italic: false, underline: false, dim: false},
                // time: { color: false, bgColor: false, bold: false, italic: false, underline: false, dim: true},
                path: { color: 'dim', bgColor: false, bold: false, italic: false, underline: false, dim: !data.IS_ROOT },
                // basename: { color: 'black', bgColor: 'white', bold: false, italic: false, underline: false, dim: false},
                // entry: { color: 'white', bgColor: data.IS_ROOT ? 'redBright' : '#00f', bold: false, italic: false, underline: false, dim: false},
                // readOnly: { color: 'black', bgColor: 'yellow', bold: false, italic: false, underline: false, dim: false},
                git: gitBranchFX,
                // battery: {
                //     color: data.IS_CHARGING && data.BATTERY >= minBat? 'gray': 'white',
                //     bgColor: data.BATTERY < minBat ? 'red' : data.IS_CHARGING ? 'greenBright' : false,
                //     bold: false, italic: false, underline: false, dim: false},
            }
        }
    }
}
