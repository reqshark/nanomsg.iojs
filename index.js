/*
 * free and unencumbered software released into the public domain.
 */

var nn            = require('bindings')('nanomsg.node') //should be .iojs
var sock = {
  pub             : [nn.NN_PUB,         nn.NN_SUB],
  sub             : [nn.NN_SUB,         nn.NN_PUB],
  bus             : [nn.NN_BUS,         nn.NN_BUS],
  pair            : [nn.NN_PAIR,        nn.NN_PAIR],
  surv            : [nn.NN_SURVEYOR,    nn.NN_RESPONDENT],
  surveyor        : [nn.NN_SURVEYOR,    nn.NN_RESPONDENT],
  resp            : [nn.NN_RESPONDENT,  nn.NN_SURVEYOR],
  respondent      : [nn.NN_RESPONDENT,  nn.NN_SURVEYOR],
  req             : [nn.NN_REQ,         nn.NN_REP],
  rep             : [nn.NN_REP,         nn.NN_REQ],
  pull            : [nn.NN_PULL,        nn.NN_PUSH],
  push            : [nn.NN_PUSH,        nn.NN_PULL],
}
var af = {
  af_sp           : nn.AF_SP,
  AF_SP           : nn.AF_SP,
  af_sp_raw       : nn.AF_SP_RAW,
  raw             : nn.AF_SP_RAW,
  af              : nn.AF_SP
}
var sol = {
  linger          : nn.NN_LINGER,
  sndbuf          : nn.NN_SNDBUF,
  rcvbuf          : nn.NN_RCVBUF,
  sndtimeo        : nn.NN_SNDTIMEO,
  rcvtimeo        : nn.NN_RCVTIMEO,
  reconn          : nn.NN_RECONNECT_IVL,
  maxreconn       : nn.NN_RECONNECT_IVL_MAX,
  sndprio         : nn.NN_SNDPRIO,
  tcpnodelay      : nn.NN_TCP_NODELAY
}

if (nn.NN_VERSION > 3) sol.rcvprio = nn.NN_RCVPRIO

module.exports    = {

  version: nn.NN_VERSION,
  versionstr: '0.'+nn.NN_VERSION+'-beta',

  socket: function ( type, opts ) {

    //preflight check
    if(typeof opts == 'string') opts = { fam: opts }
    opts = opts || { fam: 'af' }
    if(!opts.hasOwnProperty('fam')) opts.fam = 'af'

    //ensure first nanomsg socket is not zero, else disregard it
    var nns = nn.Socket(af[opts.fam], sock[type][0])
    if(nns == 0) return new self(nn.Socket(af[opts.fam],sock[type][0]), type, opts)
    return new self( nns, type, opts )
  }
}

require('util').inherits( self, require('duplexify') )

function self (s, t, o) {

  //error handle
  if(s < 0) throw new Error(nn.Err() + ': ' + t + ' creating socket'+'\n')

  var ctx         = this

  this.socket     = s
  this.fam        = o.fam
  this.type       = t
  this.how        = {}

  this.bind       = bind
  this.connect    = connect
  this.close      = close
  this.shutdown   = shutdown
  this.unhook     = unhook

  this.setsockopt = setsockopt
  this.getsockopt = getsockopt
  this.linger     = linger
  this.sndbuf     = sndbuf
  this.rcvbuf     = rcvbuf
  this.sndtimeo   = sndtimeo
  this.rcvtimeo   = rcvtimeo
  this.reconn     = reconn
  this.maxreconn  = maxreconn
  this.sndprio    = sndprio
  this.rcvprio    = rcvprio
  this.tcpnodelay = tcpnodelay

  this.sleep      = uvsleeper( function (t, d) { setTimeout(d, t) } )

  this.send       = send
  this.recv       = recv

  for(var sokopt in sol) if(o.hasOwnProperty(sokopt)) this[sokopt](o[sokopt])
  for(var p in require('duplexify')()) this[p] = require('duplexify')()[p]
  this.setWritable( require('through2') ( write, end ) )

  switch(t){
    case 'pub':
    case 'push':
      break
    case 'surv':
    case 'surveyor':
    case 'rep':
    case 'pull':
    case 'sub':
    case 'pair':
    case 'bus':
    case 'req':
    case 'resp':
    case 'respondent': nn.Recv( s, recv )
      break
  }

  function recv(msg){
    //msgs that are -1 is a req/surveyor issue so break the loop
    if (msg == -1) return
    ctx.push( msg )
    if (!ctx.destroyed) nn.Recv( s, recv )
  }

  function send (msg, flush) {
    nn.Send( s, msg );
    if (flush) flush()
  }

  function write (msg, enc, next) {
    ctx.send(msg, next)
  }

  function end (done) {
    this.destroy()
    done()
  }
}

function close(fn) {
  this.destroy()

  switch(this.type){
    case 'pub':
    case 'push':
      nn.Close( this.socket )
      return fn('closing a pub or a push')
    default:
      return fn(this.unhook())
  }
}

function shutdown(addr) {
  var confirm = this.how[addr][1] + ' endpoint '+ addr + ' shutdown'
  if(nn.Shutdown(this.socket, this.how[addr][0]) < 0)
    throw new Error(nn.Err() +': '+this.type+' shutdown@' + addr+'\n')
  delete this.how[addr]; return confirm
}

function bind (addr) {
  var eid = nn.Bind( this.socket, addr )
  if(eid < 0) throw new Error(nn.Err() +': '+this.type+' bind@' + addr+'\n')
  this.how[addr] = [eid,'bind']; return this
}

function connect (addr) {
  var eid = nn.Connect( this.socket, addr )
  if(eid < 0) throw new Error(nn.Err() +': '+this.type+' connect@' + addr+'\n')
  this.how[addr] = [eid,'connect']; return this
}

function setsockopt(level, option, value){
  return nn.Setsockopt(this.socket, nn[level], nn[option], value)
}

function getsockopt(level, option){
  return nn.Getsockopt(this.socket, nn[level], nn[option])
}

function linger(number){
  if(number){
    if(setsol(this.socket, 'linger', number) > -1)
      return 'linger set to ' + number + 'ms'
    throw new Error(nn.Err() + ': '+this.type+' linger@'+number+'\n')
  } else {
    return getsol(this.socket, 'linger')
  }
}

function sndbuf(number){
  if(number){
    if(setsol(this.socket, 'sndbuf', number) > -1)
      return 'sndbuf set to ' + number + ' bytes'
    throw new Error(nn.Err() + ': '+this.type+' sndbuf@'+number+'\n')
  } else {
    return getsol(this.socket, 'sndbuf')
  }
}

function rcvbuf(number){
  if(number){
    if(setsol(this.socket, 'rcvbuf', number) > -1)
      return 'rcvbuf set to ' + number + ' bytes'
    throw new Error(nn.Err() + ': '+this.type+' rcvbuf@'+number+'\n')
  } else {
    return getsol(this.socket, 'rcvbuf')
  }
}

function sndtimeo(number){
  if(number){
    if(setsol(this.socket, 'sndtimeo', number) > -1)
      return 'sndtimeo set to ' + number + 'ms'
    throw new Error(nn.Err() + ': '+this.type+' reconn@'+number+'\n')
  } else {
    return getsol(this.socket, 'sndtimeo')
  }
}

function rcvtimeo(number){
  if(number){
    if(setsol(this.socket, 'rcvtimeo', number) > -1)
      return 'rcvtimeo set to ' + number + 'ms'
    throw new Error(nn.Err() + ': '+this.type+' reconn@'+number+'\n')
  } else {
    return getsol(this.socket, 'rcvtimeo')
  }
}

function reconn(number){
  if(number){
    if(setsol(this.socket, 'reconn', number) > -1)
      return 'reconn set to ' + number + 'ms'
    throw new Error(nn.Err() + ': '+this.type+' reconn@'+number+'\n')
  } else {
    return getsol(this.socket, 'reconn')
  }
}

function maxreconn(number){
  if(number){
    if(setsol(this.socket, 'maxreconn', number) > -1)
      return 'maxreconn set to ' + number + 'ms'
    throw new Error(nn.Err() + ': '+this.type+' maxreconn@'+number+'\n')
  } else {
    return getsol(this.socket, 'maxreconn')
  }
}

function sndprio(number){
  if(number){
    if(setsol(this.socket, 'sndprio', number) > -1)
      return 'sndprio set to ' + number
    throw new Error(nn.Err() + ': '+this.type+' sndprio@'+number+'\n')
  } else {
    return getsol(this.socket, 'sndprio')
  }
}

function rcvprio(number){
  if(nn.NN_VERSION > 3){
    if(number){
      if(setsol(this.socket, 'rcvprio', number) > -1)
        return 'rcvprio set to ' + number
      throw new Error(nn.Err() + ': '+this.type+' rcvprio@'+number+'\n')
    } else {
      return getsol(this.socket, 'rcvprio')
    }
  } else {
    var version = 'current lib version: '+ nn.versionstr + '\n'
    var err = 'rcvprio: available in nanomsg beta-0.4 and higher.'
    throw new Error(version + err + ':' +this.type+' rcvprio@'+number+'\n')
  }
}

function tcpnodelay(bool){
  if(arguments.length){
    if(bool){
      if(nn.Setsockopt(this.socket, nn.NN_TCP, nn.NN_TCP_NODELAY, 1) > -1)
        return 'tcp nodelay: on'
      throw new Error(nn.Err() + ': '+this.type+' nodelay@'+'activing'+'\n')
    } else {
      if(nn.Setsockopt(this.socket, nn.NN_TCP, nn.NN_TCP_NODELAY, 0) > -1)
        return 'tcp nodelay: off'
      throw new Error(nn.Err() + ': '+this.type+' nodelay@'+'deactiving'+'\n')
    }
  } else {
    switch(nn.Getsockopt(this.socket, nn.NN_TCP, nn.NN_TCP_NODELAY)){
      case 1: return 'tcp nodelay: on'
      case 0: return 'tcp nodelay: off'
      default:
        throw new Error(nn.Err() + ': '+this.type+' nodelay@'+'getsockopt'+'\n')
    }
  }
}

function setsol(socket, option, value){
  return nn.Setsockopt(socket, nn.NN_SOL_SOCKET, sol[option], value)
}

function getsol(socket, option){
  return nn.Getsockopt(socket, nn.NN_SOL_SOCKET, sol[option])
}

function unhook(){
  var unsocket = nn.Socket(af[this.fam], sock[this.type][1])

  nn.Bind( unsocket, 'inproc://unhook' + unsocket )
  nn.Connect( this.socket, 'inproc://unhook' + unsocket )

  this.sleep(10)

  switch(this.type){
    case 'surv':
    case 'surveyor':
    case 'req':
      nn.Send( this.socket, 'swimming like a fish' )
      nn.Rcv(unsocket)
  }
  return nn.Send( unsocket, 'unhook and close' )
}

function uvsleeper(fn) {

  return function () {
    var done = false, err, res
    fn.apply(this, Array.prototype.slice.apply(arguments).concat(cb))

    while (!done) nn.Sleeper()
    if (err) throw err

    return res

    function cb (e, r) {
      err   = e
      res   = r
      done  = true
    }
  }
}
