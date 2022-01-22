# Timer
Extension to keep track of your time ⏱.

Feel free to submit any issues you may have via the issue tracker.

## Installation

You can install locally.
```sh
npm i -g vsce

# in vsc-timer directory
vsce package
code --install-extension vsc-timer-0.0.0.vsix
```
### For use "code" in terminal
1. Launch VS Code.
2. Command + Shift + P to open the Command Palette.
3. Type shell command, to find the Shell Command: Install 'code' command in PATH and select to install it.
4. Restart your terminal.

It will soon be available on the marketplace.

## How it works

This extension is activated with a keyboard shortcut [`Ctrl+Shift+T`], or by typing the word `"timer"` into the command palette, which is called by a key combination [`Shift+Cmd+P`].

When extension is launched, enter needed time value in the format `"5s"`, where `"s"` is considered as seconds, or `"10m"`, where `"m"` stands for minutes, or `"2h"`, where `"h"` contemplates hours, and press `“Enter”`.

When activated, [`Ctrl+Shift+T`] may be called again to see what actions can be performed, e.g. `stop`, `pause` and `restart`.

**Enjoy!**
