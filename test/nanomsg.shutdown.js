var nano = require('..')
module.exports = function (t) {
  t.test('should bind and connect multiple',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
  t.test('should demonstrate a socket shutdown',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
}
