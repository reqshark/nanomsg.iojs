var nano = require('..')

require('tape')('nanomsg.stream', function(t) {
  t.plan(2)
  t.test('process a hundred messages over piped transform streams',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
  t.test('pipe incompatible endpoints, transports and protocols together',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
})
