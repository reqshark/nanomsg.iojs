var nmsg    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('socket.connect', function() {

  var addr = 'tcp://127.0.0.1:44445'
  var sub = nmsg.socket('sub')
  var pub = nmsg.socket('pub')

  it('should have a connect method', function(done){

    pub.should.be.an.instanceOf(Object)
      .with.a.property('connect')
      .which.is.a.Function

    done()
  })

  it('should be called on a network address', function (done) {

    sub.should.be.an.instanceOf(Object)
      .with.a.property('closed')
      .which.is.false

    sub.connect(addr)

    setTimeout(function(){

      sub.should.be.an.instanceOf(Object)
        .with.a.property('connected')
        .which.is.true

      pub.close()

      done()
    }, 100)

  })

})
