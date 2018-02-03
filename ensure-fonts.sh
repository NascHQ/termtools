if [ -f "$HOME/.has_bash_fonts_installed" ]; then :
else
    # configuring fonts
    git clone https://github.com/powerline/fonts.git --depth=1
    cd fonts
    ./install.sh
    cd ..
    rm -rf fonts

    if test "$(uname)" = "Darwin" ; then
        # MacOS
        font_dir="$HOME/Library/Fonts"
    else
        # Linux
        font_dir="$HOME/.local/share/fonts"
        mkdir -p $font_dir
    fi

    # Reset font cache on Linux
    if which fc-cache >/dev/null 2>&1 ; then
        echo "Resetting font cache, this may take a moment..."
        fc-cache -f "$font_dir"
    fi

    echo " - Installed fonts for terminal"
    
    echo 1 > "$HOME/.has_bash_fonts_installed"
fi

# xterm*font: Microsoft\ Sans\ Serif.ttf 2-12
