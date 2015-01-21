/*
 * free and unencumbered software released into the public domain.
 */

NAN_METHOD(Socket) {
  NanScope();

  int64_t type = args[1].As<Number>()->IntegerValue();
  int s = nn_socket(S, type);
  if(type == NN_SUB) nn_setsockopt (s, NN_SUB, NN_SUB_SUBSCRIBE, "", 0);

  ret(NanNew<Number>(s));
}

NAN_METHOD(Close) {
  NanScope();
  ret(NanNew<Number>(nn_close(S)));
}

NAN_METHOD(Bind) {
  NanScope();
  utf8 addr(args[1]);
  ret(NanNew<Number>(nn_bind(S, *addr)));
}

NAN_METHOD(Connect) {
  NanScope();
  utf8 addr(args[1]);
  ret(NanNew<Number>(nn_connect(S, *addr)));
}

NAN_METHOD(Send) {
  NanScope();
  std::string *input;

  if (node::Buffer::HasInstance(args[1]->ToObject())) {
    v8::Handle<v8::Object> object = args[1]->ToObject();
    const char *data = node::Buffer::Data(object);
    input = new std::string(data, node::Buffer::Length(object));
  } else {
    utf8 str (args[1]->ToString());
    input = new std::string(*str);
  }

  ret(NanNew<Number>(nn_send (S, input->c_str(), input->length(), 0)));
}

NAN_METHOD(Recv){
  NanScope();

  char *buf = NULL;
  int len = nn_recv(S, &buf, NN_MSG, 0);

  v8::Local<v8::Value> h = NanNewBufferHandle(len);
  memcpy(node::Buffer::Data(h), buf, len);

  nn_freemsg (buf);
  ret(h);
}

NAN_METHOD(RecvStr){
  NanScope();
  char *buf = NULL;
  int len = nn_recv(S, &buf, NN_MSG, 0);
  buf[len] = 0;

  v8::Local<v8::Value> str = NanNew<v8::String>(buf, len);
  nn_freemsg (buf);
  ret(str);
}

NAN_METHOD(Multiplexer){
  NanScope();
  ret(NanNew<Number>(getevents(S, NN_IN, 0)));
}
