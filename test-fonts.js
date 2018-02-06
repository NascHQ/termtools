#!/usr/bin/env node
const colors = require('./colors')
const boxFX = colors.bgWhite.black
console.log(`
Can you see the two "arrow" and two "fork" characters inside this box bellow?


                            ${boxFX("                    ")}
                            ${boxFX("                    ")}
                            ${boxFX("           ⎇     ")}
                            ${boxFX("                    ")}
                            ${boxFX("                    ")}


If you can't, don't worry! I help you!"
Go to your terminal Profile Settings, select Text, and in font family/face, find the font named:"

    "${colors.bold("Droid Sans Mono for Powerline Plus Nerd File Types Mono")}"
    (you can filter it by \"Plus Nerd\" to find it more easily)"

You can re-run this test at any time by running "termtools check"
`)
