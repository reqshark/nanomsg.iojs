var nano    = require('..')
var should  = require('should')

describe('nanomsg.bufferopt', function() {

  it('should support asBuffer option', function (done){

    var req   = nano.socket('req',{
      //the default, so we dont have to set it to true
      asBuffer:true,
      stopBufferOverflow: true
    })

    var rep   = nano.socket('rep',{
      asBuffer:false,
      stopBufferOverflow: true
    })

    var addr  = 'tcp://127.0.0.1:44443'

    req.connect(addr)
    rep.bind(addr)

    req.on('msg', function (msg){

      msg.should.be.an.instanceOf(Buffer)

      String(msg).should.equal('bar')

      done()
    })

    rep.on('msg', function (msg){

      msg.should.be.an.instanceOf(String)

      msg.should.equal('foo')

      rep.send('bar')
    })

    req.send('foo')

  })

})
