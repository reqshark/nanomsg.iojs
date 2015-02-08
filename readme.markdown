# nanomsg for iøjs
[![Build Status](https://travis-ci.org/reqshark/nanomsg.iojs.svg?branch=master)](https://travis-ci.org/reqshark/nanomsg.iojs) &nbsp;&nbsp;&nbsp;&nbsp; [![npmbadge](https://nodei.co/npm/iojs-nanomsg.png?mini=true)](https://www.npmjs.com/package/iojs-nanomsg)

#### move `strings` or `buffers` by way of `streams` or `EventEmitter`

# prerequisites

install [`nanomsg c lib`](http://nanomsg.org/development.html) and have `iojs` or `node v0.10 - v0.12`

# install
```bash
$ npm i iojs-nanomsg
```

# example
```js
var nano = require('iojs-nanomsg')
var pub = nano.socket('pub')
var sub = nano.socket('sub', {
  stream: true,
  asBuffer: false
})

pub.bind('tcp://127.0.0.1:5555')
sub.connect('tcp://127.0.0.1:5555')

var readable = sub.stream

readable.on('data',function(msg){
  console.log(msg)
})

setInterval(function(){
  pub.send('hello from nanømsg!')
},100)
```

# philosophy: `setsockopts` early
all new sockets, like `var s = nano.socket('req')`, accept an options param to set the socket's:
* `send`/`recv` mechanisms: *a classic `'msg'` event listener, `send()`, or a `Readable`/`Writeable` stream*
* message formats: get V8's `utf8` `String` or a node `Buffer` (default) on inbound socket `recv()`
* standard `sockopt` values and other protocol settings

*<sub>adjust any libnanomsg custom socket options later using `setsockopt()` and `getsockopt()`</sub>*

# API

### nano.socket(type, [options,])

Starts a new socket. The nanomsg socket can bind or connect to multiple heterogenius endpoints.

#### `options`
* `'fam'` *(String, default: `'af_sp'`, or just `'af'` for short)*: determines the domain of the socket. `AF_SP` creates a standard full-blown SP socket. `AF_SP_RAW` is a raw SP socket. Pass `fam` string in lowercase if you don't want to use uppercase. The following strings are acceptable for setting up `raw`: `'raw'`, `'af_sp_raw'`, `'AF_SP_RAW'`. `Raw` sockets omit the end-to-end functionality found in `AF_SP` sockets and thus can be used to implement intermediary devices in SP topologies, see [http://nanomsg.org/v0.5/nn_socket.3.html](nanomsg docs) for additional info. Here's an example setting fam: `AF_SP` or `AF_SP_RAW`, and if fam is the only option, then pass a string like:
```js
nano.socket('bus','raw') || nano.socket('bus', { fam: 'AF_SP_RAW' } ) //raw
nano.socket('bus', {fam:'af'}) //default AF_SP family socket
```
* `'stream'` *(boolean, default: `false`)*: when true, we'll get an iojs interface to nanomsg sockets with a pipeable stream. It's officially a NodeJS Streams 1 and Streams 2 full duplex, meaning `Readable` and `Writeable` compatibility extends from `node v0.10 - v0.12`. However, the principal stability target is always `iojs streams`, a.k.a. the `readable-stream` module fathered by Isaacs. See example section above.
* `'asBuffer'` *(boolean, default: `true`)*: return the `value` of a received message as a `String` or a NodeJS `Buffer` object. Note that converting from a `Buffer` to a `String` incurs a cost so if you need a `String` (and the `value` can legitimately become a UFT8 string) then you should fetch it as one with `asBuffer: false` and you'll avoid this conversion cost.

# test
on **unix** systems:
```bash
$ make clean && make && make check
```
<sub>*disabling node v0.08.x for now... but v0.10 and up should be fine*</sub>
