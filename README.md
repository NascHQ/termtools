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


