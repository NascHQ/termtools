# _termtools() {
#     local cur="${comp_words[$comp_cword]}"
#     local prev=""
#     (( comp_cword > 0 )) && prev="${comp_words[$(( comp_cword - 1))]}"
#     [[ $cur == '=' && $prev == --* ]] && { compreply=( "" ); return; }

#     local words=(--param= --param-info)
#     # _exclude_cmd_line_opts
#     compreply=( $(compgen -W "${words[*]}" -- "$cur") )
# }

# complete -F _termtools termtools

complete -W "restore remove reload apply \"set theme\" help version version customize" termtools
