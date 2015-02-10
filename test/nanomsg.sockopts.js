var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.sockopts', function() {

  var req = nano.socket('req')
  var rep = nano.socket('rep')

  req.bind('tcp://127.0.0.1:44449')
  rep.connect('tcp://127.0.0.1:44449')

  it('should set tcp nodelay', function (done){

    req.setsockopt('NN_TCP','NN_TCP_NODELAY',1).should.equal(0)

    done()
  })

  it('should get tcp nodelay setting', function (done){

    req.getsockopt('NN_TCP','NN_TCP_NODELAY').should.equal(1)

    done()
  })

  it('should return undefined if there was a getsockopt error', function (done){

    if(req.getsockopt('NN_TCP','NN_TCP_DELAY') == undefined){
      done()
    } else {
      throw 'it'
    }
  })

  it('should set linger', function(done){

    req.linger(5000).should.equal('linger set to 5000ms')

    done()
  })

  it('should verify linger', function(done){

    req.linger().should.equal(5000)

    done()
  })

  it('should set sndbuf', function(done){

    req.sndbuf(1024).should.equal('sndbuf set to 1024 bytes')

    done()
  })

  it('should verify sndbuf', function(done){

    req.sndbuf().should.equal(1024)

    done()
  })

  it('should set rcvbuf', function(done){

    req.rcvbuf(102400).should.equal('rcvbuf set to 102400 bytes')

    done()
  })

  it('should verify rcvbuf', function(done){

    req.rcvbuf().should.equal(102400)

    done()
  })
})
