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

# API

### nano.socket(type, [options,])

Starts a new socket. The nanomsg socket can bind or connect to multiple heterogeneous endpoints as well as shutdown any of these established links.

#### `options`
* `'fam'` *(String, default: `'af_sp'`, or just `'af'` for short)*: determines the domain of the socket. `AF_SP` creates a standard full-blown SP socket. `AF_SP_RAW` is a raw SP socket. Pass `fam` string in lowercase if you don't want to use uppercase. The following strings are acceptable for setting up `raw`: `'raw'`, `'af_sp_raw'`, `'AF_SP_RAW'`. `Raw` sockets omit the end-to-end functionality found in `AF_SP` sockets and thus can be used to implement intermediary devices in SP topologies, see [nanomsg docs](http://nanomsg.org/v0.5/nn_socket.3.html) for additional info. Here's an example setting fam: `AF_SP` or `AF_SP_RAW`, and if fam is the only option, then pass a string like:
```js
nano.socket('bus','raw') || nano.socket('bus', { fam: 'AF_SP_RAW' } ) //raw
nano.socket('bus', {fam:'af'}) //default AF_SP family socket
```
* `'stream'` *(boolean, default: `false`)*: when `true`, the socket's stream property is a NodeJS Streams 1 and Streams 2 full duplex, meaning `Readable` and `Writeable` compatibility extends from `node v0.10 - v0.12`. The principal stability target is always `iojs streams`, a.k.a. the `readable-stream` module fathered by Isaacs. See example section above or the [stream API docs](https://github.com/reqshark/nanomsg.iojs#a-writeable-and-a-readable-stream-true) below for additional info.
* `'asBuffer'` *(boolean, default: `true`)*: return the `value` of a received message as a `String` or a NodeJS `Buffer` object. Note that converting from a `Buffer` to a `String` incurs a cost so if you need a `String` (and the `value` can legitimately become a UFT8 string) then you should fetch it as one with `asBuffer: false` and you'll avoid this conversion cost.
* `'stopBufferOverflow'` *(boolean, default: `false`)*: this is real bad. you try to get a message out and the kernel abort traps your process. this option must be set to true on certain modern kernels. this sucks and will be removed as soon as the `WIP` i/o multiplexing approach is improved and the fix is verified.
* `'tcpnodelay'` *(boolean, default: `false`)*: see [`socket.tcpnodelay(boolean)`](https://github.com/reqshark/nanomsg.iojs#sockettcpnodelayboolean).
* `'linger'` *(number, default: `1000`)*: see [`socket.linger(duration)`](https://github.com/reqshark/nanomsg.iojs#socketlingerduration).
* `'sndbuf'` *(number, default: `128kB`)*: see [`socket.sndbuf(size)`](https://github.com/reqshark/nanomsg.iojs#socketsndbufsize).
* `'rcvbuf'` *(number, default: `128kB`)*: see [`socket.rcvbuf(size)`](https://github.com/reqshark/nanomsg.iojs#socketrcvbufsize).
* `'sndtimeo'` *(number, default: `-1`)*: see [`socket.sndtimeo(duration)`](https://github.com/reqshark/nanomsg.iojs#socketsndtimeoduration).
* `'rcvtimeo'` *(number, default: `-1`)*: see [`socket.rcvtimeo(duration)`](https://github.com/reqshark/nanomsg.iojs#socketrcvtimeoduration).
* `'reconn'` *(number, default: `100`)*: see [`socket.reconn(duration)`](https://github.com/reqshark/nanomsg.iojs#socketreconnduration).
* `'maxreconn'` *(number, default: `0`)*: see [`socket.maxreconn(duration)`](https://github.com/reqshark/nanomsg.iojs#socketmaxreconnduration).
* `'sndprio'` *(number, default: `0`)*: see [`socket.sndprio(priority)`](https://github.com/reqshark/nanomsg.iojs#socketsndpriopriority).
* `'rcvprio'` *(number, default: `0`)*: see [`socket.rcvprio(priority)`](https://github.com/reqshark/nanomsg.iojs#socketrcvpriopriority).

### nano.version

`require('iojs-nanomsg').version` *(Number)*: the libnanomsg beta version installed

### nano.versionstr

`require('iojs-nanomsg').versionstr` *(String)*: revealed in nanomsg beta versioning language

### API available after socket creation:

### socket.type

*(String)*: Indicates what type of socket you have.

### socket.close()

*(Function)*: Closes the socket. Any buffered inbound messages that were not yet received by the application will be discarded. The nanomsg library will try to deliver any outstanding outbound messages for the time specified by `linger`.

### socket.shutdown(address)

*(Function, param: String)*: Removes an endpoint established  by calls to `bind()` or `connect()`. The nanomsg library will try to deliver any outstanding outbound messages to the endpoint for the time specified by `linger`.

```js
socket.shutdown('tcp://127.0.0.1:5555')
```

### socket.bind(address)

*(Function, param: String)*: Adds a local endpoint to the socket. The endpoint can be then used by other applications to connect.

`bind()` (or `connect()`) may be called multiple times on the same socket thus allowing the socket to communicate with multiple heterogeneous endpoints.

```js
socket.bind('tcp://127.0.0.1:5555')
```

*<sub>When binding over TCP, allow up to `50ms` for the operation to complete.</sub>*

### socket.connect(address)

*(Function, param: String)*: Adds a remote endpoint to the socket. The nanomsg library would then try to connect to the specified remote endpoint.

`connect()` (as well as `bind()`) may be called multiple times on the same socket thus allowing the socket to communicate with multiple heterogeneous endpoints.

```js
socket.connect('tcp://127.0.0.1:5555')
```

*<sub>When connecting over TCP allow `100ms` or more for the operation to complete.</sub>*

### socket addresses

*(Strings)*

Socket address strings consist of two parts as follows: `transport://address`. The transport specifies the underlying transport protocol to use. The meaning of the address part is specific to the underlying transport protocol.
* *TCP transport mechanism*: `'tcp://127.0.0.1:65000'` When binding a TCP socket, address of the form `tcp://interface:port` should be used. Port is the TCP port number to use. Interface is either: `IPv4` or `IPv6` address of a local network interface, or DNS name of the remote box. It is possible to use named interfaces like `eth0`. For more info see [nanomsg docs](http://nanomsg.org/v0.5/nn_tcp.7.html).
* *in-process transport mechanism*: `'inproc://bar'` The `inproc` transport allows messages between threads or modules inside a process. In-process address is an arbitrary case-sensitive string preceded by `inproc://` protocol specifier. All in-process addresses are visible from any module within the process. They are not visible from outside of the process. The overall buffer size for an inproc connection is determined by `rcvbuf` socket option on the receiving end of the connection. `sndbuf` is ignored. In addition to the buffer, one message of arbitrary size will fit into the buffer. That way, even messages larger than the buffer can be transfered via inproc connection.
* *inter-process transport mechanism*: `'ipc:///tmp/foo.ipc'` The `ipc` transport allows for sending messages between processes within a single box. The nanomsg implementation uses native IPC mechanism provided by the local operating system and the IPC addresses are thus OS-specific. On POSIX-compliant systems, UNIX domain sockets are used and IPC addresses are file references. Note that both relative (`ipc://test.ipc`) and absolute (`ipc:///tmp/test.ipc`) paths may be used. Also note that access rights on the IPC files must be set in such a way that the appropriate applications can actually use them. On Windows, named pipes are used for IPC. The Windows IPC address is an arbitrary case-insensitive string containing any character except for backslash: internally, address `ipc://test` means that named pipe `\\.\pipe\test` will be used.

# sending and receiving APIs
Two event mechanisms are available: `EventEmitter` or `Streams`, but in practice there are four. This is because each mechanism applied to the socket has a potential `send` and `recv` operation. Though not every socket is capable of both, most socket types are, and besides: to interface with any one side of the link requires some understanding of the other.

Lets look at classic `EventEmitter` `send`/`recv` then, respectively, `Writeable`/`Readable`.

**Only `streams` or `events` (not both) are available on the socket**, since it would otherwise consume useless I/O to transmit duplicate event data at once across each mechanism.

## EventEmitter `{stream: false}`

### socket.send(msg)
*(Function, param: String or Buffer)*: The `send()` function immediately sends a message `msg` containing the data to any endpoint(s) determined by the particular socket type.

```js
socket.send('hello from nanømsg!')
```

### socket.on(msg,[callback,])
*(Function, param order: String, Function)*: The `on()` function is an event listener registered with the `nanomsg c lib` that emits `'msg'` events. To receive messages, pass `'msg'` with a callback containing a single data parameter.

```js
socket.on('msg', function (msg) {
  console.log(String(msg)) //'hello from nanømsg!'
})
```
## a writeable and a readable `{stream: true}`

### socket.stream
*(Object, properties: Readable, Writeable)*: the stream property is a full duplex pipeable to and from any consumer. It is not available by default and requires that the option `{stream: true}` be passed along with the socket type at the outset.

### socket.stream.write(msg)
*(Function, param: String or Buffer)*: A `write()` function is equivalent to `socket.send()` when called directly.

```js
var stream = socket.stream
stream.write('hello from nanømsg!')
```

The `write()` function is automatically invoked as a `Writeable` consumer of some other `Readable` stream. In that case a `pipe()` method can be used to transmit from a readable data source such that the flow distributes to endpoint(s) determined by the particular socket type.

```js
var fs = require('fs')
var source = fs.createReadStream(__dirname + 'filename.ext')

source.pipe(socket.stream)
```

### socket.stream.on(data,[callback,])
*(Function, param order: String, Function)*: The `Readable` stream's `on()` function is an event listener registered with the `nanomsg c lib` that emits `'data'` events. To receive messages, pass `'data'` with a callback containing a single data parameter.

```js
var stream = socket.stream
stream.on('data', function (msg) {
  console.log(String(msg)) //'hello from nanømsg!'
})
```

the readable stream's `data` event is automatically invoked when piped to a `Writeable` or `Transform` consumer stream. Here `msgprocessor` is a transform you could pipe to a writeable or the next transform:

```js
var through = require('through')
var stream = socket.stream

var msgprocessor = through(function(msg){
  var str = String(msg); console.log(str) //'hello from nanømsg!'
  this.queue(str + ' and cheers from nanomsg.iojs!')
})

stream.pipe(msgprocessor)
```
### socket.tcpnodelay(boolean)

*(Function, param: Boolean, default: false)*: When set, disables Nagle’s algorithm. It also disables delaying of TCP acknowledgments. Using this option improves latency at the expense of throughput.

Pass no parameter for current tcp nodelay setting.

```js
//default
console.log(socket.tcpnodelay()) //tcp nodelay: off

socket.tcpnodelay(true) //disabling Nagle's algorithm

console.log(socket.tcpnodelay()) //tcp nodelay: on
```

### socket.linger(duration)

*(Function, param: Number, default: `1000`)*: Specifies how long the socket should try to send pending outbound messages after `socket.close()` or `socket.shutdown()` is called, in milliseconds.

Pass no parameter for the linger duration.

```js
socket.linger(5000)
console.log(socket.linger()) //5000
```

### socket.sndbuf(size)

*(Function, param: Number, default: `128kB`)*: Size of the send buffer, in bytes. To prevent blocking for messages larger than the buffer, exactly one message may be buffered in addition to the data in the send buffer.

Pass no parameter for the socket's send buffer size.

```js
socket.sndbuf(131072)
console.log(socket.sndbuf()) // 131072
```

### socket.rcvbuf(size)

*(Function, param: Number, default: `128kB`)*: Size of the receive buffer, in bytes. To prevent blocking for messages larger than the buffer, exactly one message may be buffered in addition to the data in the receive buffer.

Pass no parameter for the socket's receive buffer size.

```js
socket.rcvbuf(20480)
console.log(socket.rcvbuf()) // 20480
```

### socket.sndtimeo(duration)

*(Function, param: Number, default: `-1`)*: The timeout for send operation on the socket, in milliseconds.

Pass no parameter for the socket's send timeout.

```js
socket.sndtimeo(200)
console.log(socket.sndtimeo()) // 200
```

### socket.rcvtimeo(duration)

*(Function, param: Number, default: `-1`)*: The timeout for recv operation on the socket, in milliseconds.

Pass no parameter for the socket's recv timeout.

```js
socket.rcvtimeo(50)
console.log(socket.rcvtimeo()) // 50
```

### socket.reconn(duration)

*(Function, param: Number, default: `100`)*: For connection-based transports such as TCP, this option specifies how long to wait, in milliseconds, when connection is broken before trying to re-establish it. Note that actual reconnect interval may be randomized to some extent to prevent severe reconnection storms.

Pass no parameter for the socket's `reconnect` interval.

```js
socket.reconn(600)
console.log(socket.reconn()) // 600
```

### socket.maxreconn(duration)

*(Function, param: Number, default: `0`)*: <strong>Only to be used in addition to `socket.reconn()`.</strong> `maxreconn()` specifies maximum reconnection interval. On each reconnect attempt, the previous interval is doubled until `maxreconn` is reached. Value of zero means that no exponential backoff is performed and reconnect interval is based only on `reconn`. If `maxreconn` is less than `reconn`, it is ignored.

Pass no parameter for the socket's `maxreconn` interval.

```js
socket.maxreconn(60000)
console.log(socket.maxreconn()) // 60000
```

### socket.sndprio(priority)

*(Function, param: Number, default: `8`)*: Sets outbound priority for endpoints subsequently added to the socket.

This option has no effect on socket types that send messages to all the peers. However, if the socket type sends each message to a single peer (or a limited set of peers), peers with high priority take precedence over peers with low priority.

Highest priority is 1, lowest is 16. Pass no parameter for the socket's current outbound priority.

```js
socket.sndprio(2)
console.log(socket.sndprio()) // 2
```

### socket.rcvprio(priority)

*(Function, param: Number, default: `8`)*: Sets inbound priority for endpoints subsequently added to the socket.

This option has no effect on socket types that are not able to receive messages.

When receiving a message, messages from peer with higher priority are received before messages from peer with lower priority.

Highest priority is 1, lowest is 16. Pass no parameter for the socket's current inbound priority.

```js
socket.rcvprio(10)
console.log(socket.rcvprio()) // 10
```

# test
on **unix** systems:
```bash
$ make clean && make && make check
```
<sub>*disabling node v0.08.x for now... but v0.10 and up should be fine*</sub>

# performance
run benchmarks:
```bash
$ make perf
```

for more info how to do that and your own custom comparisons check out: [running benchmarks](https://github.com/JustinTulloss/zeromq.node#running-benchmarks)

and if you want you can also run:
```bash
$ make bench
```
:)
