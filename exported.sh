#!/bin/bash

# if ! type "trash" > /dev/null; then
#     echo "Instaling dependency for moving files to trash."
#     npm install trash-cli -g
# fi

alias fixcamera="sudo killall VDCAssistant"
alias ipin="ipconfig getifaddr en0"
alias ipout='dig +short myip.opendns.com @resolver1.opendns.com'
alias ip="echo -e Internal IP Address: ;  ipconfig getifaddr en0; echo -e Public facing IP Address: ; curl ipecho.net/plain ; echo ;"
alias aliases='alias'
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
alias sudo="echo 1 > ~/.uis && sudo"
alias exit="exit && echo 0 > ~/.uis"
alias line="printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -"
alias doubleline="printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' ="
alias sizes="sudo du -cxhd 1"
alias flushDNS='dscacheutil -flushcache'
alias DSFiles_removal="find . -type f -name '*.DS_Store' -ls -delete"
alias hosts_edit='sudo vim /etc/hosts'
alias reloadprofiler='source ~/.bash_profile'
alias h='history'
alias today='date +"%d-%m-%Y"'
alias now='date +"%T"'
alias ports='netstat -tulanp'
alias lsd='ll | grep "^d" --colors=never' # ls for only directories
alias lsf='ll | grep "^[^d]" --color=no' # ls for only files
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

alias desktop='cd ~/Desktop'
alias desk='cd ~/Desktop'
alias d='cd ~/Documents'
alias docs='cd ~/Documents'
alias documents='cd ~/Documents'
alias documents='cd ~/Documents'
alias downloads='cd ~/Downloads'
alias down='cd ~/Downloads'

alias ifactive="ifconfig | pcregrep -M -o '^[^\t:]+:([^\n]|\n\t)*status: active'"
alias flush="dscacheutil -flushcache && killall -HUP mDNSResponder"
command -v md5sum > /dev/null || alias md5sum="md5"
command -v sha1sum > /dev/null || alias sha1sum="shasum"


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
	tree -aC -I '.git|node_modules|bower_components' --dirsfirst "$@" | less -FRNX;
}

# Determine size of a file or total size of a directory
function size-of() {
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
# del () {
#     # trash $1
#     move $1 '~/'
#     echo "$1 Moved to trash"
# }
# del () {
#   local path
#   for path in "$@"; do
#     # ignore any arguments
#     if [[ "$path" = -* ]]; then :
#     else
#       local dst=${path##*/}
#       # append the time if necessary
#     #   while [ -e ~/.Trash/"$dst" ]; do
#     #     dst="$dst "$(date +%H-%M-%S)
#     #   done
#       mv "$path" ~/.Trash/"$dst"
#     fi
#   done
# }
# alias rm="echo Use 'del' to send it to the trash can instead.; /bin/rm -i --preserve-root"
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
goo.gl() {
	[[ ! $1 ]] && { echo -e "Usage: goo.gl [URL]\n\nShorten a URL using the Google URL Shortener service (http://goo.gl)."; return; }
	curl -qsSL -m10 --connect-timeout 10 \
		'https://www.googleapis.com/urlshortener/v1/url' \
		-H 'Content-Type: application/json' \
		-d '{"longUrl":"'${1//\"/\\\"}'"}' |
		perl -ne 'if(m/^\s*"id":\s*"(.*)",?$/i) { print $1 }'
}

# shrink URLS using goo.gl service
alias short="goo.gl"

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

function getGit () {
    local branch_name=`git branch 2>/dev/null | grep -e '\*' --color=never | sed 's/\* //'`
    local status=0
    local timelineSymbol=""
    local COUNTER=0

    if [[ $branch_name =~ .+ ]]; then
        
        case "$(git status 2>/dev/null | grep -E -o 'nothing|Untracked|Changes|to be committed|Unmerged' | paste -s -d"," -)" in
            "nothing")
                # if [[ $(git status 2>/dev/null | grep -E "behind|ahead|diverged" 2>/dev/null) ]]; then
                case "$(git status 2>/dev/null | grep -E -o 'behind|ahead|diverged' | paste -s -d"," -)" in
                    "behind")
                        timelineSymbol="-"
                        status=-1
                    ;;
                    "ahead")
                        timelineSymbol="+"
                        status=1 #"$COMMITS_AHEAD_OR_BEHIND"
                    ;;
                    "diverged")
                        timelineSymbol=""
                        status=-2
                    ;;
                    *)
                        timelineSymbol=""
                        status=0 #"$NO_CHANGES_COLOR"
                    ;;
                esac
                # fi
                ;;
            'Untracked' | 'Untracked,nothing' | 'Unmerged' | 'Unmerged,Untracked')
                status=2 #"$UNTRACKED_CHANGES_COLOR"
                timelineSymbol+="*"
                ;;
            'Changes,to be committed')
                status=3 #"[38;5;228m"
                ;;
            'Changes,Untracked' | 'Changes,to be committed,Changes,Untracked' | 'Changes,to be committed,Untracked')
                status=4 #"$LOCAL_AND_UNTRACKED_CHANGES_COLOR"
                timelineSymbol+="*"
                ;;
            *)
                COUNTER=-5
                status=5 #"$LOCAL_CHANGES_COLOR"
                ;;
            esac

        echo -ne "$branch_name@@@$status@@@$timelineSymbol"
    else
        echo -ne "@@@"
    fi
}

#!/bin/bash

function battery_charge() {
    case $(uname -s) in
        "Darwin")
            if ((pmset_on)) && command -v pmset &>/dev/null; then
                if [ "$(pmset -g batt | grep -o 'AC Power')" ]; then
                    BATT_CONNECTED=1
                else
                    BATT_CONNECTED=0
                fi
                BATT_PCT=$(pmset -g batt | grep -o '[0-9]*%' | tr -d %)
            else
                while read key value; do
                    case $key in
                        "MaxCapacity")
                            maxcap=$value
                            ;;
                        "CurrentCapacity")
                            curcap=$value
                            ;;
                        "ExternalConnected")
                            if [ $value == "No" ]; then
                                BATT_CONNECTED=0
                            else
                                BATT_CONNECTED=1
                            fi
                            ;;
                    esac
                    if [[ -n "$maxcap" && -n $curcap ]]; then
                        BATT_PCT=$(( 100 * curcap / maxcap))
                    fi
                done < <(ioreg -n AppleSmartBattery -r | grep -o '"[^"]*" = [^ ]*' | sed -e 's/= //g' -e 's/"//g' | sort)
            fi
            ;;
        "Linux")
            case $(cat /etc/*-release) in
                *"Arch Linux"*|*"Ubuntu"*|*"openSUSE"*)
                    battery_state=$(cat $battery_path/energy_now)
                    battery_full=$battery_path/energy_full
                    battery_current=$battery_path/energy_now
                    ;;
                *)
                    battery_state=$(cat $battery_path/status)
                    battery_full=$battery_path/charge_full
                    battery_current=$battery_path/charge_now
                    ;;
            esac
            if [ $battery_state == 'Discharging' ]; then
                BATT_CONNECTED=0
            else
                BATT_CONNECTED=1
            fi
                BATTERY_STATE=$(cat $battery_current)
                full=$(cat $battery_full)
                BATT_PCT=$((100 * $now / $full))
            ;;
    esac
}

battery_charge

echo 0 > ~/.uis
lastBatteryCheck=$SECONDS
battery_charge
function buildPS1ForReal () {
    if ((SECONDS % 10 == "0")); then
        battery_charge
    fi
    WRITTABLE=0
    if [ -w `pwd` ]; then
        WRITTABLE=1
    fi

    node /private/var/www/NASC/projects/nasc_profiler/get-ps1-parts.js /private/var/www/NASC/projects/nasc_profiler/index.js /var/www/NASC/projects/nasc_profiler/index.sh 0 Felipes-MacBook-Pro.local /Users/felipe $(getGit) $WRITTABLE $BATT_CONNECTED $BATT_PCT $(now) $1 1
}
function buildPS1 () {
    PS1="\$(if [ -n \"\$(type -t buildPS1ForReal)\" ]; then echo \"$(buildPS1ForReal $(whoami))\"; else echo \"$(cat /private/var/www/NASC/projects/nasc_profiler/sudoed-ps1.txt)\" ; fi)"
}

node /private/var/www/NASC/projects/nasc_profiler/get-ps1-parts.js /private/var/www/NASC/projects/nasc_profiler/index.js /var/www/NASC/projects/nasc_profiler/index.sh 0 Felipes-MacBook-Pro.local /Users/felipe $(now) root 1 > /private/var/www/NASC/projects/nasc_profiler/sudoed-ps1.txt
#echo "\[\033[0;33m\][\u@\h \w]\$ \[\033[00m\]"
export -f buildPS1
PROMPT_COMMAND="buildPS1"

####PS1="\$(if [ -n \"\$(type -t buildPS1)\" ]; then buildPS1 h; else /private/var/www/NASC/projects/nasc_profiler/sudoed-ps1.txt ; fi)"
PS1="${PS2c##*[$((PS2c=1))-9]}$PS1"
PS2="[40m[90m \$((PS2c=PS2c+1)) [39m[49m"
PS4="!"


