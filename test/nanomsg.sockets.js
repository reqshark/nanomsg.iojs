var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.sockets', function() {

  it('should open NN_PUB', function (done) {

    var pub = nano.socket('pub')

    pub.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    pub.close()

    done()
  })

  it('should open NN_SUB', function (done) {

    var sub = nano.socket('sub')

    sub.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    sub.close()

    done()
  })

  it('should open NN_BUS', function (done) {

    var bus = nano.socket('bus')

    bus.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    bus.close()

    done()
  })

  it('should open NN_PAIR', function (done) {

    var pair = nano.socket('pair')

    pair.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    pair.close()

    done()
  })

  it('should open NN_SURVEYOR', function (done) {

    var surv = nano.socket('surv')

    surv.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    surv.close()

    done()
  })

  it('should open NN_RESPONDENT', function (done) {

    var resp = nano.socket('resp')

    resp.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    resp.close()

    done()
  })

  it('should open NN_REQ', function (done) {
    var req = nano.socket('req')

    req.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    req.close()

    done()
  })

  it('should open NN_REP', function (done) {
    var rep = nano.socket('rep')

    rep.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    rep.close()

    done()
  })

  it('should open NN_PULL', function (done) {
    var pull = nano.socket('pull')

    pull.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    pull.close()

    done()
  })

  it('should open NN_PUSH', function (done) {
    var push = nano.socket('push')

    push.should.be.an.instanceOf(Object)
      .and.have.property('socket')
      .which.is.above(-1)

    push.close()

    done()
  })

})
