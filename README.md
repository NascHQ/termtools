# Bash Profile by Nasc

Easy to customize, built on top of the power of JavaScript and Bash, it ads a bunch of _aliases_, functions, features and extra funcionality for your bash profile.

![termtools themes](media/termtools-built-in-themes.png)

## Features

- [x] Fully customizable using **JavaScript**
- [x] Applies to PS1
- [x] Terminal comands to enable or disable it (restoring your previous PS1)
- [x] Allows you to dinamically _turn on_ and _off_ parts of PS1
- [x] PS2 with line numbers
- [x] Auto completes git commands
- [x] Shows current **branch** and git **state** (also customizable)
- [x] Lots of Extra **aliases** (check the aliases section for more info about it)
- [x] Extra **functions**
- [x] Suport **themes** (coming with 6 themes for you to extend and customize...[see below](#Themes))
- [x] Move easily from one theme to another
- [x] **Protects** some actions (like deleting or change permissions to root path)
- [x] Auto installs **fonts** for you (although, you might need to select them in your terminal settings)
- [x] Ensures colors...everywhere... _grep_, _git_, _ls_...
- [x] More tools, like time, battery and readOnly...
- [x] Extendable...you can customize your theme with any extra string, allowing you to use JavaScript to decide what to show

![Termtools with battery, time and read only](media/termtools-theme-default-with-battery.jpg)

## Installing it

Easy like sunday morning!

```
npm install -g @nasc/termtools
```

## Applying it

Run this command and, if everything went well, your terminal should be good looking by now!

```
termtools apply
```

## Oh Oh!

Seing _weird characters_? No worries, follow the tips your own terminal will give you.  
At any time, you can run `termtools check` to validate the characters and some colors.

The font we are using (and was already installed for you) is:  
**"Droid Sans Mono for Powerline Plus Nerd File Types Mono"**

All you gotta do is go to your terminal settings, and edit your profile changint its font family/face to that one.

In _Visual Studio Code_, you can add the settings for the integrated terminal:

```
"terminal.integrated.fontFamily": "Droid Sans Mono for Powerline Plus Nerd File Types Mono"
```

You should be able to run `termtools check` and see this message:

![Termtools character set test](media/character-set-check.png)

## Removing it (restore)

Want to see the your PS1 as it was before (will also loos all the _aliases_ and extra functions).

```sh
termtools remove
# or
termtools restore
```

To bring it back, just run the `apply` command again:

```
termtools apply
```

## Reloading it

After installed and applied, you have three ways to reload it. Both ways will reload the whole bash profile (applying any updates that might be outdated).

```sh
# alternative 1
termtools reload
#alternative 2
reload
# alternative 3
termtools restore
termtools apply
```

## Git integration

If you are navigating in a directory that happens to belong to a Git Repository, you will see its current branch in your terminal.  
Also, the color indicates the current status of your branch, there you might see symbols identifying your branch as _behind_, _ahead_ or _diverged_.

![Termtools default theme](media/termtools-theme-default-git.png)

### PS2

We also change your PS2 a little, adding line numbers for your multiple lined commands:

![Termtools multiline commands with line numbers](media/termtools-theme-default-multi-line.png)

## Customizing

You can customize it using **JavaScript** \o/  
And it is not even a _JSON_, nope...it is JavaScript, indeed.

We can create a boilerplate for you to customize (a copy of the default settings).  
Just run:

```
termtools customize
```

It will create a file at **`~/.basch_profile.js`**.  
That file is a copy of our _default_ theme, with comments and all you might need to extend it.  
This JavaScript file **must** export a literal object, or a function that resolves to a literal object.

If you exported a function, it will be called, receiving one parameter, an object with these properties:

- IS_TTY: True if current session is running on a TTY environment
- IS_ROOT: True if the current user is root
- IP: The current device's ip
- BATTERY: The current percentage of the battery (give or take...some OSs lie a little about it)
- IS_CHARGING: True if the device is connected and charging
- GIT_STATUS: The repository status. May be from -2 to 5, meaning:
    * -2: COMMITS DIVERGED
    * -1: COMMITS BEHIND
    * 0: NO CHANGES
    * 1: COMMITS AHEAD
    * 2: UNTRACKED CHANGES
    * 3: CHANGES TO BE COMMITTED
    * 4: LOCAL AND UNTRACKED CHANGES
    * 5: LOCAL CHANGES
- GIT_SYMBOL: A symbol representing the current position of the branch. Symbols can be:
    * "-": COMMITS BEHIND
    * "+": COMMITS AHEAD
    * "!": COMMITS DIVERGED
    * "*": UNTRACKED
    * "": Anything else
- GIT_BRANCH: The name of the current branch
- IS_WRITABLE: True if the current user has write access to the current directory
- colors: A referece to the a `chalk` instance, allowing you to add colors if you need to

Use these data to decide how your exported object will be. You can use it, for example, to enable or disable parts of the PS1, or to show some parts in different colors.

Check the documentation bellow to understand it better, how to customize your terminal using JavaScript.

  > After any change you make in your customized theme, you should see the difference just by hitting [ENTER] in your terminal.  
  If not...you can force it to reload using `termtools reload` or just the elias `reload`.

### Customization options

You will export a _literal object_ containing these options, or a function that returns such an object.
You can extend a given theme, or the default theme will be used.

```js
{
    extends: 'basic'
}
```

While the default theme will have a _PS1_ like the first image in this documentation, the basic theme will look like this:

![Termtools basic theme](media/termtools-theme-basic.jpg)

#### aliases

An object containing the _command_ as the key, and the _instruction_ as the value.  
For example:

```js
{
    aliases: {
        foo: "echo bar"
    }
}
```

Will then, allow you to run in your terminal:

```sh
$ foo
bar
```

#### Decorators

You can remove/comment them from your custom settings if you want to keep it cleaner.  
This will allow you to customize some of the decorators we will use in your PS1.  
So far, they are:

- pathSeparator
- section
- git

You can use the code (`\uCODE`) for the following characters (available in the installed font).  
For example, the code "e0a0" can be used as `"\ue0a0"`:

![Termtool fontforge](media/fontforge.png)
(imported from https://github.com/ryanoasis/powerline-extra-symbols)

#### ps1

This is the part where you specify the rules for your PS1.  
It has two customization options: `parts` and `effects`.  
The effects are the style rules, applied for each part.

##### Parts

Every part of your PS1 has the `enabled` flag, allowing you to turn them on or off as you will.  
Besides that, all the properties also accept a `wrapper`, which is a string with a "$1". For example, in the "username", the wrapper "[$1]" for the user "felipe" becomes "[felipe]"
The available parts and their attributes special attributes are:

| Part name | Description | Extra options |
| battery | Shows the current battery state | |
| time | The current time | |
| userName | The currently logged user | | 
| string | Any given string you might wanna add | content: The content of the string | 
| machine | The machine name | |
| path | The current path (without basename) | *Options escribed bellow |
| basename | The current basename | |
| git | If the current directory is a repository, show the git information about it | 
| entry | The last character waiting for the user entry. Usually a "$" sign | content: A given string for it |
| readOnly | Shown when the current directory is readonly for the current user | |

##### Effects

For each part you used, you can apply effects.  
The available effects are:

- color*: The text color
- bgColor*: The background color
- bold: Sets text as bold
- italic: Tries to set the text as italic (not all terminals support it)
- underline: Underlines the text
- dim: Sets the text as dim
- separator: By default, will be the decorator you set as separator. If false, no separator will be used for that part. Can be used to customize the separator of one specific part of PS1

  > Values for both `color` and `bgColor` accept the colors from [chalk](https://github.com/chalk/chalk). You can also use _RGB_ colors starting with "#", for example `#f00`. But keep in mind that some hex values are not supported in some terminals.

#### Themes

Yes, we deliver _termtools_ with 6 builtin themes, they are:

- basic
- default
- hell
- sea
- pinkish
- round

You can easily move from one theme to another using the command

```
termtools set theme [theme-name]
```

Just be careful! It will replace your `~/.bash_profile.js` and, if you have done any customization to it, you will loose them.

  > If you have created a very nice theme and want to share, send us a pull request :)

### Aliases

- fixcamera: Fixes the camera when it is not loading (a known bug triggered in Google Chrome)
- ipin: Shows the internal IP addess
- ipout: Shows the IP facing the public network
- ip: Shows both internal and external IPs
- aliases: Shows the list of currently supported aliases
- back: Goes to the last path where you were
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
- checkout: `git checkout`. Used as `checkout mybranch`.
- push: `git push origin`. Use it like `push master`.
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
- about: Shows info on the current serve/session/user
- targz: Create a .tar.gz archive, using `zopfli`, `pigz` or `gzip` for compression
- googl/short: Shortens a URL using goo.gl service
- sizeof: Gives you the size of a file, or the total size of a directory
- hierarchy: Shows a tree of files ignoring `node_modules` and other temp files, using line numbers, pages and colors.
- hide-desktop-icons: Hide all the desktop icons (specially useful when presenting to an audience)
- show-desktop-icons: show all desktop icons
- chromekill: Kills all Google Chrome tabs to free some memory
- afk: Locks the screen, as you are Away From Keyboard
- path: Shows all the address in your `$PATH`, each one in a different line
- show-hidden-files: Show hidden files (MacOS only)
- hide-hidden-files: Hide hidden files (MacOS only)
- dog: Just like cat, but paginated and using line numbers
- ifactive: Shows all the active network connections
- amioffline: Answers "Yes" if you are offline, and "No" otherwise
- amionline: Answers "Yes" if you are online, and "No" otherwise
- desktop/desk: Equivalent to `cd ~/Desktop`
- docs/d/documents: Equivalent to `cd ~/Documents`
- downloads/down: Equivalent to `cd ~/Downloads`
- line: Writes a line (-) in terminal
- doubleline: Writes a double line (=) in terminal
- bold: Like `echo`, but outputs the text in _bold_.


