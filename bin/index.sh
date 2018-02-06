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
    # "restore")
    #     nasc-termtools remove
    #     PS1=$( cat $DIR/_previous-ps1.bkp )
    #     exec ${SHELL} -l
    # ;;
    "--help" | "help")
        nasc-termtools help --color=aways | less -R
    ;;
    "remove")
        nasc-termtools remove
        exec ${SHELL} -l
    ;;
    *)
        nasc-termtools $@
    ;;
esac
