var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.connect', function() {

  var addr  = 'tcp://127.0.0.1:44445'
  var addr2 = 'tcp://127.0.0.1:44446'
  var addr3 = 'tcp://127.0.0.1:44447'
  var sub   = nano.socket('sub')
  var pub   = nano.socket('pub')
  var pub2  = nano.socket('pub')
  var pub3  = nano.socket('pub')

  it('should have a connect method', function(done){

    pub.should.be.an.instanceOf(Object)
      .with.a.property('connect')
      .which.is.a.Function

    done()
  })

  it('should be called on a network address', function (done) {

    sub.connect(addr)

    setTimeout(function(){

      sub.should.be.an.instanceOf(Object)
        .with.a.property('how')
        .which.is.an.instanceOf(Array)

      done()
    }, 100)

  })

  it('should communicate with multiple heterogeneous endpoints', function(done){

    var msgs = 0

    sub.connect(addr2)
    sub.connect(addr3)
    pub.bind(addr)
    pub2.bind(addr2)
    pub3.bind(addr3)

    sub.on('msg', function(msg){

      msgs++

      msg = String(msg)

      if(msg.length > 30){
        msg.should.equal('hello from yet another publisher')
      } else {
        if(msg.length > 26)
          msg.should.equal('hello from another publisher')
        else
          msg.should.equal('hello from one publisher')
      }

      if(msgs == 3) done()

    })

    setTimeout(function(){
      pub.send('hello from one publisher')
      pub2.send('hello from another publisher')
      pub3.send('hello from yet another publisher')
    },100)

  })

})
