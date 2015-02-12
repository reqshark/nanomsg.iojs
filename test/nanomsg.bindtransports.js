var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.transports', function() {

  it('should bind, connect, send and receive over tcp', function(done){
    var addr  = 'tcp://127.0.0.1:44442'
    var req = nano.socket('req')
    var rep = nano.socket('rep')

    rep.connect(addr)
    req.bind(addr)

    req.on('data', function(msg){
      msg.should.be.an.instanceOf(Buffer)
      String(msg).should.equal('foo ack bar')
      done()
    })

    rep.on('data',function(msg){
      String(msg).should.equal('sent over tcp')
      rep.write('foo ack bar')
    })

    req.write('sent over tcp')

  })

  it('should bind, connect, send and receive over inproc', function(done){

    var addr  = 'inproc://foo'
    var req = nano.socket('req')
    var rep = nano.socket('rep')

    rep.connect(addr)
    req.bind(addr)

    req.on('data',function(msg){
      msg.should.be.an.instanceOf(Buffer)
      String(msg).should.equal('foo ack bar')
      done()
    })

    rep.on('data',function(msg){
      msg.should.be.an.instanceOf(Buffer)
      String(msg).should.equal('sent over inproc')
      rep.send('foo ack bar')
    })

    req.write('sent over inproc')

  })

  it('should bind, connect, send and receive over ipc', function(done){

    var addr  = 'ipc://bar'
    var req = nano.socket('req')
    var rep = nano.socket('rep')

    rep.connect(addr)
    req.bind(addr)

    req.on('data',function(msg){
      msg.should.be.an.instanceOf(Buffer)
      String(msg).should.equal('foo ack bar')

      //clean up unix domain socket
      require('fs').unlink('bar', function(er) {
        if(er)throw er
        done()
      })
    })

    rep.on('data',function(msg){
      msg.should.be.an.instanceOf(Buffer)
      String(msg).should.equal('sent over ipc')
      rep.send('foo ack bar')
    })

    req.write('sent over ipc')

  })

})
