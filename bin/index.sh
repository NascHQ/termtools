#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

case $1 in 
    "apply") 
        # node "$DIR/install.js"
        nasc-termtools install
        exec ${SHELL} -l
    ;;
    "reload")
        exec ${SHELL} -l
    ;;
    "--help" | "help" | "-h" | "?")
        nasc-termtools help --color=aways | less -R
    ;;
    "remove" | "restore")
        nasc-termtools remove
        exec ${SHELL} -l
    ;;
    "customize")
        nasc-termtools customize $HOME
    ;;
    *)
        nasc-termtools $@
    ;;
esac
