module.exports = function (data) {
    const minBat = 16
    return {
        aliases: {
            foo: "echo baz",
            baz: "echo bar",
        },
        ps1: {
            decorators: {},
            parts: [
                { name: 'battery', enabled: !data.IS_CHARGING && data.BATTERY < minBat },
                { name: 'time', enabled: true },
                { name: 'userName', enabled: true },
                // { name: 'string', enabled: true, content: 'OMG!!' },
                { name: 'machine', enabled: true }, //data.IS_TTY },
                { name: 'path', enabled: true, ellipsis: true, cutMiddle: false }, //data.IS_TTY },
                { name: 'basename', enabled: true }, //data.IS_TTY },
                { name: 'entry', enabled: true, content: data.IS_ROOT ? ' # ' :  ' $ ' },
            ],
            effects: {
                userName: { color: 'white', bgColor: data.IS_ROOT ? 'redBright' : 'blue', bold: data.IS_ROOT, italic: false, underline: false , dim: false},
                machine: { color: 'white', bgColor: 'blackBright', bold: false, italic: false, underline: false, dim: false},
                time: { color: false, bgColor: false, bold: false, italic: false, underline: false, dim: true},
                path: { color: 'white', bgColor: false, bold: false, italic: false, underline: false, dim: true },
                basename: { color: 'white', bgColor: false, bold: true, italic: false, underline: false, dim: false},
                battery: { color: data.IS_CHARGING ? 'gray': 'white', bgColor: data.BATTERY < minBat ? 'red' : data.IS_CHARGING ? 'greenBright' : false, bold: false, italic: false, underline: false, dim: false},
            }
        }
    }
}
