## Nasc Profiler

It ads a bunch of _aliases_ and extra funcionality for your bash profile.

### Installing it

```
echo "source /path/to/nasc_profile.sh" > ~/.bash_profile
```

### Pattern

For your _PS1_ variable, it defines:

```
USER[@host] :: Path [(branch)]$
```

Where _@host_ is only shown in case your are on a SSH session, and _(branch)_ is only shown in directories where you have a _.git_ file. It will have a different color according to the current state of the active branch.

### Features

- Colors in PS1
- Exibe o _host_ quando está rodando em conexão remota
- Adiciona auto-complete a comandos do git (e branches)
- Exibe branch atual e seu status
- Adiciona diversos aliases úteis. Para ver a lista, execute `$ aliases`
- Protects some actions (like deleting or change permissions to root path)

### Aliases


