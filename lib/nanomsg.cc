/*
 * free and unencumbered software released into the public domain.
 */

#include "node.h"
#include "node_buffer.h"
#include "nan.h"

extern "C" {
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
#define integer As<Number>()->IntegerValue()
#define S args[0].integer
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

  int level = args[1].integer;
  int option = args[2].integer;

  if(option == NN_SOCKET_NAME){
    utf8 str(args[3]);
    ret(NanNew<Number>(nn_setsockopt(S, level, option, *str, str.length())));
  } else {
    int optval = args[3].integer;
    ret(NanNew<Number>(nn_setsockopt(S, level, option, &optval, sizeof(optval))));
  }
}

NAN_METHOD(Getsockopt) {
  NanScope();

  int optval[64];
  int option = args[2].integer;
  size_t optsize = sizeof(optval);

  if(nn_getsockopt(S, args[1].integer, option, optval, &optsize) == 0){

    if(option == NN_SOCKET_NAME) ret(NanNew<String>((char *)optval));

    ret(NanNew<Number>(optval[0]));

  } else {
    //pass the error back as an undefined return
    NanReturnUndefined();
  }
}

class RecvMsg : public NanAsyncWorker {
  public:
    RecvMsg(NanCallback *callback, int socket)
      : NanAsyncWorker(callback), socket(socket) {}
    ~RecvMsg() {}

    // Executed inside worker-thread.
    void Execute () { while(getevents(socket) < 1); }

    // Executed when the async work is complete
    void HandleOKCallback () {
      NanScope();

      char *buf = NULL;
      int len = nn_recv(socket, &buf, NN_MSG, 0);

      if (len < 0) {
        //why does this case occur right when starting rep and surveyor?
        Local<Value> argv[] = { NanNew<Number>(len) };

        callback->Call(1, argv);

      } else {

        Local<Value> argv[] = { NanNewBufferHandle(len) };
        memcpy(node::Buffer::Data(argv[0]), buf, len);

        nn_freemsg (buf);

        callback->Call(1, argv);

      }

    }

  private:
    int socket;
};

NAN_METHOD(Recv) {
  NanScope();

  Local<Function> callback = args[1].As<Function>();

  NanCallback* nanCallback = new NanCallback(callback);
  RecvMsg* worker = new RecvMsg(nanCallback, S);
  NanAsyncQueueWorker(worker);

  NanReturnUndefined();
}

NAN_METHOD(Rcv){
  NanScope();
  char *buf = NULL;
  int len = nn_recv(S, &buf, NN_MSG, 0);

  //null terminate
  buf[len] = 0;

  v8::Local<v8::Value> str = NanNew<v8::String>(buf, len);

  //dont memory leak
  nn_freemsg (buf);

  ret(str);
}

NAN_METHOD(Sleeper) {
  NanScope();
  uv_run(uv_default_loop(), UV_RUN_ONCE);
  NanReturnUndefined();
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
  T(e, Rcv)
  T(e, Setsockopt)
  T(e, Getsockopt)
  T(e, Sleeper)

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
