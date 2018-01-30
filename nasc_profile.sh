# current_dir="$( cd "$( dirname "$0" )" && pwd )"

echo "Applying Nasc Profile aliases and features"
IM=`whoami`
IP=`ipconfig getifaddr en0`
DT=`date "+%d/%m/%Y %H:%M:%S"`
echo "    User: $IM
    At: $HOSTNAME
    Path: $PWD
    IP: $IP
    Date/Time: $DT"
echo "    For help, type \"aliases\""

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
    DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
    SOURCE="$(readlink "$SOURCE")"
    [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

# install git completition
if [ -f ~/.git-completion.bash ]; then :
else
    curl https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash -o ~/.git-completion.bash;
    . ~/.git-completion.bash
fi

# apply the aliases
source $DIR/aliases.sh
# apply the rest of the source
source $DIR/profiler.sh

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
    
    echo 1 > "$HOME/.has_bash_fonts_installed"
fi
