var nano = require('..')
var test = require('tape')

test('nanomsg.connect', function(t) {
  t.plan(2)
  t.test('called on a network address',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('communicate with multiple heterogeneous endpoints',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
})
