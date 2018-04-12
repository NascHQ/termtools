command -v md5sum > /dev/null || alias md5sum="md5"
command -v sha1sum > /dev/null || alias sha1sum="shasum"


# Ignore duplicate commands in the history
export HISTCONTROL=ignoredups
# Make new shells get the history lines from all previous
# shells instead of the default "last window closed" history
export PROMPT_COMMAND="history -a; $PROMPT_COMMAND"


# Autocorrect typos in path names when using `cd`
shopt -s cdspell
# Check the window size after each command and, if necessary, update the values
# of LINES and COLUMNS.
shopt -s checkwinsize


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


function dog () {
    cat $@ | less -FRNX
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
pid () {
    lsof -t -c "$@" ;
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


hosts_edit() {
    vimEditor=`command -v vim`

    if [ $vimEditor ]; then
        sudo vim /etc/hosts
    else
        sudo vi /etc/hosts
    fi
}


# Linux use xclip and not pbcopy
# we are simulating pbcopy
# to have a hybrid command

pubkey() {
    #alias pbcopy='try xclip -selection clipboard'
    #alias pbpaste='try xclip -selection clipboard -o'
    
    if [ $(uname) != 'Darwin' ]; then
        xclipIsCommand=`command -v xclip`

        if [ $xclipIsCommand ]; then
            more ~/.ssh/id_rsa.pub | xclip -selection clipboard | printf '===> Public key copied to pasteboard. \n'
        else
            try xclip -selection clipboard
        fi
    else
        more ~/.ssh/id_rsa.pub | pbcopy | printf '===> Public key copied to pasteboard. \n'
    fi
}


getIpIn() {
    ifconfig 2>/dev/null || sudo ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'
}


ifActive() {
    ifconfig 2>/dev/null || sudo ifconfig | try pcregrep -M -o '^[^\t:]+:([^\n]|\n\t)*status: active'
}


#####################
# IMPORTING ALIASES #
#####################
. "$DIR/aliases-default.sh"

if [ $(uname) == 'Darwin' ]; then
    . "$DIR/aliases-macos.sh"
fi;
