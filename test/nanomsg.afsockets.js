var nano = require('..')
module.exports = function (t) {
  t.test('returns a beta release version', function(t) {
    t.plan(1)
    t.ok(require('..').version < 6, 'beta version:' + require('..').version )
  })
  var pub, sub, pair, push, pull, respondent, surveyor, req, rep, bus
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
  t.test('start socket: NN_SURVEYOR',function(t){
    t.plan(1)
    surveyor = nano.socket('surveyor')
    t.equal(s( surveyor.socket ),        0, 'opened NN_SURVEYOR')
  })
  t.test('stop socket: NN_SURVEYOR',function(t){
    t.plan(1)
    surveyor.close(function(msg){
      t.equal(msg, 16, 'closed NN_SURVEYOR')
    })
  })
  t.test('start socket: NN_RESPONDENT',function(t){
    t.plan(1)
    respondent = nano.socket('respondent')
    t.equal(s( respondent.socket ),        0, 'opened NN_RESPONDENT')
  })
  t.test('stop socket: NN_RESPONDENT',function(t){
    t.plan(1)
    respondent.close(function(msg){
      t.equal(msg, 16, 'closed NN_RESPONDENT')
    })
  })
  t.test('start socket: NN_REQ',function(t){
    t.plan(1)
    req = nano.socket('req')
    t.equal(s( req.socket ),        0, 'opened NN_REQ')
  })
  t.test('stop socket: NN_REQ',function(t){
    t.plan(1)
    req.close(function(msg){
      t.equal(msg, 16, 'closed NN_REQ')
    })
  })
  t.test('start socket: NN_REP',function(t){
    t.plan(1)
    rep = nano.socket('rep')
    t.equal(s( rep.socket ),        0, 'opened NN_REP')
  })
  t.test('stop socket: NN_REP',function(t){
    t.plan(1)
    rep.close(function(msg){
      t.equal(msg, 16, 'closed NN_REP')
    })
  })
  t.test('start socket: NN_BUS',function(t){
    t.plan(1)
    bus = nano.socket('bus')
    t.equal(s( bus.socket ),        0, 'opened NN_BUS')
  })
  t.test('stop socket: NN_BUS',function(t){
    t.plan(1)
    bus.close(function(msg){
      t.equal(msg, 16, 'closed NN_BUS')
    })
  })
}

function s(v){
  if(v > -1) return 0
  return -1
}
