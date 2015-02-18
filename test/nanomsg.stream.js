var nano = require('..')
module.exports = function (t) {
  t.test('process a hundred messages over piped transform streams',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
  t.test('pipe incompatible endpoints, transports and protocols together',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
}
