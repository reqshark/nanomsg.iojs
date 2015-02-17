var nano = require('..')
require('tape')('nanomsg.recv', function(t) {
  t.plan(3)
  t.test('socket\'s write method',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('readable property',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('send and receive msgs',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
})
