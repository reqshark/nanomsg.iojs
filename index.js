/*
 * free and unencumbered software released into the public domain.
 */

var nn            = require('bindings')('nanomsg.node') //should be .iojs
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
var sol = {
  linger          : nn.NN_LINGER,
  sndbuf          : nn.NN_SNDBUF,
  rcvbuf          : nn.NN_RCVBUF,
  sndtimeo        : nn.NN_SNDTIMEO,
  rcvtimeo        : nn.NN_RCVTIMEO,
  reconn          : nn.NN_RECONNECT_IVL,
  maxreconn       : nn.NN_RECONNECT_IVL_MAX,
  sndprio         : nn.NN_SNDPRIO
}

if(nn.NN_VERSION > 3) sol.rcvprio = nn.NN_RCVPRIO

require('util').inherits( self, require('events').EventEmitter )

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

  var ctx         = this

  this.fam        = o.fam
  this.socket     = s
  this.type       = t
  this.bind       = bind
  this.connect    = connect
  this.close      = close
  this.shutdown   = shutdown
  this.how        = {}
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

  this.asBuffer   = true
  if(o.hasOwnProperty('asBuffer')) this.asBuffer = o.asBuffer

  //nanomsg sockopts
  if(o.hasOwnProperty('linger')) linger(o.linger)
  if(o.hasOwnProperty('sndbuf')) sndbuf(o.sndbuf)
  if(o.hasOwnProperty('rcvbuf')) rcvbuf(o.rcvbuf)
  if(o.hasOwnProperty('sndtimeo')) sndtimeo(o.sndtimeo)
  if(o.hasOwnProperty('rcvtimeo')) rcvtimeo(o.rcvtimeo)
  if(o.hasOwnProperty('reconn')){
    reconn(o.reconn); if(o.hasOwnProperty('maxreconn')) maxreconn(o.maxreconn)
  }
  if(o.hasOwnProperty('sndprio')) sndprio(o.sndprio)
  if(o.hasOwnProperty('rcvprio')) rcvprio(o.rcvprio)
  if(o.hasOwnProperty('tcpnodelay')) setTimeout(function(){
    ctx.tcpnodelay(o.tcpnodelay)
  },50)

  if(o.stream){
    this.stream   = require('duplexify')()
    this.send     = function(msg,next){ nn.Send( s, msg ); next() }
    this.recv     = function(msg){ return ctx.stream.push(msg) }

    this.stream.setWritable(require('through2')(write, end))
  } else {
    this.recv     = function(msg){ return ctx.emit('msg', msg) }
    this.send     = function(msg){ nn.Send( s, msg ) }
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
      if(this.asBuffer){
        //check for a buffer overflow option before i/o multiplexing
        if(o.hasOwnProperty('stopBufferOverflow')){
          this.clr = setInterval(select_buf, 0)
        } else {
          this.clr = setInterval(select, 0)
        }
      } else {
        if(o.hasOwnProperty('stopBufferOverflow')){
          this.clr = setInterval(select_s_buf, 0)
        } else {
          this.clr = setInterval(select_s, 0)
        }
      }
      break;
  }

  function select(){ while(nn.Multiplexer(s) > 0) ctx.recv(nn.Recv(s)) }
  function select_s(){ while(nn.Multiplexer(s) > 0) ctx.recv(nn.RecvStr(s)) }
  function select_buf(){ if(nn.Multiplexer(s) > 0) ctx.recv(nn.Recv(s)) }
  function select_s_buf(){ if(nn.Multiplexer(s) > 0) ctx.recv(nn.RecvStr(s)) }

  function write(chunk, enc, next) {
    ctx.send(chunk, next)
  }
  function end(done) {
    ctx.close()
    done()
  }
}

function close() {
  clearInterval(this.clr); this.open = false
  return nn.Close( this.socket )
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
