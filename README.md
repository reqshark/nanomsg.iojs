# nanomsg.iojs
nanomsg for iojs  https://github.com/nanomsg/nanomsg

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

//start an interval for broadcasts
setInterval(function(){
  pub.send('hello from nanømsg!')
}, 100)

//if you want a pipeable stream pass `{ stream: true }` with the socket type
var sub = nano.socket('sub', { stream: true} )

//stream option disables onmessage emitter (for perf reasons)
//there's a readable/writable stream depending on the socket type
var subStream = sub.stream

sub.connect(addr)

subStream.on('data',function(msg){
  console.log(String(msg))
})
```

#test
```bash
$ make clean && make && make check
```
tested on node v0.08.x and up
