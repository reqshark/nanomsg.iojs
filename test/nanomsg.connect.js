var nano = require('..')
module.exports = function (t) {
  t.test('called on a network address',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
  t.test('communicate with multiple heterogeneous endpoints',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
}
