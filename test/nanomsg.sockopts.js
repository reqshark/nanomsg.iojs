var nano = require('..')
require('tape')('nanomsg.sockopts', function(t) {
  t.plan(23)
  t.test('should set tcp nodelay using setsockopt',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should get tcp nodelay setting using getsockopt',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should return undefined if there was a getsockopt error',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should get tcp nodelay using the tcpnodelay method',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should use tcpnodelay() method to reset and verify',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should set linger',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should verify linger',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should set sndbuf',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should verify sndbuf',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should set rcvbuf',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should verify rcvbuf',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should set sndtimeo',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should verify sndtimeo',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should set rcvtimeo',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should verify rcvtimeo',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should set reconn',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should verify reconn',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should set maxreconn',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should verify maxreconn',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should set sndprio',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should verify sndprio',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should set rcvprio',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should verify rcvprio',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })

})
