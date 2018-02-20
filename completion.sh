
# complete -W "restore remove reload apply \"set theme\" help version version customize" termtools
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function _getTermToolsOptions () {
    local word=${COMP_WORDS[COMP_CWORD]}
    local prevWord=${COMP_WORDS[COMP_CWORD - 1]}
    local line=${COMP_LINE}

    case "$prevWord" in
    "set")
        COMPREPLY=( $(compgen -W "theme" -- $word) )
        ;;
    "theme")
        scriptsList=`ls $DIR/themes | sed 's/\(.*\)\..*/\1 /' | tr -d '\n' 2>/dev/null`
        COMPREPLY=( $(compgen -W "$scriptsList" -- $word) )
    ;;
    *)
        COMPREPLY=( $(compgen -W 'restore remove reload apply set help version version customize' -- $word ) )
    esac
}

complete -F _getTermToolsOptions termtools


function _getNPMOptions () {
    local word=${COMP_WORDS[COMP_CWORD]}
    local prevWord=${COMP_WORDS[COMP_CWORD - 1]}
    local line=${COMP_LINE}

    case "$prevWord" in
    "run")
        scriptsList=`node -e "\
        console.log(\
            Object.keys(\
                require('./package.json').scripts\
            ).filter(item => {\
                if(item.startsWith('pre') || item.startsWith('post')) {\
                    return false\
                } else {\
                    return true\
                }\
            }).join(' ')\
        )" 2>/dev/null`
        COMPREPLY=( $(compgen -W "$scriptsList" -- $word) )
    ;;
    "version")
        COMPREPLY=( $(compgen -W "patch minor major" -- $word) )
    ;;
    *)
        COMPREPLY=( $(compgen -W 'run start test access adduser bin bugs cache completion config ddp dedupe deprecate dist-tag docs doctor edit explore get help help-search init install link list login logout ls outdated owner pack ping prefix profile prune publish uninstall unpublish unstar update version view whoami' -- $word ) )
    esac
}

complete -F _getNPMOptions npm
