var nmsg    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.bind', function() {

  var addr = 'tcp://127.0.0.1:44444'
  var pub = nmsg.socket('pub')
  var sub = nmsg.socket('sub')

  it('should have a bind method', function(done){

    pub.should.be.an.instanceOf(Object)
      .with.a.property('bind')
      .which.is.a.Function

    done()
  })

  it('should be called on a network address', function (done) {

    sub.bind(addr)

    setTimeout(function(){

      sub.should.be.an.instanceOf(Object)
        .with.a.property('closed')
        .which.is.false

      sub.should.be.an.instanceOf(Object)
        .with.a.property('open')
        .which.is.a.String

      sub.open.should.equal('tcp://127.0.0.1:44444')

      sub.should.be.an.instanceOf(Object)
        .with.a.property('bound')
        .which.is.true

      done()
    }, 10)

  })

})
