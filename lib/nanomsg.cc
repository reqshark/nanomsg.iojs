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
}

#include <string>

#if (NODE_MODULE_VERSION < 10)
#define RUNLOOP_SEMANTICS ev_run(ev_default_loop(), EVRUN_ONCE)
#else
#define RUNLOOP_SEMANTICS uv_run(uv_default_loop(), UV_RUN_ONCE)
#endif

#define S args[0].As<Number>()-> IntegerValue()
#define EXPORT_METHOD(C, S) C->Set(NanNew(# S), NanNew<FunctionTemplate>(S)->GetFunction());

//using v8::Array;
using v8::Function;
using v8::FunctionTemplate;
using v8::Handle;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::StringObject;
using v8::Value;

#include "getevents.h"
#include "wrapstar.h"

NAN_METHOD(Socket) {
  NanScope();
  int64_t type = args[1].As<Number>()->IntegerValue();
  int ret = nn_socket(S, type);
  if(type == NN_SUB) nn_setsockopt (ret, NN_SUB, NN_SUB_SUBSCRIBE, "", 0);
  NanReturnValue(NanNew<Number>(ret));
}

NAN_METHOD(Close) {
  NanReturnValue(NanNew<Number>(nn_close(S)));
}

NAN_METHOD(Bind) {
  String::Utf8Value addr(args[1]);
  NanReturnValue(NanNew<Number>(nn_bind(S, *addr)));
}

NAN_METHOD(Connect) {
  String::Utf8Value addr(args[1]);
  NanReturnValue(NanNew<Number>(nn_connect(S, *addr)));
}

NAN_METHOD(Send) {

  std::string *input;

  if (node::Buffer::HasInstance(args[1]->ToObject())) {
    v8::Handle<v8::Object> object = args[1]->ToObject();
    const char *data = node::Buffer::Data(object);
    input = new std::string(data, node::Buffer::Length(object));
  } else {
    v8::String::Utf8Value str (args[1]->ToString());
    input = new std::string(*str);
  }

  NanReturnValue(nn_send (S, input->c_str(), input->length(), 0));
}

NAN_METHOD(SendString) {
  String::Utf8Value str(args[1]);
  nn_send (S, *str, strlen(*str), args[2].As<Number>()->IntegerValue());
  NanReturnValue(1);
}

NAN_METHOD(Recv){
  NanScope();

  char *buf = NULL;

  int len = nn_recv(S, &buf, NN_MSG, 0);
  v8::Local<v8::Value> res;

  res = NanNewBufferHandle(len);
  memcpy(node::Buffer::Data(res), buf, len);

  nn_freemsg (buf);
  NanReturnValue(res);
}

//res = NanNew<v8::String>(dst.c_str(), dst.length());


//NAN_METHOD(Recv) {
//  NanScope();
//  char *buf = NULL;
//  nn_recv (S, &buf, NN_MSG, 0);
//  //nn_freemsg (buf);
//  NanReturnValue(NanNew<String>(buf));
//}

NAN_METHOD(RecvBuf) {
  NanScope();

  void *buf = NULL;
  int r = nn_recv(S, &buf, NN_MSG, 0);
  //nn_freemsg (buf);
  NanReturnValue(NanNewBufferHandle((char*) buf, r));
}

NAN_METHOD(GetEventIn) {
  NanReturnValue(getevents(S, NN_IN, args[1].As<Number>()->IntegerValue()));
}

NAN_METHOD(Stall) {
  RUNLOOP_SEMANTICS;
  NanReturnUndefined();
}

void i(v8::Handle<Object>e) {

  // Functions
  EXPORT_METHOD(e, Socket)
  EXPORT_METHOD(e, Close)
  EXPORT_METHOD(e, Connect)
  EXPORT_METHOD(e, Bind)
  EXPORT_METHOD(e, Send)
  EXPORT_METHOD(e, SendString)
  EXPORT_METHOD(e, Recv)
  EXPORT_METHOD(e, RecvBuf)
  EXPORT_METHOD(e, GetEventIn)

  // SP address families
  NODE_DEFINE_CONSTANT(e, AF_SP);
  NODE_DEFINE_CONSTANT(e, AF_SP_RAW);

  // Max size of an SP address
  NODE_DEFINE_CONSTANT(e, NN_SOCKADDR_MAX);

  // Socket option levels
  NODE_DEFINE_CONSTANT(e, NN_SOL_SOCKET);

  // Generic socket options (NN_SOL_SOCKET level)
  NODE_DEFINE_CONSTANT(e, NN_LINGER);
  NODE_DEFINE_CONSTANT(e, NN_SNDBUF);
  NODE_DEFINE_CONSTANT(e, NN_RCVBUF);
  NODE_DEFINE_CONSTANT(e, NN_SNDTIMEO);
  NODE_DEFINE_CONSTANT(e, NN_RCVTIMEO);
  NODE_DEFINE_CONSTANT(e, NN_RECONNECT_IVL);
  NODE_DEFINE_CONSTANT(e, NN_RECONNECT_IVL_MAX);
  NODE_DEFINE_CONSTANT(e, NN_SNDPRIO);
  NODE_DEFINE_CONSTANT(e, NN_RCVPRIO);
  NODE_DEFINE_CONSTANT(e, NN_SNDFD);
  NODE_DEFINE_CONSTANT(e, NN_RCVFD);
  NODE_DEFINE_CONSTANT(e, NN_DOMAIN);
  NODE_DEFINE_CONSTANT(e, NN_PROTOCOL);
  NODE_DEFINE_CONSTANT(e, NN_IPV4ONLY);
  NODE_DEFINE_CONSTANT(e, NN_SOCKET_NAME);

  // Send/recv options
  NODE_DEFINE_CONSTANT(e, NN_DONTWAIT);

  // Ancillary data.
  NODE_DEFINE_CONSTANT(e, PROTO_SP);
  NODE_DEFINE_CONSTANT(e, SP_HDR);

  // Mutliplexing support
  NODE_DEFINE_CONSTANT(e, NN_POLLIN);
  NODE_DEFINE_CONSTANT(e, NN_POLLOUT);

  // Socket types
  NODE_DEFINE_CONSTANT(e, NN_SURVEYOR);
  NODE_DEFINE_CONSTANT(e, NN_RESPONDENT);
  NODE_DEFINE_CONSTANT(e, NN_REQ);
  NODE_DEFINE_CONSTANT(e, NN_REP);
  NODE_DEFINE_CONSTANT(e, NN_PAIR);
  NODE_DEFINE_CONSTANT(e, NN_PUSH);
  NODE_DEFINE_CONSTANT(e, NN_PULL);
  NODE_DEFINE_CONSTANT(e, NN_PUB);
  NODE_DEFINE_CONSTANT(e, NN_SUB);
  NODE_DEFINE_CONSTANT(e, NN_BUS);
}

NODE_MODULE(nanomsg, i)
