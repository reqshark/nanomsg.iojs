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

  it('should set sndtimeo', function(done){

    req.sndtimeo(500).should.equal('sndtimeo set to 500ms')

    done()
  })

  it('should verify sndtimeo', function(done){

    req.sndtimeo().should.equal(500)

    done()
  })

  it('should set rcvtimeo', function(done){

    req.rcvtimeo(200).should.equal('rcvtimeo set to 200ms')

    done()
  })

  it('should verify rcvtimeo', function(done){

    req.rcvtimeo().should.equal(200)

    done()
  })

  it('should set reconn', function(done){

    req.reconn(500).should.equal('reconn set to 500ms')

    done()
  })

  it('should verify reconn', function(done){

    req.reconn().should.equal(500)

    done()
  })

  it('should set maxreconn', function(done){

    req.maxreconn(100000).should.equal('maxreconn set to 100000ms')

    done()
  })

  it('should verify maxreconn', function(done){

    req.maxreconn().should.equal(100000)

    done()
  })

  it('should set sndprio', function(done){

    req.sndprio(3).should.equal('sndprio set to 3')

    done()
  })

  it('should verify sndprio', function(done){

    req.sndprio().should.equal(3)

    done()
  })

  it('should set rcvprio', function(done){

    if(nano.version > 3) req.rcvprio(10).should.equal('rcvprio set to 10')

    done()
  })

  it('should verify rcvprio', function(done){

    if(nano.version > 3) req.rcvprio().should.equal(10)

    done()
  })

})
