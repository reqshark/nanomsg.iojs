var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.connect', function() {

  var addr  = 'tcp://127.0.0.1:44445'
  var addr2 = 'tcp://127.0.0.1:44446'
  var addr3 = 'tcp://127.0.0.1:44447'
  var pull  = nano.socket('pull', { stopBufferOverflow: true } )
  var push  = nano.socket('push')
  var push2 = nano.socket('push')
  var push3 = nano.socket('push')

  pull.connect(addr)
  pull.connect(addr2)
  pull.connect(addr3)
  push.bind(addr)
  push2.bind(addr2)
  push3.bind(addr3)

  it('should be called on a network address', function (done) {

    push.should.be.an.instanceOf(Object)
      .with.a.property('connect')
      .which.is.a.Function

    pull.should.be.an.instanceOf(Object)
      .with.a.property('how')

    done()

  })

  it('should communicate with multiple heterogeneous endpoints', function(done){

    var msgs = 0

    pull.on('msg', function(msg){

      msg = String(msg)

      if(msg.length > 27){
        msg.should.equal('hello from yet another source')
      } else {
        if(msg.length > 23){
          msg.should.equal('hello from another source')
        } else {
          msg.should.equal('hello from one source')
        }
      }

      if(++msgs > 2) {

        push.close(); push2.close(); push3.close();

        pull.close()

        done()
      }

    })

    setImmediate(function(){
      push.send('hello from one source')
      push2.send('hello from another source')
      push3.send('hello from yet another source')
    })

  })

})
