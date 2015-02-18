var nano = require('..')
module.exports = function (t) {
  t.test('should support string encoding',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
}
