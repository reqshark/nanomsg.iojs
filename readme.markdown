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
* `send`/`recv` mechanisms: *event listener, `send()`, or a `Readable`/`Writeable` stream*
* msg formats: get V8's `utf8` `String` or a node `Buffer` on inbound socket `recv()`
* standard `sockopt` values and other protocol settings

*<sub>adjust any libnanomsg custom socket options later using `setsockopt()` and `getsockopt()`</sub>*

# API

### nano.socket(type, [options,])

Starts a new socket. The nanomsg socket can bind or connect to multiple heterogeneous endpoints as well as shutdown any of these established links.

#### `options`
* `'fam'` *(String, default: `'af_sp'`, or just `'af'` for short)*: determines the domain of the socket. `AF_SP` creates a standard full-blown SP socket. `AF_SP_RAW` is a raw SP socket. Pass `fam` string in lowercase if you don't want to use uppercase. The following strings are acceptable for setting up `raw`: `'raw'`, `'af_sp_raw'`, `'AF_SP_RAW'`. `Raw` sockets omit the end-to-end functionality found in `AF_SP` sockets and thus can be used to implement intermediary devices in SP topologies, see [nanomsg docs](http://nanomsg.org/v0.5/nn_socket.3.html) for additional info. Here's an example setting fam: `AF_SP` or `AF_SP_RAW`, and if fam is the only option, then pass a string like:
```js
nano.socket('bus','raw') || nano.socket('bus', { fam: 'AF_SP_RAW' } ) //raw
nano.socket('bus', {fam:'af'}) //default AF_SP family socket
```
* `'stream'` *(boolean, default: `false`)*: when true, we'll get an iojs interface to nanomsg sockets with a pipeable stream. It's officially a NodeJS Streams 1 and Streams 2 full duplex, meaning `Readable` and `Writeable` compatibility extends from `node v0.10 - v0.12`. However, the principal stability target is always `iojs streams`, a.k.a. the `readable-stream` module fathered by Isaacs. See example section above.
* `'asBuffer'` *(boolean, default: `true`)*: return the `value` of a received message as a `String` or a NodeJS `Buffer` object. Note that converting from a `Buffer` to a `String` incurs a cost so if you need a `String` (and the `value` can legitimately become a UFT8 string) then you should fetch it as one with `asBuffer: false` and you'll avoid this conversion cost.
* `'stopBufferOverflow'` *(boolean, default: `false`)*: this is real bad. you try to get a message out and the kernel abort traps your process. this option must be set to true on certain modern kernels. this sucks and will be removed as soon as the `WIP` i/o multiplexing approach is improved and the fix is verified.
* `'linger'` *(number, default: `1000`)*: Specifies how long the socket should try to send pending outbound messages after `socket.close()` or `socket.shutdown()` is called, in milliseconds. Once `nano.socket()` gets called use `socket.linger()` function to adjust the number.

### nano.version

`require('iojs-nanomsg').version` *(Number)*: the libnanomsg beta version installed

### nano.versionstr

`require('iojs-nanomsg').versionstr` *(String)*: revealed in nanomsg beta versioning language

### API available after socket creation:

### socket.type

*(String)*

Indicates what type of socket you have.

### socket.close()

*(Function)*

Closes the socket. Any buffered inbound messages that were not yet received by the application will be discarded. The nanomsg library will try to deliver any outstanding outbound messages for the time specified by `NN_LINGER` socket option.

### socket.shutdown(address)

*(Function, param: String)*

```js
socket.shutdown('tcp://127.0.0.1:5555')
```

Endpoint specific revert of calls to `bind()` or `connect()`. The nanomsg library will try to deliver any outstanding outbound messages to the endpoint for the time specified by `NN_LINGER` socket option.

### socket.bind(address)

*(Function, param: String)*

```js
socket.bind('tcp://127.0.0.1:5555')
```

Adds a local endpoint to the socket. The endpoint can be then used by other applications to connect.

`bind()` (or `connect()`) may be called multiple times on the same socket thus allowing the socket to communicate with multiple heterogeneous endpoints.

When binding over TCP, allow up to `50ms` (milliseconds) for the operation to complete.

### socket.connect(address)

*(Function, param: String)*

```js
socket.connect('tcp:127.0.0.1:5555')
```

Adds a remote endpoint to the socket. The nanomsg library would then try to connect to the specified remote endpoint.

`connect()` (as well as `bind()`) may be called multiple times on the same socket thus allowing the socket to communicate with multiple heterogeneous endpoints.

When connecting over TCP, allow up to `100ms` (milliseconds) for the operation to complete, or more time depending on roundtrip latency and network conditions.

### socket addresses

*(Strings)*

Socket address strings consist of two parts as follows: `transport://address`. The transport specifies the underlying transport protocol to use. The meaning of the address part is specific to the underlying transport protocol.
* *TCP transport mechanism*: `'tcp://127.0.0.1:65000'` When binding a TCP socket, address of the form `tcp://interface:port` should be used. Port is the TCP port number to use. Interface is either: `IPv4` or `IPv6` address of a local network interface, or DNS name of the remote box. It is possible to use named interfaces like `eth0`. For more info see [nanomsg docs](http://nanomsg.org/v0.5/nn_tcp.7.html).
* *in-process transport mechanism*: `'inproc://bar'` The `inproc` transport allows messages between threads or modules inside a process. In-process address is an arbitrary case-sensitive string preceded by `inproc://` protocol specifier. All in-process addresses are visible from any module within the process. They are not visible from outside of the process. The overall buffer size for an inproc connection is determined by `NN_RCVBUF` socket option on the receiving end of the connection. `NN_SNDBUF` socket option is ignored. In addition to the buffer, one message of arbitrary size will fit into the buffer. That way, even messages larger than the buffer can be transfered via inproc connection.
* *inter-process transport mechanism*: `'ipc:///tmp/foo.ipc'` The `ipc` transport allows for sending messages between processes within a single box. The nanomsg implementation uses native IPC mechanism provided by the local operating system and the IPC addresses are thus OS-specific. On POSIX-compliant systems, UNIX domain sockets are used and IPC addresses are file references. Note that both relative (`ipc://test.ipc`) and absolute (`ipc:///tmp/test.ipc`) paths may be used. Also note that access rights on the IPC files must be set in such a way that the appropriate applications can actually use them. On Windows, named pipes are used for IPC. The Windows IPC address is an arbitrary case-insensitive string containing any character except for backslash: internally, address `ipc://test` means that named pipe `\\.\pipe\test` will be used.

### socket.linger(amount)

*(Function, param: Number)*

```js
socket.linger(5000)
```

Specifies how long the socket should try to send pending outbound messages after `socket.close()` or `socket.shutdown()` is called, in milliseconds.

### socket.check(option)

*(Function, param: String)*

```js
socket.check('linger')
```

Returns a value for the option you check.


# test
on **unix** systems:
```bash
$ make clean && make && make check
```
<sub>*disabling node v0.08.x for now... but v0.10 and up should be fine*</sub>
