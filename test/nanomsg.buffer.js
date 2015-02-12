var nano    = require('..')
var should  = require('should')

describe('nanomsg.bufferopt', function() {

  it('should support string encoding', function (done){

    var req   = nano.socket('req')
    var rep   = nano.socket('rep')
    var addr  = 'tcp://127.0.0.1:44443'

    rep.setEncoding('utf8')

    req.connect(addr)
    rep.bind(addr)

    req.on('data', function (msg){

      msg.should.be.an.instanceOf(Buffer)

      String(msg).should.equal('bar')

      done()
    })

    rep.on('data', function (msg){

      msg.should.be.an.instanceOf(String)

      msg.should.equal('foo')

      rep.write('bar')
    })

    req.write('foo')

  })

})
