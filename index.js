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
var nn_opt = {
  linger          : nn.NN_LINGER
}

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
  this.check      = check
  this.linger     = linger

  this.asBuffer   = true
  if(o.hasOwnProperty('asBuffer')) this.asBuffer = o.asBuffer

  if(o.hasOwnProperty('linger')) linger(o.linger)

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
  var ret = nn.Shutdown(this.socket, this.how[addr])
  if(ret < 0) throw new Error(nn.Err() +': '+this.type+' bind@' + addr+'\n')

  this.how[addr] = 'shut'

  return ret
}

function bind (addr) {
  var eid = nn.Bind( this.socket, addr )
  if(eid < 0) throw new Error(nn.Err() +': '+this.type+' bind@' + addr+'\n')
  this.how[addr] = eid; return this
}

function connect (addr) {
  var eid = nn.Connect( this.socket, addr )
  if(eid < 0) throw new Error(nn.Err() +': '+this.type+' connect@' + addr+'\n')
  this.how[addr] = eid; return this
}

function setsockopt(level, option, value){
  return nn.Setsockopt(this.socket, nn[level], nn[option], value)
}

function getsockopt(level, option){
  return nn.Getsockopt(this.socket, nn[level], nn[option])
}

function linger(number){
  if(nn.Setsockopt(this.socket, nn.NN_SOL_SOCKET, nn.NN_LINGER, number) > -1){
    return 'linger set to ' + number
  } else {
    throw new Error(nn.Err() + ': '+this.type+' linger@'+number+'\n')
  }
}

function check(option){
  return nn.Getsockopt(this.socket, nn.NN_SOL_SOCKET, nn_opt[option])
}
