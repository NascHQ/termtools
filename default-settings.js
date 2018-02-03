module.exports = function (data) {
    return {
        aliases: {
            foo: "echo baz",
            baz: "echo bar",
        },
        ps1: {
            decorators: {},
            parts: [
                { name: 'userName', enabled: true },
                // { name: 'string', enabled: true, content: 'OMG!!' },
                { name: 'machine', enabled: true }, //data.IS_TTY },
                // { name: 'string', enabled: true, content: 'YEAH!!' },
            ],
            effects: {
                userName: { color: 'white', bgColor: data.IS_ROOT ? 'redBright' : 'blueBright', bold: false, italic: false, underline: false },
                machine: { color: 'white', bgColor: 'blackBright', bold: false, italic: false, underline: false},
            }
        }
    }
}
