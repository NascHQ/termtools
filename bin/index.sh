#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

case $1 in 
    "apply") 
        nasc-termtools install
        export TERMTOOLS_ENABLED=1
        exec ${SHELL} -l
    ;;
    "version" | "--version" | "-v" | "v")
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
        export TERMTOOLS_ENABLED=0
        export PROMPT_COMMAND=""
        exec ${SHELL} -l
    ;;
    "post-install")
        . ./post-install.sh
    ;;
    "customize")
        nasc-termtools customize $HOME
    ;;
    "set")
        nasc-termtools set $HOME $2 $3
        exec ${SHELL} -l
    ;;
    "add")
        nasc-termtools add $@ $HOME
    ;;
    *)
        nasc-termtools $@
    ;;
esac
