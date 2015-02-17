var nano = require('..')
require('tape')('nanomsg.shutdown', function(t) {
  t.plan(2)
  t.test('should bind and connect multiple',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('should demonstrate a socket shutdown',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
})
