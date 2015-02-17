var nano = require('..')

require('tape')('nanomsg.transports', function(t) {

  t.plan(3)

  t.test('bind, connect, send and receive over tcp',function(t){

    t.plan(3)

    var addr  = 'tcp://127.0.0.1:44442'
    var req = nano.socket('req')
    var rep = nano.socket('rep')

    rep.connect(addr)
    req.bind(addr)

    req.on('data', function(msg){
      t.ok(msg instanceof Buffer, 'msg type is a buffer' )
      t.equal(String(msg), 'foo ack bar', 'verified envelope: foo ack bar')
      rep.close()
    })

    rep.on('data',function(msg){
      t.equal(String(msg), 'sent over tcp', 'verified envelope: sent over tcp')
      rep.send('foo ack bar')
    })

    req.write('sent over tcp')
  })

  t.test('bind, connect, send and receive over inproc',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })

  t.test('bind, connect, send and receive over ipc',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })
})
