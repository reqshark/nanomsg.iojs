# nanomsg for iøjs
[![Build Status](https://travis-ci.org/reqshark/nanomsg.iojs.svg?branch=master)](https://travis-ci.org/reqshark/nanomsg.iojs) &nbsp;&nbsp;&nbsp;&nbsp; [![npmbadge](https://nodei.co/npm/iojs-nanomsg.png?mini=true)](https://www.npmjs.com/package/iojs-nanomsg)
  https://github.com/nanomsg/nanomsg

# description
an iojs interface to nanomsg sockets with a pipeable stream option.

# prerequisites

install `nanomsg c lib` and `iojs`.

# install
```bash
$ npm i iojs-nanomsg
```

# use
```js
var nano = require('iojs-nanomsg')
var pub = nano.socket('pub')
var addr = 'tcp://127.0.0.1:5555'

pub.bind(addr)

//start a broadcast interval
setInterval(function(){
  pub.send('hello from nanømsg!')
}, 100)

var sub1 = nano.socket('sub',{
  //set asBuffer option for strings. default is true
  asBuffer:false
})
sub1.on('msg',function(msg){
  //local handle converted to V8::String direct from nanomsg nn_recv()
  console.log(msg)
})
sub1.connect(addr)

var sub2 = nano.socket('sub', {
  //for a pipeable stream pass `{ stream: true }` with the socket type
  stream: true
})

//stream option disables onmessage emitter (for perf reasons)
//there's a readable/writable stream depending on the socket type
var subStream = sub2.stream
sub2.connect(addr)

subStream.on('data',function(msg){
  console.log(String(msg))
})
```

#test
```bash
$ make clean && make && make check
```
tested on node v0.08.x and up
