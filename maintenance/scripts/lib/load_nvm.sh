#!/usr/bin/env sh

# In the hashbang line above, we use `sh` instead of `bash` as the script
# shell, since `sh` is more portable across systems. Be aware of differences
# with built-in functions and flow control syntax: e.g., `.` vs `source`
# notation, `[ ]` vs `[[ ]]` conditionals, etc.
# See: https://stackoverflow.com/a/5725402

# Setup NVM.
#
# We must reload it all scripts, as NVM expects to be run via a login or
# interactive user shell, and loads itself accordingly in ~/.bashrc . But
# scripts don't load files like this.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
