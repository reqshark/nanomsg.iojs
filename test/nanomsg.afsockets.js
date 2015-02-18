var nano = require('..')
module.exports = function (t) {
  t.test('returns a beta release version', function(t) {
    t.plan(1)
    t.ok(require('..').version < 6, 'beta version:' + require('..').version )
  })
  var pub, sub, pair, push, pull
  t.test('start socket: NN_PUB',function(t){
    t.plan(1)
    pub = nano.socket('pub')
    t.equal(s( pub.socket ),        0, 'opened NN_PUB')
  })
  t.test('stop socket: NN_PUB',function(t){
    t.plan(1)
    pub.close(function(msg){
      //push and pub sockets should close nearly immediately
      t.equal(msg,'closing a pub or a push', 'closed NN_PUB')
    })
  })
  t.test('start socket: NN_SUB',function(t){
    t.plan(1)
    sub = nano.socket('sub')
    t.equal(s( sub.socket ),        0, 'opened NN_SUB')
  })
  t.test('stop socket: NN_SUB',function(t){
    t.plan(1)
    sub.close(function(msg){
      // use this callback to understand when the socket is closed.
      // 16 bytes is the size of a message sent to unhook the poll worker
      // this happens relatively quick (around 20ms) regardless of linger opts
      t.equal(msg, 16, 'closed NN_SUB')
    })
  })
  t.test('start socket: NN_PAIR',function(t){
    t.plan(1)
    pair = nano.socket('pair')
    t.equal(s( pair.socket ),        0, 'opened NN_PAIR')
  })
  t.test('stop socket: NN_PAIR',function(t){
    t.plan(1)
    pair.close(function(msg){
      t.equal(msg, 16, 'closed NN_PAIR')
    })
  })
  t.test('start socket: NN_PUSH',function(t){
    t.plan(1)
    push = nano.socket('push')
    t.equal(s( push.socket ),        0, 'opened NN_PUSH')
  })
  t.test('stop socket: NN_PUSH',function(t){
    t.plan(1)
    push.close(function(msg){
      t.equal(msg,'closing a pub or a push', 'closed NN_PUSH')
    })
  })
  t.test('start socket: NN_PULL',function(t){
    t.plan(1)
    pull = nano.socket('pull')
    t.equal(s( pull.socket ),        0, 'opened NN_PULL')
  })
  t.test('stop socket: NN_PULL',function(t){
    t.plan(1)
    pull.close(function(msg){
      t.equal(msg, 16, 'closed NN_PULL')
    })
  })
//  t.test('open NN_PAIR types',function(t){
//    var pair         = nano.socket('pair')
//    t.equal(s( pair.socket ),        0, 'opened NN_PAIR')
//    pair.close()
//    t.end()
//  })
//  t.test('open NN_PUB NN_SUB types',function(t){
//    t.plan(2)
//    var pub         = nano.socket('pub')
//    var sub         = nano.socket('sub')
//    t.equal(s( pub.socket ),        0, 'opened NN_PUB')
//    t.equal(s( sub.socket ),        0, 'opened NN_SUB')
//    pub.close()
//    sub.close()
//  })
//  t.test('open NN_BUS NN_PAIR types',function(t){
//    t.plan(2)
//    var bus         = nano.socket('bus')
//    var pair        = nano.socket('pair')
//    t.equal(s( bus.socket ),        0, 'opened NN_BUS')
//    t.equal(s( pair.socket ),       0, 'opened NN_PAIR')
//    bus.close()
//    pair.close()
//  })
//  t.test('open NN_REQ NN_REP types',function(t){
//    t.plan(2)
//    var req         = nano.socket('req')
//    var rep         = nano.socket('rep')
//    t.equal(s( req.socket ),        0, 'opened NN_REQ')
//    t.equal(s( rep.socket ),        0, 'opened NN_REP')
//    req.close()
//    rep.close()
//  })
//  t.test('open NN_PULL NN_PUSH types',function(t){
//    t.plan(2)
//    var push        = nano.socket('push')
//    var pull        = nano.socket('pull')
//    t.equal(s( push.socket ),       0, 'opened NN_PUSH')
//    t.equal(s( pull.socket ),       0, 'opened NN_PULL')
//    push.close()
//    pull.close()
//  })

//  t.test('open NN_RESPONDENT NN_SURVEYOR types',function(t){
//    t.plan(2)
//    var respondent  = nano.socket('respondent')
//    var surveyor    = nano.socket('surveyor')
//    t.equal(s( respondent.socket ), 0, 'opened NN_RESPONDENT')
//    t.equal(s( surveyor.socket ),   0, 'opened NN_SURVEYOR')
//    respondent.close()
//    surveyor.close()
//  })


}

function s(v){
  if(v > -1) return 0
  else return -1
}
