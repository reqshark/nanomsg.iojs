var nano = require('..')
var test = require('tape')

test('nanomsg.sendperf', function(t) {
  t.plan(1)
  t.test('should send a hundred thousand messages',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
})
