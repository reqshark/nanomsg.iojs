/*
 * free and unencumbered software released into the public domain.
 */
#if defined NN_HAVE_WINDOWS
#include <nn.h>
#include <pubsub.h>
#include <pipeline.h>
#include <bus.h>
#include <pair.h>
#include <reqrep.h>
#include <survey.h>
#include <ipc.h>
#include <tcp.h>
#include <inproc.h>
#include "../windows/nanomsg/src/utils/win.h"
#else
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
#include <sys/select.h>
#endif
struct timeval tv;

int getevents (int s){

  size_t fdsz;
  fd_set pollset;

#if defined NN_HAVE_WINDOWS
  SOCKET rcvfd;
#else
  int maxfd = 0, rcvfd;
#endif

  FD_ZERO (&pollset);
  fdsz = sizeof (rcvfd);
  nn_getsockopt (s, NN_SOL_SOCKET, NN_RCVFD, (char*) &rcvfd, &fdsz);
  FD_SET (rcvfd, &pollset);

  tv.tv_sec = 0; tv.tv_usec = 0;

#if defined NN_HAVE_WINDOWS
  select (0, &pollset, NULL, NULL, &tv);
#else
  if (rcvfd + 1 > maxfd) maxfd = rcvfd + 1;
  select (maxfd, &pollset, NULL, NULL, &tv);
#endif

  int revents = 0;

  if (FD_ISSET (rcvfd, &pollset))
    revents |= 1;
  return revents;
}
