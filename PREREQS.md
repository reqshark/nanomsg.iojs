# prerequisite 1: install nanomsg c lib
```bash
# u need a c compiler like gcc, or on mac: xcode's llvm/clang
# and u need: python autoconf pkg-config libtool automake wget curl git, etc..
# get those with brew install on mac. apt-get on linux, or compile them..

$ git clone https://github.com/nanomsg/nanomsg.git nn && cd nn
$ ./autogen.sh && ./configure && make
$ make check
# if the check passes then
$ sudo make install

# if you're on linux. do not do this on mac:
$ sudo /sbin/ldconfig

# clean up
$ cd .. && rm -rf nn
```

# prerequisite 2: install iojs
until nvm is ready for `iojs` lets just hack functionality into a fake `v0.11.2`
```bash
# if ur not using nvm, here's how i install it:
$ git clone http://github.com/creationix/nvm.git ~/.nvm
$ echo -e "source ~/.nvm/nvm.sh" >> ~/.bashrc # add source line to your profile
$ source ~/.bashrc

# lets add iojs as an old v0.11 we dont care about
$ nvm i 0.11.2 && nvm alias default 0.11.2
$ cd ~/.nvm

# on linux:
$ wget https://iojs.org/dist/v1.0.2/iojs-v1.0.2-linux-x86.tar.gz
# or if you know your arch is linux x64:
$ wget https://iojs.org/dist/v1.0.2/iojs-v1.0.2-linux-x64.tar.gz

# for mac:
$ wget https://iojs.org/dist/v1.0.2/iojs-v1.0.2-darwin-x64.tar.gz

# untar and rename the right file inside your .nvm directory...
$ tar xzvf iojs-v1.xxx.whatever.tar.gz
$ rm -rf v0.11.13 && rm -rf iojs-v1.xxx.whatever.tar.gz
$ mv iojs-v1.xxx.whatever v0.11.2

$ node -v
```
