#!/bin/bash
nvm unload
rm -rf ~/.nvm && rm -rf ~/.npm && rm -rf ~/.bower
git clone https://github.com/creationix/nvm.git ~/.nvm
source ~/.nvm/nvm.sh
nvm i iojs
