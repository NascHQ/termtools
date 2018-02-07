#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

case $1 in 
    "apply") 
        # node "$DIR/install.js"
        nasc-termtools install
        exec ${SHELL} -l
    ;;
    "version" | "-v" | "v")
        nasc-termtools version
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
    "post-install")
        . ./post-install.sh
    ;;
    "customize")
        nasc-termtools customize $HOME
    ;;
    *)
        nasc-termtools $@
    ;;
esac
