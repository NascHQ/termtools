const colors = require('./colors')

module.exports = function writeInBox (content, color = '#384250', bgColor = '#f0f0f0') {

    const boxFX = colors.bgHex(bgColor).black
    const boxShadowFX = colors.bgHex(color)

    let lineLength = 0
    content = content.split('\n')
    // first, get the size of the box
    const rx = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g
    content.forEach(line => {
        if (line.replace(rx, '').length > lineLength) {
            lineLength = line.length
        }
    })
    lineLength = lineLength + 2

    content.unshift(''.padEnd(lineLength))
    content.push(''.padEnd(lineLength))
    
    content = content.map((line, i) => {
        let raw = line.replace(rx, '')
        let diff = line.length - raw.length
        return boxShadowFX(boxFX(' ' + line.padEnd(lineLength + diff)) + ((i === 0) ? '' : ' '))
    })
    content.push(' ' + boxShadowFX(''.padEnd(lineLength + 1)))
    return content
}