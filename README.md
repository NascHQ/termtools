## Bash Profile by Nasc

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

![](raw/master/assets/nasc_profiler_sample.png)

### Features

- Colors in PS1
- Exibe o _host_ quando está rodando em conexão remota
- Adiciona auto-complete a comandos do git (e branches)
- Exibe branch atual e seu status
- Adiciona diversos aliases úteis. Para ver a lista, execute `$ aliases`
- Protects some actions (like deleting or change permissions to root path)

### Aliases

- fixcamera: Fixes the camera when it is not loading (a known bug triggered in chrome)
- ipin: Shows the internal IP addess
- ipout: Shows the IP facing the public network
- ip: Shows both internal and external IPs
- aliases: Shows the list of currently supported aliases
- ..: Equivalent to `cd ..`
- cd..: Equivalent to `cd ..`
- .2: Equivalent to `cd ../..`
- .3: Equivalent to `cd ../../..`
- .4: Equivalent to `cd ../../../..`
- .5: Equivalent to `cd ../../../../..`
- .6: Equivalent to `cd ../../../../../..`
- .7: Equivalent to `cd ../../../../../../..`
- ll: A better listing of your files and directories
- ~: Goes to your HOME directory
- root: Goes to your root path (/)
- www: Goes to `/var/www/`
- commit: `git commit -a`
- commitAll: `git add -A; git commit`
- gitlog: Shows a more readable log for your git repo
- gittree: Shows a readable tree for your git repo
- checkout: `git checkout`
- push: `git push origin`
- pull: `git pull origin`
- sizes: Shows the size of your files and directories
- flushDNS: Flushes the DNSs
- DSFiles_removal: Removes all the `.DS_Store` files (recursivelly) in the current tree
- hosts_editir: Opens and editor for your hosts file
- h: Shows the bash history
- today: Shows the date for today
- now: Shows the current time
- ports: Shows the currently pened ports
- lsd: Equivalent to `ls` but showing only directories
- extract: Extracts any compressed files (works with any file with extension tar.bz2, tar.gz, bz2, rar, gz, tar, tbz2, tgz, zip, Z, 7z)
- pid: Shows the PID for a given process name
- about: Shows infor on the current serve/session/user

