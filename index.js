/*
 * This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 *
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * For more information, please refer to <http://www.wtfpl.net/>
 */

var nn            = require('bindings')('nanomsg.node')
var EventEmitter  = require('events').EventEmitter
require('util').inherits( self, EventEmitter )

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

module.exports    = {
  socket: function ( type, opts ) {

    //preflight check
    if(typeof opts == 'string') opts = { fam: opts }
    opts = opts || { fam: 'af' }

    return new self( nn.Socket(af[opts.fam],sock[type]), type, opts.fam )
  }
}

function self (s, t, f) {
  //error handle
  if(s < 0) throw new Error( type + ' socket' + suggestion)

  var ctx         = this

  this.fam        = f
  this.socket     = s
  this.type       = t
  this.close      = close
  this.bind       = bind
  this.connect    = connect

  this.send       = function(msg){ nn.Send( s, Buffer(msg+'\u0000'), 0 ) }
  this.recv       = function(msg){
    return EventEmitter.prototype.emit.call(ctx,'msg',msg)
  }

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
      this.clr = setInterval(select,0)
      break;
  }

  function select(){
    while(nn.GetEventIn(ctx.socket,0) > 0) ctx.recv(nn.Recv(ctx.socket,0));
  }
}

function close() {
  clearInterval(this.clr)
  this.open = false
  return nn.Close( this.socket )
}

function bind (addr) {
  if (nn.Bind( this.socket, addr ) < 0 || this.open)
    throw new Error( this.type+ ' bind@' + addr + suggestion)
  this.open = true
  return this
}

function connect (addr) {
  if (nn.Connect( this.socket, addr ) < 0 || this.open)
    throw new Error( this.type + ' connect@' + addr + suggestion )
  this.open = true
  return this
}
