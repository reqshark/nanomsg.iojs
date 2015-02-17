1.1.9 / 2015-2-17
==================

* perf improvement with C++ [`RecvMsg : public NanAsyncWorker`](lib/nanomsg.cc) class
* start using tape for testing

1.1.0 / 2015-2-16
==================

* windows support
* remove `RecvStr()` C++ function

1.0.0 / 2015-2-12
==================

* **pipe all endpoints together,**  it's a new API!
* use `write()` in place of `send()`. `on('data',cb)` replaces `on('msg',cb)`
* combine sockets in new ways.
* discovery and development of `pipe()` method as just a flexible `zmq_proxy()` or `nn_device()`
* sockets inherit from `duplexify`, a fully duplexed transform of the `readable-stream` module.
* nanomsg.iøjs streams are domain, protocol, and transport agnostic sockets
* no longer inherit from `EventEmitter`, messages distribute `readable` or `writeable` instead
* perf tests confirm `Streams` inheritence switch does not impact in any meaningful way
* discovered earlier `stopBufferOverflow` bug associated with the option of the same name and resolved.
* `bufferOverflow` was caused by a timeout issue with closing sockets too soon.
* remove `asBuffer` option in favor of stream encoding conventions that have become idiomatic NodeJS

0.1.1 / 2015-2-10
==================

* new options api: `linger`, `sndbuf`, `rcvbuf`, `sndtimeo`, `rcvtimeo`, `reconn`, `maxreconn`, `sndprio`, `rcvprio`
* port the zeromq.node (zmq module) perf tests

0.1.0 / 2015-2-8
==================

* introduce `Writeable` stream for `send()` (complement `Readable` used in recv)
* improve `test/nanomsg.stream.js`, write data to the new `Writeable` stream
* add osx to travis plus overall improvements to CI matrix design
* add Node's new 0.12 release to test coverage
* add `getsockopt()` and `setsockopt()` native functions
* new dependency on `through2` module
* start API doc with `nano.socket()` function (begun within the readme)
* minor language fix in LICENSE

0.0.10 / 2015-01-28
==================

* add an option (stopBufferOverflow: true) to prevent the buffer overflow crash

0.0.9 / 2015-01-21
==================

 * asBuffer option to support native switches between strings and buffers
 * update send/recv functions for better buffer handling
 * force buffer lengths to be exact measurements passed to nn_send/nn_recv
 * ensure data sent as C strings are null/zero terminated
 * port a kernel multiplexer function to javascript (lib/getevent.h)
 * test multiple heterogeneous endpoints and add other cool tests

0.0.5 / 2015-01-20
==================

 * javascript streams (both standard and classic streams of node/iojs)
 * keep EventEmitter and Streams event mechanisms mutually exclusive

0.0.3 / 2015-01-19
==================

  * import experiments conducted in: https://github.com/reqshark/nmsg
