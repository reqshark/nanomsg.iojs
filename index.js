/*
 * free and unencumbered software released into the public domain.
 */

var nn            = require('bindings')('nanomsg.node')
var sock = {
  pub             : nn.NN_PUB,
  sub             : nn.NN_SUB,
  bus             : nn.NN_BUS,
  pair            : nn.NN_PAIR,
  surv            : nn.NN_SURVEYOR,
  surveyor        : nn.NN_SURVEYOR,
  resp            : nn.NN_RESPONDENT,
  respondent      : nn.NN_RESPONDENT,
  req             : nn.NN_REQ,
  rep             : nn.NN_REP,
  pull            : nn.NN_PULL,
  push            : nn.NN_PUSH
}
var af = {
  af_sp           : nn.AF_SP,
  AF_SP           : nn.AF_SP,
  af_sp_raw       : nn.AF_SP_RAW,
  raw             : nn.AF_SP_RAW,
  af              : nn.AF_SP
}

module.exports    = {

  version: nn.NN_VERSION,
  versionstr: '0.'+nn.NN_VERSION+'-beta',

  socket: function ( type, opts ) {

    //preflight check
    if(typeof opts == 'string') opts = { fam: opts }
    opts = opts || { fam: 'af' }
    if(!opts.hasOwnProperty('fam')) opts.fam = 'af'

    return new self( nn.Socket(af[opts.fam],sock[type]), type, opts)
  }
}

function self (s, t, o) {
  //error handle
  if(s < 0) throw new Error(nn.Err() + ': ' + t + ' creating socket'+'\n')

  //plug in a nice duplex stream (i think this will end up being the socket)
  var dup        = require('duplexify')()
  dup._stream    = o.stream || false

  dup.socket     = s
  dup.type       = t
  dup.fam        = o.fam
  dup.how        = {}

  if(o.hasOwnProperty('asBuffer')) dup.asBuffer = o.asBuffer

  //nanomsg functions
  dup.close      = close
  dup.shutdown   = shutdown
  dup.bind       = bind
  dup.connect    = connect
  dup.setsockopt = setsockopt
  dup.getsockopt = getsockopt

  dup.send       = function(msg){
    return nn.Send( s, msg )
  }

  //need optimize recv, b/c seems sluggish to re-check something on each msg
  dup.recv       = function(msg){
    if(dup._stream) return dup.push(msg)
    return dup.emit('msg', msg)
  }

  switch(t){
    case 'pub':
    case 'push':
      break;
    case 'sub':
    case 'bus':
    case 'pair':
    case 'surv':
    case 'surveyor':
    case 'resp':
    case 'respondent':
    case 'req':
    case 'rep':
    case 'pull':
      if(dup.asBuffer){
        //check for a buffer overflow option before i/o multiplexing
        if(o.hasOwnProperty('stopBufferOverflow')){
          dup.clr = setInterval(select_buf, 0)
        } else {
          dup.clr = setInterval(select, 0)
        }
      } else {
        if(o.hasOwnProperty('stopBufferOverflow')){
          dup.clr = setInterval(select_s_buf, 0)
        } else {
          dup.clr = setInterval(select_s, 0)
        }
      }
      break;
  }

  return dup

  function select(){
    while(nn.Multiplexer(s) > 0) dup.recv(nn.Recv(s))
  }

  function select_s(){
    while(nn.Multiplexer(s) > 0) dup.recv(nn.RecvStr(s))
  }

  function select_buf(){
    if(nn.Multiplexer(s) > 0) dup.recv(nn.Recv(s))
  }

  function select_s_buf(){
    if(nn.Multiplexer(s) > 0) dup.recv(nn.RecvStr(s))
  }
}



function close() {
/*
 * Closes the socket s. Any buffered inbound messages that were not yet
 * received by the application will be discarded.
 * The library will try to deliver any outstanding outbound messages
 * for the time specified by NN_LINGER socket option.
 * The call will block in the meantime.
 *
 * `int nn_close (int s);`
 *
 */
  clearInterval(this.clr); this.open = false
  return nn.Close( this.socket )
}

function shutdown(addr) {
/*
 * nn_shutdown() call will return immediately, however, the library will
 * try to deliver any outstanding outbound messages to the endpoint
 * for the time specified by NN_LINGER socket option.
 *
 * `int nn_shutdown (int s, int how);`
 *
 */
  var ret = nn.Shutdown(this.socket, this.how[addr])
  if(ret < 0) throw new Error(nn.Err() +': '+this.type+' bind@' + addr+'\n')

  this.how[addr] = 'shut'

  return ret
}

function bind (addr) {
/*
 * Adds a local endpoint to the socket s.
 * The endpoint can be then used by other applications to connect to.
 * Note that nn_bind and nn_connect(3) may be called multiple times
 * on the same socket thus allowing the socket to communicate
 * with multiple heterogeneous endpoints.
 *
 * `int nn_bind (int s, const char *addr);`
 *
 */

  var eid = nn.Bind( this.socket, addr )
  if(eid < 0) throw new Error(nn.Err() +': '+this.type+' bind@' + addr+'\n')

  this.how[addr] = eid

  return this
}

function connect (addr) {
  var eid = nn.Connect( this.socket, addr )
  if(eid < 0) throw new Error(nn.Err() +': '+this.type+' connect@' + addr+'\n')

  this.how[addr] = eid

  return this
}

function setsockopt(level, option, value){
  return nn.Setsockopt(this.socket, nn[level], nn[option], value)
}

function getsockopt(level, option){
  return nn.Getsockopt(this.socket, nn[level], nn[option])
}
