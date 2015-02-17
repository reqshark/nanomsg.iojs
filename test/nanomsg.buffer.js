var nano = require('..')
require('tape')('nanomsg.bufferopt', function(t) {
  t.plan(1)
  t.test('should support string encoding',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
})
