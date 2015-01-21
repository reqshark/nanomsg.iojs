/*
 * free and unencumbered software released into the public domain.
 */

#include <sys/select.h>

#define NN_IN 1
#define NN_OUT 2

int getevents (int s, int events, int timeout){
  int rcvfd, maxfd, grc, revents;
  size_t fdsz;
  struct timeval tv;

  fd_set pollset;
  maxfd = 0;
  FD_ZERO (&pollset);

  if (events & NN_IN) {
    fdsz = sizeof (rcvfd);
    grc = nn_getsockopt (s, NN_SOL_SOCKET, NN_RCVFD, (char*) &rcvfd, &fdsz);
    FD_SET (rcvfd, &pollset);
    if (rcvfd + 1 > maxfd)
      maxfd = rcvfd + 1;
  }

  if (timeout >= 0) {
    tv.tv_sec = timeout / 1000;
    tv.tv_usec = (timeout % 1000) * 1000;
  }

  select (maxfd, &pollset, NULL, NULL, timeout < 0 ? NULL : &tv);
  revents = 0;
  if ((events & NN_IN) && FD_ISSET (rcvfd, &pollset))
    revents |= NN_IN;
  return revents;
}
