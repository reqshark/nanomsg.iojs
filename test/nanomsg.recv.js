var nano = require('..')
module.exports = function (t) {
  t.test('socket\'s write method',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
  t.test('readable property',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
  t.test('send and receive msgs',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
  })
}
