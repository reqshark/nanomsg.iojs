/*
 * free and unencumbered software released into the public domain.
 */

var nn            = require('bindings')('nanomsg.node')
var EventEmitter  = require('events').EventEmitter
var duplexify     = require('duplexify')
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
var suggestion    = ' failed.\nsome config/opt may not be correct.\n'

require('util').inherits( self, EventEmitter )

module.exports    = {
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
  if(s < 0) throw new Error( type + ' socket' + suggestion)

  var ctx         = this

  if(o.hasOwnProperty('asBuffer')){
    this.asBuffer = o.asBuffer
  } else {
    this.asBuffer = true
  }

  this.fam        = o.fam
  this._stream    = o.stream || false
  this.socket     = s
  this.type       = t
  this.close      = close
  this.bind       = bind
  this.connect    = connect

  this.send       = function(msg){
    return nn.Send( s, msg )
  }
  this.recv       = function(msg){
    if(ctx._stream) return ctx.stream.push(msg)
    return EventEmitter.prototype.emit.call(ctx,'msg',msg)
  }

  if(this._stream) this.stream = duplexify()

  switch(this.type){
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
        this.clr = setInterval(select, 0)
      } else {
        this.clr = setInterval(selectStr, 0)
      }
      break;
  }

  function select(){
    while(nn.GetEventIn(ctx.socket, 0) > 0) ctx.recv(nn.Recv(ctx.socket));
  }

  function selectStr(){
    while(nn.GetEventIn(ctx.socket, 0) > 0) ctx.recv(nn.RecvStr(ctx.socket));
  }
}

function close() {
  clearInterval(this.clr)
  this.open = false
  return nn.Close( this.socket )
}

function bind (addr) {
  if (this.open || nn.Bind( this.socket, addr ) < 0 )
    throw new Error( this.type+ ' bind@' + addr + suggestion)
  this.open = true
  return this
}

function connect (addr) {
  if (this.open || nn.Connect( this.socket, addr ) < 0)
    throw new Error( this.type + ' connect@' + addr + suggestion )
  this.open = true
  return this
}
