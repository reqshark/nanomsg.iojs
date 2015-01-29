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
