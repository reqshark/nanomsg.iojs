var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.shutdown', function() {
  var RAM = nano.socket('pair', { stopBufferOverflow: true })
  var CPU = nano.socket('pair', { stopBufferOverflow: true })

  it('should be able to shutdown', function(done){

    RAM.on('msg',function(msg){
      for(var i in RAM.how)
        RAM.send('I remembered that@'+i)
    })

    RAM.bind('tcp://127.0.0.1:44448')
    CPU.connect('tcp://127.0.0.1:44448')

    setTimeout(function(){
      CPU.send('yo RAM this message is hot off a CPU cycle')
    },20)

    CPU.on('msg',function(msg){

      var addr = String(msg).split('@')[1]

      RAM.shutdown(addr)
      CPU.shutdown(addr)

      CPU.should.be.an.instanceOf(Object)
        .with.a.property('how')
        .which.is.an.instanceOf(Object)
        .with.a.property('tcp://127.0.0.1:44448')
        .which.is.eql('shut')
      done()

    })

  })

})
