# nanomsg sockets as javascript streams
[![Build Status](https://travis-ci.org/reqshark/nanomsg.iojs.svg?branch=master)](https://travis-ci.org/reqshark/nanomsg.iojs) &nbsp;&nbsp;&nbsp;&nbsp; [![npmbadge](https://nodei.co/npm/iojs-nanomsg.png?mini=true)](https://www.npmjs.com/package/iojs-nanomsg)
* pipe all endpoints together
* nanomsg.iøjs streams are domain, protocol, and transport agnostic
* combine sockets in new ways
* the socket's `pipe()` method is basically a more flexible `zmq_proxy()` or `nn_device()`

# prerequisites

install [`nanomsg c lib`](http://nanomsg.org/development.html) and have `iojs` or `node v0.10 - v0.12`

# install
```bash
$ npm install iojs-nanomsg
```

# example
```js
var nano = require('iojs-nanomsg')
var pub   = nano.socket('pub'),       push  = nano.socket('push')
var sub   = nano.socket('sub'),       pull  = nano.socket('pull')

pub.bind('tcp://127.0.0.1:3333');     push.bind('tcp://127.0.0.1:4444')
sub.connect('tcp://127.0.0.1:3333');  pull.connect('tcp://127.0.0.1:4444')

sub.setEncoding('utf8') //sub socket will get utf8 strings instead of Buffers

sub.on('data', function (msg) {
  console.log(msg) //'hello from a push socket!'
})

pull.pipe(pub) //pipe readable sockets to any writeable socket or stream

setInterval( function(){ push.write('hello from a push socket!') }, 100 )
```

# API

### nano.socket(type, [options,])

Starts a new socket. The nanomsg socket can bind or connect to multiple heterogeneous endpoints as well as shutdown any of these established links.

#### `options`
* `'fam'` *(String, default: `'af_sp'`)*: determines the domain of the socket. `AF_SP` creates a standard full-blown SP socket. `AF_SP_RAW` family sockets operate over internal network protocols and interfaces. Raw sockets omit the end-to-end functionality found in `AF_SP` sockets and thus can be used to implement intermediary devices in SP topologies, see [nanomsg docs](http://nanomsg.org/v0.5/nn_socket.3.html) or consult your man page entry `socket(2)` for more info.
```js
//ex. starting raw sockets
nano.socket('bus','raw') || nano.socket('bus', { fam: 'AF_SP_RAW' } )
```
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

### socket.type

*(String)*: Indicates what type of socket you have.

### socket.shutdown(address)

*(Function, param: String)*: Removes an endpoint established  by calls to `bind()` or `connect()`. The nanomsg library will try to deliver any outstanding outbound messages to the endpoint for the time specified by `linger`.

```js
socket.shutdown('tcp://127.0.0.1:5555')
```

### socket.bind(address)

*(Function, param: String)*: Adds a local endpoint to the socket. The endpoint can be then used by other applications to connect.

`bind()` (or `connect()`) may be called multiple times on the same socket thus allowing the socket to communicate with multiple heterogeneous endpoints.

```js
socket.bind('tcp://eth0:5555')
```

*<sub>recommend checking your machine's `ifconfig` first before using a named interface.</sub>*

### socket.connect(address)

*(Function, param: String)*: Adds a remote endpoint to the socket. The nanomsg library would then try to connect to the specified remote endpoint.

`connect()` (as well as `bind()`) may be called multiple times on the same socket thus allowing the socket to communicate with multiple heterogeneous endpoints.

```js
socket.connect('tcp://127.0.0.1:5555')
```

*<sub>When connecting over remote TCP allow `100ms` or more depending on round trip time for the operation to complete.</sub>*

##### *[a note on address strings](docs/address_strings.markdown)*

### socket.close()

*(Function)*: Closes the socket. Any buffered inbound messages that were not yet received by the application will be discarded. The nanomsg library will try to deliver any outstanding outbound messages for the time specified by `linger`.

## sending and receiving: writeable and readable

### socket.write(msg)
*(Function, param: String or Buffer)*: A `write()` function is equivalent to the `socket.send()` in [node.zeromq](https://github.com/JustinTulloss/zeromq.node) when called directly.

```js
socket.write('hello from nanømsg!')
```

`write()` is automatically invoked during `Writeable` consumption of some other `Readable` stream. In that case a `pipe()` method can be used to transmit from a readable data source. The flow of data distributes to endpoint(s) determined by the particular socket type.

```js
var fs = require('fs')
var source = fs.createReadStream(__dirname + 'filename.ext')

source.pipe(socket)
```

### socket.on(data, callback)
*(Function, param order: String, Function)*: The `Readable` stream's `on()` function is an event listener registered with the `nanomsg c lib` that emits `'data'` events. To receive messages, pass the string `'data'` followed a callback containing a single data parameter.

```js
socket.on('data', function (msg) {
  console.log(String(msg)) //'hello from nanømsg!'
})
```

the readable stream's `data` event is automatically invoked when piped to a `Writeable` or `Transform` consumer stream. Here `msgprocessor` is a transform you could pipe to a writeable or the next transform:

```js
var through = require('through')

var msgprocessor = through(function(msg){
  var str = String(msg); console.log(str) //'hello from nanømsg!'
  this.queue(str + ' and cheers from nanomsg.iojs!')
})

socket.pipe(msgprocessor)
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
