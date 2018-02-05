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
