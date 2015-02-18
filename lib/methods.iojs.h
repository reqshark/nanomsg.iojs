/*
 * free and unencumbered software released into the public domain.
 */

NAN_METHOD(Socket) {
  int type = args[1].integer;
  int s = nn_socket(S, type);
  if(type == NN_SUB) nn_setsockopt (s, NN_SUB, NN_SUB_SUBSCRIBE, "", 0);
  ret(s);
}

NAN_METHOD(Close)   { ret (nn_close(S)); }
NAN_METHOD(Shutdown){ ret (nn_shutdown(S, args[1].integer));}

NAN_METHOD(Bind)    {
  utf8 addr(args[1]);
  ret(nn_bind(S, *addr));
}

NAN_METHOD(Connect) {
  utf8 addr(args[1]);
  ret(nn_connect(S, *addr));
}

NAN_METHOD(Send) {
  std::string *input;

  if (node::Buffer::HasInstance(args[1]->ToObject())) {
    v8::Handle<v8::Object> object = args[1]->ToObject();
    const char *data = node::Buffer::Data(object);
    input = new std::string(data, node::Buffer::Length(object));
  } else {
    utf8 str (args[1]->ToString()); input = new std::string(*str);
  }

  ret(nn_send (S, input->c_str(), input->length(), 0));
}

NAN_METHOD(Err){ ret(NanNew<String>(nn_strerror(nn_errno()))); }
