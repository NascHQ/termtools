#!/bin/bash

_dir="$( cd "$( dirname "$0" )" && pwd )"

if [ -f ".$HOME/.has_bash_fonts_installed" ]; then :
else
    if test "$(uname)" = "Darwin" ; then
        # MacOS
        font_dir="$HOME/Library/Fonts"
    else
        # Linux
        font_dir="$HOME/.local/share/fonts"
        mkdir -p $font_dir
    fi

    nasc-termtools copy-fonts "$font_dir"

    # Reset font cache on Linux
    if which fc-cache >/dev/null 2>&1 ; then
        echo "Resetting font cache, this may take a moment..."
        fc-cache -f "$font_dir"
    fi

    echo "Installed fonts for terminal"
    nasc-termtools check

    echo "Type \"termtools help\" for more information"
    echo "For any question, bug report or suggestion, check our repository and leave an issue or comment."
    echo ""
    
    echo 1 > "$HOME/.has_bash_fonts_installed"
fi

# xterm*font: Microsoft\ Sans\ Serif.ttf 2-12
