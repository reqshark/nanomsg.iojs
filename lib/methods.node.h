/*
 * free and unencumbered software released into the public domain.
 */

NAN_METHOD(Socket) {
  NanScope();

  int type = args[1].integer;
  int s = nn_socket(S, type);
  if(type == NN_SUB) nn_setsockopt (s, NN_SUB, NN_SUB_SUBSCRIBE, "", 0);

  ret(NanNew<Number>(s));
}

NAN_METHOD(Err){ NanScope(); ret(NanNew<String>(nn_strerror(nn_errno()))); }
NAN_METHOD(Close) { NanScope(); ret(NanNew<Number>(nn_close(S))); }

NAN_METHOD(Shutdown) {
  NanScope();
  int how = args[1].integer;
  ret(NanNew<Number>(nn_shutdown(S, how)));
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
