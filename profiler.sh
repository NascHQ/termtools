#!/bin/bash

# import utilities
. "$(dirname $BASH_SOURCE)/utils.sh"

export CLICOLOR=1
export LS_COLORS='di=38;1;15;48;5;235:fi=38;5;228:ln=31:pi=5:so=5:bd=5:cd=5:or=31:mi=1:ex=38;5;202;4:st=48;5;160:ow=38;1;15;48;5;198:tw=38;5;198:*.rpm=90:*.js=38;5;143:*.json=38;5;144:*.css=38;5;136:*.scss=38;5;214:*.htm=38;5;182:*.html=38;5;183'
export GREP_OPTIONS='--color=auto'

BG_BLUE='\e[44m\]'
DIM='\e[2m\]'

USER="\u"
# SEP=" ❱"
SEP=" :: "
DOLLAR="\$"
BRANCH_COLOR="\$(branch_color)"
CURRENT_BRANCH="\[\$(currentGitBranch -wt)\]"
RESET_COLOR="\[\e[m\\"
# DIR_PATH="\w"
DIR_PATH="\[\e[2m…\]\e[m/\W\]"
MACHINE=""
if [ -n "$SSH_CLIENT" ] || [ -n "$SSH_TTY" ]; then
  MACHINE="@\h"
else
  case $(ps -o comm= -p $PPID) in
    sshd|*/sshd) MACHINE="@\h";;
  esac
fi

export PS1="\[\e[38;5;111m\]$USER$MACHINE$SESSION_TYPE\[$RESET_COLOR]$SEP\[\e[1;37m\]$DIR_PATH\[$RESET_COLOR]\[\e$BRANCH_COLOR\]$CURRENT_BRANCH\[$RESET_COLOR] $DOLLAR \]"

if [ -f ~/.git-completion.bash ]; then
  . ~/.git-completion.bash
fi

export PATH="$HOME/.node/bin:$PATH"

# felipe  Felipes-MBP  var  www  powerline-shell  master  $ 
# felipe  var  www  …  __furtherjs  master  3⬆  12✎  2?  $ 