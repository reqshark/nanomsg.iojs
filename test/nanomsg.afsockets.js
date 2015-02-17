var nano = require('..')

require('tape')('nanomsg.sockets', function(t) {

  t.plan(5)

  t.test('returns a beta release version', function(t) {
    t.plan(1)
    t.ok(require('..').version < 6, 'beta version:' + require('..').version )
  })


  t.test('open NN_PUB NN_SUB types',function(t){

    t.plan(2)

    var pub         = nano.socket('pub')
    var sub         = nano.socket('sub')

    t.equal(s( pub.socket ),        0, 'opened NN_PUB')
    t.equal(s( sub.socket ),        0, 'opened NN_SUB')

    pub.close()
    sub.close()
  })

//  t.test('open NN_RESPONDENT NN_SURVEYOR types',function(t){
//    t.plan(2)
//    var respondent  = nano.socket('respondent')
//    var surveyor    = nano.socket('surveyor')
//    t.equal(s( respondent.socket ), 0, 'opened NN_RESPONDENT')
//    t.equal(s( surveyor.socket ),   0, 'opened NN_SURVEYOR')
//    respondent.close()
//    surveyor.close()
//  })

  t.test('open NN_BUS NN_PAIR types',function(t){

    t.plan(2)

    var bus         = nano.socket('bus')
    var pair        = nano.socket('pair')

    t.equal(s( bus.socket ),        0, 'opened NN_BUS')
    t.equal(s( pair.socket ),       0, 'opened NN_PAIR')

    bus.close()
    pair.close()
  })

  t.test('open NN_REQ NN_REP types',function(t){

    t.plan(2)

    var req         = nano.socket('req')
    var rep         = nano.socket('rep')

    t.equal(s( req.socket ),        0, 'opened NN_REQ')
    t.equal(s( rep.socket ),        0, 'opened NN_REP')

    req.close()
    rep.close()
  })

  t.test('open NN_PULL NN_PUSH types',function(t){

    t.plan(2)

    var push        = nano.socket('push')
    var pull        = nano.socket('pull')

    t.equal(s( push.socket ),       0, 'opened NN_PUSH')
    t.equal(s( pull.socket ),       0, 'opened NN_PULL')

    push.close()
    pull.close()
  })

  function s(v){
    if(v > -1) return 0
    return -1
  }
})
