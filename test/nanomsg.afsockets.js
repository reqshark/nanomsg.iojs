var nano = require('..')

require('tape')('nanomsg.sockets', function(t) {

  t.plan(1)

  t.test('open NN types',function(t){

    t.plan(10)

    var pub = nano.socket('pub')
    var sub = nano.socket('sub')
    var bus = nano.socket('bus')
    var pair = nano.socket('pair')
    t.equal(s( pub.socket ), 0, 'opened NN_PUB')
    t.equal(s( sub.socket ), 0, 'opened NN_SUB')
    t.equal(s( bus.socket ), 0, 'opened NN_BUS')
    t.equal(s( pair.socket ), 0, 'opened NN_PAIR')
    pub.close()
    sub.close()
    bus.close()
    pair.close()

    var surv = nano.socket('surv')
    var resp = nano.socket('resp')
    var req = nano.socket('req')
    var rep = nano.socket('rep')
    var pull = nano.socket('pull')
    var push = nano.socket('push')
    t.equal(s( surv.socket ), 0, 'opened NN_SURVEYOR')
    t.equal(s( resp.socket ), 0, 'opened NN_RESPONDENT')
    t.equal(s( req.socket ), 0, 'opened NN_REP')
    t.equal(s( rep.socket ), 0, 'opened NN_REQ')
    t.equal(s( pull.socket ), 0, 'opened NN_PULL')
    t.equal(s( push.socket ), 0, 'opened NN_PUSH')
    surv.close()
    resp.close()
    req.close()
    rep.close()
    pull.close()
    push.close()

    t.end()
  })
})

function s(v){
  if(v > -1) return 0
  return -1
}
