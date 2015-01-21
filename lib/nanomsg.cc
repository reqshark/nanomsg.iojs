/*
 * free and unencumbered software released into the public domain.
 */

#include "node.h"
#include "node_buffer.h"
#include "nan.h"

extern "C" {
  #include <nanomsg/nn.h>
  #include <nanomsg/pubsub.h>
  #include <nanomsg/pipeline.h>
  #include <nanomsg/bus.h>
  #include <nanomsg/pair.h>
  #include <nanomsg/reqrep.h>
  #include <nanomsg/survey.h>
  #include <nanomsg/ipc.h>
  #include <nanomsg/tcp.h>
  #include <nanomsg/inproc.h>
  #include "getevents.h"
}

using v8::Function;
using v8::FunctionTemplate;
using v8::Handle;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

#define S args[0].As<Number>()-> IntegerValue()
#define ret NanReturnValue
#define utf8 v8::String::Utf8Value
#define METHOD(C, S) C->Set(NanNew(# S), NanNew<FunctionTemplate>(S)->GetFunction());
#define CONSTANT(C, S) C->Set(NanNew(# S), NanNew<Number>(S));

#include <string>

#if (NODE_MINOR_VERSION < 11)
#include "methods.node.h"
#else
#include "methods.iojs.h"
#endif


extern "C" void
exports(v8::Handle<v8::Object> e) {
  METHOD(e, Socket)
  METHOD(e, Close)
  METHOD(e, Connect)
  METHOD(e, Bind)
  METHOD(e, Send)
  METHOD(e, Recv)
  METHOD(e, RecvStr)
  METHOD(e, multiplexer)

  // SP address families
  CONSTANT(e, AF_SP)
  CONSTANT(e, AF_SP_RAW)

  // Socket option levels
  CONSTANT(e, NN_SOL_SOCKET)

  // Generic socket options (NN_SOL_SOCKET level)
  CONSTANT(e, NN_LINGER)
  CONSTANT(e, NN_SNDBUF)
  CONSTANT(e, NN_RCVBUF)
  CONSTANT(e, NN_SNDTIMEO)
  CONSTANT(e, NN_RCVTIMEO)
  CONSTANT(e, NN_RECONNECT_IVL)
  CONSTANT(e, NN_RECONNECT_IVL_MAX)
  CONSTANT(e, NN_SNDPRIO)
  CONSTANT(e, NN_RCVPRIO)
  CONSTANT(e, NN_SNDFD)
  CONSTANT(e, NN_RCVFD)
  CONSTANT(e, NN_DOMAIN)
  CONSTANT(e, NN_PROTOCOL)
  CONSTANT(e, NN_IPV4ONLY)
  CONSTANT(e, NN_SOCKET_NAME)

  // Ancillary data
  CONSTANT(e, PROTO_SP)
  CONSTANT(e, SP_HDR)

  // Mutliplexing support
  CONSTANT(e, NN_POLLIN)
  CONSTANT(e, NN_POLLOUT)

  // Socket types
  CONSTANT(e, NN_SURVEYOR)
  CONSTANT(e, NN_RESPONDENT)
  CONSTANT(e, NN_REQ)
  CONSTANT(e, NN_REP)
  CONSTANT(e, NN_PAIR)
  CONSTANT(e, NN_PUSH)
  CONSTANT(e, NN_PULL)
  CONSTANT(e, NN_PUB)
  CONSTANT(e, NN_SUB)
  CONSTANT(e, NN_BUS)
}

NODE_MODULE(nanomsg, exports)
