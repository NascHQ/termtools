module.exports = function (data) {
    const minBat = 16
    return {
        aliases: {
            foo: "echo baz",
            baz: "echo bar",
            bar: "echo foo",
        },
        decorators: {
            pathSeparator: '  ',
            section: ''
        },
        ps1: {
            parts: {
                // battery: { enabled: !data.IS_CHARGING && data.BATTERY < minBat },
                // time: { enabled: true },
                // userName: { enabled: true },
                // string: { enabled: false, content: 'OMG :o ' },
                // // shows the computer name, only if connected into a different TTY
                // machine: { enabled: data.IS_TTY },
                // path: { enabled: true, enabled: true, ellipsis: 5, cut: 'left', maxLength: 40 },
                // basename: { enabled: true },
                // entry: { enabled: true, enabled: true, content: data.IS_ROOT ? ' # ' :  ' $ ' },
            },
            effects: {
                // userName: { color: 'white', bgColor: data.IS_ROOT ? 'redBright' : '#00f', bold: data.IS_ROOT, italic: false, underline: false , dim: false},
                // machine: { color: 'white', bgColor: '#559', bold: false, italic: false, underline: false, dim: false},
                // time: { color: false, bgColor: false, bold: false, italic: false, underline: false, dim: true},
                // path: { color: 'white', bgColor: false, bold: false, italic: false, underline: false, dim: true },
                // basename: { color: 'white', bgColor: false, bold: false, italic: false, underline: false, dim: false},
                // battery: { color: data.IS_CHARGING ? 'gray': 'white', bgColor: data.BATTERY < minBat ? 'red' : data.IS_CHARGING ? 'greenBright' : false, bold: false, italic: false, underline: false, dim: false},
            }
        }
    }
}
