var nano = require('..')
module.exports = function (t) {

  var pub, sub, pair, push, pull, respondent, surveyor, req, rep, bus

  t.test('socket: NN_PUB', function(t) {
    t.plan(2)

    pub = nano.socket('pub')
    t.equal(s( pub.socket ), 0, 'opened NN_PUB')

    pub.close(function(msg){
      //push and pub sockets should close nearly immediately
      t.equal(msg,'closing a pub or a push', 'closed NN_PUB')
    })

  })

  t.test('socket: NN_SUB', function(t) {

    t.plan(2)

    sub = nano.socket('sub')
    t.equal(s( sub.socket ), 0, 'opened NN_SUB')

    sub.close(function(msg){
      // use this callback to understand when the socket is going to close.
      // 16 bytes is the size of a message sent to unhook the poll worker
      // this happens relatively quick (around 20ms) regardless of linger opts
      t.equal(msg, 16, 'closed NN_SUB')
    })
  })

  t.test('socket: NN_PAIR',function(t){

    t.plan(2)

    pair = nano.socket('pair')
    t.equal(s( pair.socket ), 0, 'opened NN_PAIR')

    pair.close(function (msg){
      t.equal(msg, 16, 'closed NN_PAIR')
    })
  })

  t.test('socket: NN_PUSH',function(t){

    t.plan(2)

    push = nano.socket('push')
    t.equal(s( push.socket ), 0, 'opened NN_PUSH')

    push.close(function(msg){
      t.equal(msg,'closing a pub or a push', 'closed NN_PUSH')
    })
  })

  t.test('socket: NN_PULL',function(t){

    t.plan(2)

    pull = nano.socket('pull')
    t.equal(s( pull.socket ), 0, 'opened NN_PULL')

    pull.close(function(msg){
      t.equal(msg, 16, 'closed NN_PULL')
    })
  })

  t.test('socket: NN_SURVEYOR',function(t){
    t.plan(2)

    surveyor = nano.socket('surveyor')
    t.equal(s( surveyor.socket ), 0, 'opened NN_SURVEYOR')

    surveyor.close(function(msg){
      t.equal(msg, 16, 'closed NN_SURVEYOR')
    })
  })

  t.test('socket: NN_RESPONDENT',function(t){

    t.plan(2)

    respondent = nano.socket('respondent')
    t.equal(s( respondent.socket ), 0, 'opened NN_RESPONDENT')

    respondent.close(function(msg){
      t.equal(msg, 16, 'closed NN_RESPONDENT')
    })
  })

  t.test('socket: NN_REQ',function(t){

    t.plan(2)

    req = nano.socket('req')
    t.equal(s( req.socket ), 0, 'opened NN_REQ')

    req.close(function(msg){
      t.equal(msg, 16, 'closed NN_REQ')
    })
  })

  t.test('socket: NN_REP',function(t){

    t.plan(2)

    rep = nano.socket('rep')
    t.equal(s( rep.socket ), 0, 'opened NN_REP')

    rep.close(function(msg){
      t.equal(msg, 16, 'closed NN_REP')
    })
  })
  t.test('socket: NN_BUS',function(t){

    t.plan(2)

    bus = nano.socket('bus')
    t.equal(s( bus.socket ), 0, 'opened NN_BUS')

    bus.close(function(msg){
      t.equal(msg, 16, 'closed NN_BUS')
    })
  })
}

function s(v){
  if(v > -1) return 0
  return -1
}
