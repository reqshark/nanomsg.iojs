# nanomsg.iojs
nanomsg for iojs  https://github.com/nanomsg/nanomsg

# description
not ready yet.

# prerequisite: install nanomsg c lib
```bash
# u need a c compiler like gcc, or on mac: xcode's llvm/clang
# and u need: python autoconf pkg-config libtool automake
# get those with brew install on mac. apt-get on linux, or compile them..

$ git clone https://github.com/nanomsg/nanomsg.git nn && cd nn

$ ./autogen.sh && ./configure && make
$ make check
$ sudo make install

# if you're on linux. do not do this on mac:
$ sudo /sbin/ldconfig

# clean up
$ cd .. && rm -rf nn
```

# install
```bash
$ npm i iojs-nanomsg
```

# use
```js
var nn = require('iojs-nanomsg')
```

#test
```bash
$ make clean && make && make check
```
