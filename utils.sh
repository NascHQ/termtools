#!/bin/bash
# global functions

function branch_color() {

    #local LOCAL_CHANGES_COLOR='\e[38;5;226m'
    local LOCAL_CHANGES_COLOR='[38;5;226m'
    #local UNTRACKED_CHANGES_COLOR='\e[38;5;196m'
    local UNTRACKED_CHANGES_COLOR='[38;5;196m'
    #local LOCAL_AND_UNTRACKED_CHANGES_COLOR='\e[38;5;214m'
    local LOCAL_AND_UNTRACKED_CHANGES_COLOR='[38;5;214m'
    #local NO_CHANGES_COLOR='\e[38;5;112m'
    local NO_CHANGES_COLOR='[38;5;112m'
    #local COMMITS_AHEAD_OR_BEHIND='\e[38;5;142m'
    local COMMITS_AHEAD_OR_BEHIND='[38;5;142m'
    #local COLOR_RESET='\e[m'
    local COLOR_RESET='[m'

    local branch_name=`git branch 2>/dev/null | grep -e '\*' --color=never | sed 's/\* //'`
    local final_color=""

    if [[ $branch_name =~ .+ ]]; then
        case "$(git status 2>/dev/null | grep -E -o 'nothing|Untracked|Changes|to be committed|Unmerged' | paste -s -d"," -)" in
            "nothing")
            
                if [[ $(git status 2>/dev/null | grep -E "behind|ahead|diverged" 2>/dev/null) ]]; then
                    final_color="$COMMITS_AHEAD_OR_BEHIND"
                else
                    final_color="$NO_CHANGES_COLOR"
                fi
                ;;
            'Untracked' | 'Untracked,nothing' | 'Unmerged' | 'Unmerged,Untracked')
                final_color="$UNTRACKED_CHANGES_COLOR"
                ;;
            'Changes,to be committed')
                final_color="[38;5;228m"
                ;;
            'Changes,Untracked')
                final_color="$LOCAL_AND_UNTRACKED_CHANGES_COLOR"
                ;;
            *)
                final_color="$LOCAL_CHANGES_COLOR"
                ;;
            esac

        echo -ne "$final_color"
    fi
}

function currentGitBranch() {

    local branch_name=`git branch 2>/dev/null | grep -e '\*' --color=never | sed 's/\* //'`
    local wrap=false
    local timelineSymbol=false

    if [[ $branch_name =~ .+ ]]; then

        if [[ "$1" =~ \-.*w.*|\-\-wrap ]]; then
            wrap=true;
        fi

        if [[ "$1" =~ \-.*t.*|\-\-wrap ]]; then
            timelineSymbol=true;
        fi

        timelineSymbol="";

        if $timelineSymbol; then
            case "$(git status 2>/dev/null | grep -E -o 'behind|ahead|diverged' | paste -s -d"," -)" in
                "behind")
                    timelineSymbol="--"
                ;;
                "ahead")
                    timelineSymbol="++"
                ;;
                "diverged")
                    timelineSymbol="><"
                ;;
                *)
                    timelineSymbol=""
                ;;
            esac

            if [[ ! -z $timelineSymbol ]]; then
                branch_name="$branch_name $timelineSymbol"
            fi
        fi

        if $wrap; then
            branch_name=" ($branch_name)"
        fi

        echo -ne "$branch_name"

    fi
}

export -f currentGitBranch
