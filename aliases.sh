
# if ! type "trash" > /dev/null; then
#     echo "Instaling dependency for moving files to trash."
#     npm install trash-cli -g
# fi

# if test "$(uname)" = "Darwin" ; then
function try () {
    # echo `command -v foo >/dev/null 2>&1 || echo >&2 "The command $1 is not installed $2"; exit 1`
    local apt=`command -v apt-get`
    local yum=`command -v yum`
    local brew=`command -v brew`
    local theCommandIdx=1
    local isQuiet=false
    local triggerError=false
    local output=""
    local theCommand="${!theCommandIdx}"

    while test $# -gt 0; do
        case "$1" in
                -h|--help)
                    echo "Try a command, checking it if it exists and then executing it."
                    echo " "
                    echo "try [options] command [arguments]"
                    echo " "
                    echo "options:"
                    echo "  -h, --help                show brief help"
                    echo "  -q                        if commend is not installed, stay quiet"
                    echo "  -e,                       exits with an error if the command does not exist"
                    echo ""
                    return
                    ;;
                -q)
                    ((theCommandIdx+=1))
                    theCommand="${!theCommandIdx}"
                    isQuiet=true
                    shift
                    break
                    ;;
                -e)
                    ((theCommandIdx+=1))
                    theCommand="${!theCommandIdx}"
                    triggerError=true
                    shift
                    break
                    ;;
                -eq | -qe)
                    ((theCommandIdx+=1))
                    theCommand="${!theCommandIdx}"
                    triggerError=true
                    isQuiet=true
                    shift
                    break
                    ;;
                "sudo") 
                    ((theCommandIdx+=1))
                    theCommand="${!theCommandIdx}"
                    ((theCommandIdx-=1))
                    break
                    ;;
                *)
                    break
                    ;;
        esac
    done

    if hash $theCommand 2>/dev/null; then
        # ${@:$theCommandIdx}
        $@
    else
        output="$output $theCommand is not installed\n"
        if [ -n "$apt" ]; then
            output="$output Try installing it like:\n\n"
            output="$output apt-get -y install $theCommand\n\n"
        elif [ -n "$yum" ]; then
            output="$output Try installing it like:\n\n"
            output="$output yum -y install $theCommand\n\n"
        elif [ -n "$brew" ]; then
            output="$output Try installing it like:\n\n"
            output="$output brew install $theCommand\n\n"
        fi
        if [ "$isQuiet" != true ]; then
            printf "$output"
        fi
        if [ "$triggerError" == true ]; then
            return 1
        else
            return 0
        fi
    fi
}

# some chrome versions require this for you to enter on a meeting
alias fixcamera="sudo killall VDCAssistant"
# your IP in the local network
# alias ipin="try -qe ipconfig getifaddr en0 "
alias ipin="sudo ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'"
# your IP seen from outside
alias ipout='dig +short myip.opendns.com @resolver1.opendns.com 2>/dev/null || echo "No internet connection"'
# more information about your ip
alias ip="echo -e Internal IP Address: ; ipin; echo -e Public facing IP Address: ; ipout ; echo ;"
alias ips="ip"
alias aliases='alias'
alias lh='ls -lisAdGl .[^.]*'
alias ff='find . -not -path "*/node_modules/*" -not -path "*.git/*" -type f -iname '
alias findfile='ff'
alias fd='find . -not -path "*/node_modules/*" -not -path "*.git/*" -type d -iname '
alias finddir='fd'
alias ..='cd ..'
alias cd..='cd ..'
alias .2="cd ../../"
alias .3="cd ../../../"
alias .4="cd ../../../../"
alias .5="cd ../../../../../"
alias .6="cd ../../../../../../"
alias .7="cd ../../../../../../../"
alias ll='ls -FGlAhp'
alias ls='ls -FA'
alias ~="cd ~"
alias root="cd /"
alias www="cd /var/www/"
alias commit="git commit -a"
alias commitAll="git add -A; git commit -a"
alias gitlog="git log --graph --decorate --oneline"
alias gittree="git log --graph --decorate --oneline --all"
alias checkout="git checkout"

function bold () {
    echo "$(tput bold)$@$(tput sgr0)"
}
alias bold="bold"

alias push="git push origin"
alias pull="git pull origin"
alias exit="exit && echo 0 > ~/.uis"

function line () {
    if [[ -z "$1" ]]; then
        local char="-"
    else 
        local char="$1"
    fi
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' $char
}
function doubleline () {
    line "="
}

alias sizes="sudo du -cxhd 1"
alias flushDNS='dscacheutil -flushcache'
alias DSFiles_removal="find . -type f -name '*.DS_Store' -ls -delete"


function hostedit() {
    local apt=`command -v vim`

    if [ -n $vim ]; then
        sudo vim /etc/hosts
    else
        sudo vi /etc/hosts
    fi
}
alias hosts_edit=hostedit
alias reloadprofiler='source ~/.bash_profile'
alias reloadbashrc='source ~/.bashrc'
alias reload="exec ${SHELL} -l"
# alias reload="tset 2>/dev/null || reset"
alias h='history'
alias today='date +"%d-%m-%Y"'
if [ -n "now" ]; then
    alias now='date +"%T"'
fi
alias ports='netstat -tulanp'
alias lsd='ll | grep "^d" --color=never' # ls for only directories
alias lsf='ll | grep "^[^d]" --color=no' # ls for only files
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

alias desktop='cd ~/Desktop'
alias desk='cd ~/Desktop'
alias d='cd ~/Documents'
alias docs='cd ~/Documents'
alias documents='cd ~/Documents'
alias downloads='cd ~/Downloads'
alias down='cd ~/Downloads'
alias amionline="ping www.google.com -c 1 2>/dev/null >/dev/null && echo \"Yes\" || echo \"No\""
alias amioffline="ping www.google.com -c 1 2>/dev/null >/dev/null && echo \"No\" || echo \"Yes\""

alias ifactive="ifconfig | pcregrep -M -o '^[^\t:]+:([^\n]|\n\t)*status: active'"
alias flush="dscacheutil -flushcache && killall -HUP mDNSResponder"
# Empty the Trash on all mounted volumes and the main HDD
alias emptytrash="sudo rm -rfv /Volumes/*/.Trashes; sudo rm -rfv ~/.Trash;"
alias pubkey="more ~/.ssh/id_rsa.pub | pbcopy | printf '=> Public key copied to pasteboard.\n'"
command -v md5sum > /dev/null || alias md5sum="md5"
command -v sha1sum > /dev/null || alias sha1sum="shasum"

# Ignore duplicate commands in the history
export HISTCONTROL=ignoredups
# Make new shells get the history lines from all previous
# shells instead of the default "last window closed" history
export PROMPT_COMMAND="history -a; $PROMPT_COMMAND"

# imported from @necolas's dotfiles
# Create a data URI from a file and copy it to the pasteboard
datauri() {
    local mimeType=$(file -b --mime-type "$1")
    if [[ $mimeType == text/* ]]; then
        mimeType="${mimeType};charset=utf-8"
    fi
    printf "data:${mimeType};base64,$(openssl base64 -in "$1" | tr -d '\n')" | pbcopy | printf "=> data URI copied to pasteboard.\n"
}
# Autocorrect typos in path names when using `cd`
shopt -s cdspell

# Check the window size after each command and, if necessary, update the values
# of LINES and COLUMNS.
shopt -s checkwinsize



function dog () {
    cat $@ | less -FRNX
}

# Show/hide hidden files in Finder
alias show-hidden-files="defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder"
alias hide-hidden-files="defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder"

# Tip imported from Mathias Bynens' dotfiles
# https://github.com/mathiasbynens/dotfiles/blob/master/.aliases
# Print each PATH entry on a separate line
alias path='echo -e ${PATH//:/\\n}'
# Lock the screen (when going AFK)
alias afk="/System/Library/CoreServices/Menu\ Extras/User.menu/Contents/Resources/CGSession -suspend"
# Kill all the tabs in Chrome to free up memory
# [C] explained: http://www.commandlinefu.com/commands/view/402/exclude-grep-from-your-grepped-output-of-ps-alias-included-in-description
alias chromekill="ps ux | grep '[C]hrome Helper --type=renderer' | grep -v extension-process | tr -s ' ' | cut -d ' ' -f2 | xargs kill"
# Hide/show all desktop icons (useful when presenting)
alias hide-desktop-icons="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias show-desktop-icons="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"
#Requests
for method in GET HEAD POST PUT DELETE TRACE OPTIONS; do
	alias "${method}"="lwp-request -m '${method}'"
done
# Use Git’s colored diff when available
hash git &>/dev/null;
if [ $? -eq 0 ]; then
	function diff() {
		git diff --no-index --color-words "$@";
	}
fi;

# `hierarchy` is a shorthand for `tree` with hidden files and color enabled, ignoring
# the `.git` directory, listing directories first. The output gets piped into
# `less` with options to preserve color and line numbers, unless the output is
# small enough for one screen.
function hierarchy() {
	try tree -aC -I '.git|node_modules|bower_components' --dirsfirst "$@" | less -FRNX;
}

# Determine size of a file or total size of a directory
function sizeof() {
	if du -b /dev/null > /dev/null 2>&1; then
		local arg=-sbh;
	else
		local arg=-sh;
	fi
	if [[ -n "$@" ]]; then
		du $arg -- "$@";
	else
		du $arg .[^.]* ./*;
	fi;
}

# Create a .tar.gz archive, using `zopfli`, `pigz` or `gzip` for compression
function targz() {
	local tmpFile="${@%/}.tar";
	tar -cvf "${tmpFile}" --exclude=".DS_Store" "${@}" || return 1;

	size=$(
		stat -f"%z" "${tmpFile}" 2> /dev/null; # macOS `stat`
		stat -c"%s" "${tmpFile}" 2> /dev/null;  # GNU `stat`
	);

	local cmd="";
	if (( size < 52428800 )) && hash zopfli 2> /dev/null; then
		# the .tar file is smaller than 50 MB and Zopfli is available; use it
		cmd="zopfli";
	else
		if hash pigz 2> /dev/null; then
			cmd="pigz";
		else
			cmd="gzip";
		fi;
	fi;

	echo "Compressing .tar ($((size / 1000)) kB) using \`${cmd}\`…";
	"${cmd}" -v "${tmpFile}" || return 1;
	[ -f "${tmpFile}" ] && rm "${tmpFile}";

	zippedSize=$(
		stat -f"%z" "${tmpFile}.gz" 2> /dev/null; # macOS `stat`
		stat -c"%s" "${tmpFile}.gz" 2> /dev/null; # GNU `stat`
	);

	echo "${tmpFile}.gz ($((zippedSize / 1000)) kB) created successfully.";
}

# other useful aliases, focused on safety
alias chown='chown --preserve-root'
# alias chmod='chmod --preserve-root'
alias chgrp='chgrp --preserve-root'

alias rm="/bin/rm -i"

#   extract:  Extract most know archives with one command
#   ---------------------------------------------------------
    extract () {
        if [ -f $1 ] ; then
          case $1 in
            *.tar.bz2)   tar xjf $1     ;;
            *.tar.gz)    tar xzf $1     ;;
            *.bz2)       bunzip2 $1     ;;
            *.rar)       unrar e $1     ;;
            *.gz)        gunzip $1      ;;
            *.tar)       tar xf $1      ;;
            *.tbz2)      tar xjf $1     ;;
            *.tgz)       tar xzf $1     ;;
            *.zip)       unzip $1       ;;
            *.Z)         uncompress $1  ;;
            *.7z)        7z x $1        ;;
            *)     echo "'$1' cannot be extracted via extract()" ;;
             esac
         else
             echo "'$1' is not a valid file"
         fi
    }

#   findPid: find out the pid of a specified process
#   -----------------------------------------------------
#       Note that the command name can be specified via a regex
#       E.g. findPid '/d$/' finds pids of all processes with names ending in 'd'
#       Without the 'sudo' it will only find processes of the current user
#   -----------------------------------------------------
    pid () { lsof -t -c "$@" ; }

#   ii:  display useful host related informaton
#   -------------------------------------------------------------------
    about() {
        local U
        U= `whoami`
        echo -e "\nYou are logged on ${RED}$HOST as $IM"
        echo -e "\nAdditionnal information:$NC " ; uname -a
        echo -e "\n${RED}Users logged on:$NC " ; w -h
        echo -e "\n${RED}Current date :$NC " ; date
        echo -e "\n${RED}Machine stats :$NC " ; uptime
        echo -e "\n${RED}Current network location :$NC " ; scselect
        echo -e "\n${RED}Local IP Address :$NC " ; ipin
        echo -e "\n${RED}Public facing IP Address :$NC " ; ipout
        #echo -e "\n${RED}DNS Configuration:$NC " ; scutil --dns
        echo
    }

#!/usr/bin/env bash
# Usage: goo.gl [URL]
#
# Shorten a URL using the Google URL Shortener service (http://goo.gl).
# (imported from https://gist.github.com/wafflesnatcha/3694648)
googl() {
	[[ ! $1 ]] && { echo -e "Usage: goo.gl [URL]\n\nShorten a URL using the Google URL Shortener service (http://goo.gl)."; return; }
	curl -qsSL -m10 --connect-timeout 10 \
		'https://www.googleapis.com/urlshortener/v1/url' \
		-H 'Content-Type: application/json' \
		-d '{"longUrl":"'${1//\"/\\\"}'"}' |
		perl -ne 'if(m/^\s*"id":\s*"(.*)",?$/i) { print $1 }'
}

# shrink URLS using goo.gl service
alias short="googl"

# back and forward with cd
export BACK_HISTORY=""
export FORWARD_HISTORY=""

function cd {
    BACK_HISTORY=$PWD:$BACK_HISTORY
    FORWARD_HISTORY=""
    builtin cd "$@"
}

function back {
    DIR=${BACK_HISTORY%%:*}
    if [[ -d "$DIR" ]]
    then
        BACK_HISTORY=${BACK_HISTORY#*:}
        FORWARD_HISTORY=$PWD:$FORWARD_HISTORY
        builtin cd "$DIR"
    fi
}

function forward {
    DIR=${FORWARD_HISTORY%%:*}
    if [[ -d "$DIR" ]]
    then
        FORWARD_HISTORY=${FORWARD_HISTORY#*:}
        BACK_HISTORY=$PWD:$BACK_HISTORY
        builtin cd "$DIR"
    fi
}
