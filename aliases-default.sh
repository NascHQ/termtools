alias ips="ip"
alias ipin="sudo ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p'"
alias ipout='dig +short myip.opendns.com @resolver1.opendns.com 2>/dev/null || echo "No internet connection"'
alias ports='netstat -tulanp'

# Tip imported from Mathias Bynens' dotfiles
# https://github.com/mathiasbynens/dotfiles/blob/master/.aliases
# Print each PATH entry on a separate line
alias path='echo -e ${PATH//:/\\n}'

alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

alias ll='ls -FGlAhp'
alias ls='ls -FA'
alias lh='ls -lisAdGl .[^.]*'
alias lsd='ll | grep "^d" --color=never' # ls for only directories
alias lsf='ll | grep "^[^d]" --color=no' # ls for only files

alias ~="cd ~"
alias root="cd /"
alias ..='cd ..'
alias cd..='cd ..'
alias .2="cd ../../"
alias .3="cd ../../../"
alias .4="cd ../../../../"
alias .5="cd ../../../../../"
alias .6="cd ../../../../../../"
alias .7="cd ../../../../../../../"
alias www="cd /var/www/"
alias desktop='cd ~/Desktop'
alias desk='cd ~/Desktop'
alias d='cd ~/Documents'
alias docs='cd ~/Documents'
alias documents='cd ~/Documents'
alias downloads='cd ~/Downloads'
alias down='cd ~/Downloads'

alias reloadprofiler='source ~/.bash_profile'
alias reloadbashrc='source ~/.bashrc'
alias reload="exec ${SHELL} -l"
alias h='history'

alias today='date +"%d-%m-%Y"'
if [ -n "now" ]; then
	alias now='date +"%T"'
fi

alias commit="git commit -a"
alias commitAll="git add -A; git commit -a"
alias gitlog="git log --graph --decorate --oneline"
alias gittree="git log --graph --decorate --oneline --all"
alias checkout="git checkout"
alias push="git push origin"
alias pull="git pull origin"
# Use Git’s colored diff when available
hash git &>/dev/null;
if [ $? -eq 0 ]; then
	function diff() {
		git diff --no-index --color-words "$@";
	}
fi;

alias sizes="sudo du -cxhd 1"
alias aliases='alias'

alias amionline="ping www.google.com -c 1 2>/dev/null >/dev/null && echo \"Yes\" || echo \"No\""
alias amioffline="ping www.google.com -c 1 2>/dev/null >/dev/null && echo \"No\" || echo \"Yes\""
alias ifactive="sudo ifconfig | try pcregrep -M -o '^[^\t:]+:([^\n]|\n\t)*status: active'"

alias chown='chown --preserve-root'
alias chgrp='chgrp --preserve-root'
alias rm="/bin/rm -i"
alias exit="exit && echo 0 > ~/.uis"

#Requests
for method in GET HEAD POST PUT DELETE TRACE OPTIONS; do
	alias "${method}"="lwp-request -m '${method}'"
done

function bold () {
	echo "$(tput bold)$@$(tput sgr0)"
}
alias bold="bold"
