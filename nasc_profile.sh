echo "Applying Nasc Profile aliases and features"
IM=`whoami`
IP=`ipconfig getifaddr en0`
DT=`date "+%d/%m/%Y %H:%M:%S"`
echo "    User: $IM
    At: $HOSTNAME
    Path: $PWD
    IP: $IP
    Date/Time: $DT"
echo "For help, type aliases."

# if ! type "trash" > /dev/null; then
#     echo "Instaling dependency for moving files to trash."
#     npm install trash-cli -g
# fi

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting

alias fixcamera="sudo killall VDCAssistant"
alias ipin="ipconfig getifaddr en0"
alias ipout='dig +short myip.opendns.com @resolver1.opendns.com'
alias ip="echo -e Internal IP Address: ;  ipconfig getifaddr en0; echo -e Public facing IP Address: ; curl ipecho.net/plain ; echo ;"
alias aliases='alias'
alias ..='cd ..'
alias cs..='cd ..'
alias .2="cd ../../"
alias .3="cd ../../../"
alias .4="cd ../../../../"
alias .5="cd ../../../../../"
alias .6="cd ../../../../../../"
alias .7="cd ../../../../../../../"
alias ll='ls -FGlAhp'
alias ~="cd ~"
alias root="cd /"
alias www="cd /var/www/"
alias commit="git commit -a"
alias commitAll="git add -A; git commit -a"
alias gitlog="git log --graph --decorate --oneline"
alias gittree="git log --graph --decorate --oneline --all"
alias checkout="git checkout"
alias push="git push origin"
alias pull="git pull origin"
alias largest="sudo du -cxhd 1"
alias sizes="sudo du -cxhd 1"
alias amazon="sudo ssh -i ~/.ssh/nascserver.pem ubuntu@18.231.45.221"
alias flushDNS='dscacheutil -flushcache'
alias DSFiles_removal="find . -type f -name '*.DS_Store' -ls -delete"
alias hosts_editir='sudo vim /etc/hosts'
alias h='history'
alias today='date +"%d-%m-%Y"'
alias now='date +"%T"'
alias ports='netstat -tulanp'
alias lsd='ll | grep "^d"' # ls for only directories
# safety
alias chown='chown --preserve-root'
alias chmod='chmod --preserve-root'
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
alias rm="/bin/rm -i --preserve-root"



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
    ii() {
        echo -e "\nYou are logged on ${RED}$HOST"
        echo -e "\nAdditionnal information:$NC " ; uname -a
        echo -e "\n${RED}Users logged on:$NC " ; w -h
        echo -e "\n${RED}Current date :$NC " ; date
        echo -e "\n${RED}Machine stats :$NC " ; uptime
        echo -e "\n${RED}Current network location :$NC " ; scselect
        echo -e "\n${RED}Public facing IP Address :$NC " ;myip
        #echo -e "\n${RED}DNS Configuration:$NC " ; scutil --dns
        echo
    }

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
SOURCE="$(readlink "$SOURCE")"
[[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

# apply the rest of the source
source $DIR/profiler.sh
