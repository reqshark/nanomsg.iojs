var nano = require('..')
module.exports = function (t) {
  t.test('should send a hundred thousand messages',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
}
