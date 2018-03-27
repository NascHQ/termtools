# some chrome versions require this for you to enter on a meeting
alias fixcamera="sudo killall VDCAssistant"

alias flush="dscacheutil -flushcache && killall -HUP mDNSResponder"

# Empty the Trash on all mounted volumes and the main HDD
alias emptytrash="sudo rm -rfv /Volumes/*/.Trashes; sudo rm -rfv ~/.Trash;"
alias pubkey="more ~/.ssh/id_rsa.pub | pbcopy | printf '=> Public key copied to pasteboard.\n'"

# Show/hide hidden files in Finder
alias show-hidden-files="defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder"
alias hide-hidden-files="defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder"

# Lock the screen (when going AFK)
alias afk="/System/Library/CoreServices/Menu\ Extras/User.menu/Contents/Resources/CGSession -suspend"
# Kill all the tabs in Chrome to free up memory
# [C] explained: http://www.commandlinefu.com/commands/view/402/exclude-grep-from-your-grepped-output-of-ps-alias-included-in-description
alias chromekill="ps ux | grep '[C]hrome Helper --type=renderer' | grep -v extension-process | tr -s ' ' | cut -d ' ' -f2 | xargs kill"
# Hide/show all desktop icons (useful when presenting)
alias hide-desktop-icons="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias show-desktop-icons="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"

alias ff='find . -not -path "*/node_modules/*" -not -path "*.git/*" -type f -iname '
alias findfile='ff'
alias fd='find . -not -path "*/node_modules/*" -not -path "*.git/*" -type d -iname '
alias finddir='fd'
alias flushDNS='dscacheutil -flushcache'
alias DSFiles_removal="find . -type f -name '*.DS_Store' -ls -delete"

# imported from @necolas's dotfiles
# Create a data URI from a file and copy it to the pasteboard
datauri() {
    local mimeType=$(file -b --mime-type "$1")
    if [[ $mimeType == text/* ]]; then
        mimeType="${mimeType};charset=utf-8"
    fi
    printf "data:${mimeType};base64,$(openssl base64 -in "$1" | tr -d '\n')" | pbcopy | printf "=> data URI copied to pasteboard.\n"
}
