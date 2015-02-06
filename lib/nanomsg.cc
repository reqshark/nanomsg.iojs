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

#if NN_VERSION_CURRENT < 1
  #if NN_VERSION_REVISION < 1
  #define NN_VERSION 1
  #else
  #define NN_VERSION 2
  #endif
#else
  #if NN_VERSION_CURRENT < 2
  #define NN_VERSION 3
  #elif NN_VERSION_REVISION < 1
  #define NN_VERSION 4
  #else
  #define NN_VERSION 5
  #endif
#endif

using v8::Function;
using v8::FunctionTemplate;
using v8::Handle;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

#define ret NanReturnValue
#define utf8 v8::String::Utf8Value
#define S args[0].As<Number>()-> IntegerValue()
#define NC(C,S) C->Set(NanNew(# S), NanNew<Number>(S));
#define T(C,S)C->Set(NanNew(# S),NanNew<FunctionTemplate>(S)->GetFunction());

#include <string>

#if (NODE_MINOR_VERSION < 11)
#include "methods.node.h"
#else
#include "methods.iojs.h"
#endif

NAN_METHOD(Setsockopt) {
  NanScope();

  int level = args[1]->Uint32Value();
  int option = args[2]->Uint32Value();

  if(option == NN_SOCKET_NAME){
    utf8 str(args[3]);
    ret(NanNew<Number>(nn_setsockopt(S, level, option, *str, str.length())));
  } else {
    int optval = args[3]->Uint32Value();
    ret(NanNew<Number>(nn_setsockopt(S, level, option, &optval, sizeof(optval))));
  }
}

extern "C" void
exports(v8::Handle<v8::Object> e) {
  T(e, Socket)
  T(e, Err)
  T(e, Shutdown)
  T(e, Close)
  T(e, Connect)
  T(e, Bind)
  T(e, Send)
  T(e, Recv)
  T(e, RecvStr)
  T(e, Multiplexer)
  T(e, Setsockopt)
  //T(e, Device)
  //T(e, Term)

  // SP address families
  NC(e, AF_SP)
  NC(e, AF_SP_RAW)

  // Socket option levels
  NC(e, NN_SOL_SOCKET)

  // Generic socket options (NN_SOL_SOCKET level)
  NC(e, NN_LINGER)
  NC(e, NN_SNDBUF)
  NC(e, NN_RCVBUF)
  NC(e, NN_SNDTIMEO)
  NC(e, NN_RCVTIMEO)
  NC(e, NN_RECONNECT_IVL)
  NC(e, NN_RECONNECT_IVL_MAX)
  NC(e, NN_SNDPRIO)
#if NN_VERSION > 3
  NC(e, NN_RCVPRIO)
#endif
  NC(e, NN_SNDFD)
  NC(e, NN_RCVFD)
  NC(e, NN_DOMAIN)
  NC(e, NN_PROTOCOL)
  NC(e, NN_IPV4ONLY)
  NC(e, NN_SOCKET_NAME)

  // Ancillary data
#if NN_VERSION > 4
  NC(e, PROTO_SP)
  NC(e, SP_HDR)
#endif

  // Socket types
  NC(e, NN_SURVEYOR)
  NC(e, NN_RESPONDENT)
  NC(e, NN_REQ)
  NC(e, NN_REP)
  NC(e, NN_PAIR)
  NC(e, NN_PUSH)
  NC(e, NN_PULL)
  NC(e, NN_PUB)
  NC(e, NN_SUB)
  NC(e, NN_BUS)

  NC(e, NN_VERSION_CURRENT)
  NC(e, NN_VERSION_REVISION)
  NC(e, NN_VERSION_AGE)
  NC(e, NN_VERSION)

  NC(e, NN_TCP_NODELAY)
}

NODE_MODULE(nanomsg, exports)
