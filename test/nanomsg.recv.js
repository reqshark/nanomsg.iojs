var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

var addr = 'tcp://127.0.0.1:54444'
var pub = nano.socket('pub')
var sub = nano.socket('sub')

describe('nanomsg.recv', function() {

  pub.bind(addr)
  sub.connect(addr)

  it('should have a write method', function (done) {

    pub.should.be.an.instanceOf(Object)
      .with.a.property('write')
      .which.is.a.Function

    done()
  })

  it('should have a readable property', function (done) {

    sub.should.be.an.instanceOf(Object)
      .with.a.property('readable')

    done()
  })

  it('should send and receive msgs', function (done) {

    var msgs = 0

    sub.on('data',function (msg) {

      msgs++

      msg = String(msg)

      if(msg.length > 8){
        msg.should.equal('hello from nanømsg!')
      } else {
        if(msg.length > 7)
          msg.should.equal('barnacle')
        else
          msg.should.equal('foo bar')
      }

      if(msgs == 3) done()

    })

    pub.write('hello from nanømsg!')
    pub.write('foo bar')
    pub.write('barnacle')

  })

})
