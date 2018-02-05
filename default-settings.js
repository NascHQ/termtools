module.exports = function (data) {
    const minBat = 18
    return {
        aliases: {
            foo: "echo baz",
            baz: "echo bar",
        },
        decorators: {
            pathSeparator: '  ',
            section: ''
        },
        ps1: {
            parts: {
                battery: { enabled: /* !data.IS_CHARGING && */ data.BATTERY < minBat },
                time: { enabled: false },
                userName: { enabled: true },
                string: { enabled: false, content: 'OMG :o ' },
                machine: { enabled: true},//data.IS_TTY },
                path: { enabled: true, enabled: true, ellipsis: 5, cut: 'left', maxLength: 40 },
                basename: { enabled: true },
                entry: { enabled: true, enabled: true, content: data.IS_ROOT ? ' # ' :  ' $ ' },
            },
            effects: {
                userName: { color: 'white', bgColor: data.IS_ROOT ? 'redBright' : '#00f', bold: data.IS_ROOT, italic: false, underline: false , dim: false},
                machine: { color: 'black', bgColor: 'white', bold: false, italic: false, underline: false, dim: false},
                time: { color: false, bgColor: false, bold: false, italic: false, underline: false, dim: true},
                path: { color: 'white', bgColor: 'gray', bold: false, italic: false, underline: false, dim: !data.IS_ROOT },
                basename: { color: 'black', bgColor: 'white', bold: false, italic: false, underline: false, dim: false},
                entry: { color: 'white', bgColor: data.IS_ROOT ? 'redBright' : '#00f', bold: false, italic: false, underline: false, dim: false},
                battery: {
                    color: data.IS_CHARGING && data.BATTERY >= minBat? 'gray': 'white',
                    bgColor: data.BATTERY < minBat ? 'red' : data.IS_CHARGING ? 'greenBright' : false,
                    bold: false, italic: false, underline: false, dim: false},
            }
        }
    }
}
