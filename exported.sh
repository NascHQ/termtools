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
alias back='cd -'
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
function underline () {
    echo "$(tput underline)$@$(tput sgr0)"
}
alias underline="underline"

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
alias lsd='ll | grep "^d"' # ls for only directories
alias lsf='ll | grep "^[^d]" --color=no' # ls for only files
# safety
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
function buildPS1ForReal () {
    battery_charge
    node /private/var/www/NASC/projects/nasc_profiler/get-ps1-parts.js /private/var/www/NASC/projects/nasc_profiler/index.js /var/www/NASC/projects/nasc_profiler/index.sh 0 Felipes-MacBook-Pro.local /Users/felipe $BATT_CONNECTED $BATT_PCT $(now) $(whoami) 1
}
function buildPS1 () {
    PS1="\$(if [ -n \"\$(type -t buildPS1ForReal)\" ]; then echo \"$(buildPS1ForReal h)\"; else /private/var/www/NASC/projects/nasc_profiler/sudoed-ps1.txt ; fi)"
}

#node /private/var/www/NASC/projects/nasc_profiler/get-ps1-parts.js /private/var/www/NASC/projects/nasc_profiler/index.js /var/www/NASC/projects/nasc_profiler/index.sh 0 Felipes-MacBook-Pro.local /Users/felipe $(now) root 1 > /private/var/www/NASC/projects/nasc_profiler/sudoed-ps1.txt
#echo "\[\033[0;33m\][\u@\h \w]\$ \[\033[00m\]"
export -f buildPS1
PROMPT_COMMAND="buildPS1"

####PS1="\$(if [ -n \"\$(type -t buildPS1)\" ]; then buildPS1 h; else /private/var/www/NASC/projects/nasc_profiler/sudoed-ps1.txt ; fi)"
PS1="${PS2c##*[$((PS2c=1))-9]}$PS1"
PS2="[40m[90m \$((PS2c=PS2c+1)) [39m[49m"
PS4="!"



