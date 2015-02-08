/*
 * free and unencumbered software released into the public domain.
 */

#include <sys/select.h>

struct timeval tv;

int getevents (int s){
  int rcvfd, maxfd, revents;
  size_t fdsz;

  fd_set pollset;
  maxfd = 0;
  FD_ZERO (&pollset);
  fdsz = sizeof (rcvfd);
  nn_getsockopt (s, NN_SOL_SOCKET, NN_RCVFD, (char*) &rcvfd, &fdsz);
  FD_SET (rcvfd, &pollset);

  tv.tv_sec = 0; tv.tv_usec = 0;

  if (rcvfd + 1 > maxfd) maxfd = rcvfd + 1;

  select (maxfd, &pollset, NULL, NULL, &tv);
  revents = 0;
  if (FD_ISSET (rcvfd, &pollset))
    revents |= 1;
  return revents;
}
