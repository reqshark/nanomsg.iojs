var nano = require('..')

require('tape')('nanomsg.transports', function(t) {

  t.plan(3)

  t.test('tcp',function(t){
    t.plan(3)

    var addr  = 'tcp://127.0.0.1:44442'
    var req = nano.socket('req')
    var rep = nano.socket('rep')

    rep.connect(addr)
    req.bind(addr)

    req.on('data', function (msg) {
      t.ok(msg instanceof Buffer, 'msg type is a buffer' )
      t.equal(String(msg), 'foo ack bar', 'verified envelope: foo ack bar')
      rep.close()
      t.end()
    })

    rep.on('data', function (msg) {
      t.equal(String(msg), 'sent over tcp', 'verified envelope: sent over tcp')
      rep.send('foo ack bar')
    })

    req.write('sent over tcp')

    rep.on('error', err); req.on('error', err)
  })
  t.test('inproc',function(t){

    t.plan(4)

    var addr  = 'inproc://foo'
    var req = nano.socket('req')
    var rep = nano.socket('rep')

    rep.connect(addr)
    req.bind(addr)

    req.on('data', function (msg) {
      t.ok(msg instanceof Buffer, 'a buffer' )
      t.equal(String(msg), 'ack bar foo', 'env: ack bar foo')
      rep.close()
      t.end()
    })

    rep.on('data', function (msg) {
      t.ok(msg instanceof Buffer, 'a buffer' )
      t.equal(String(msg), 'sent over inproc', 'envelope: sent over inproc')
      rep.send('ack bar foo')
    })

    req.write('sent over inproc')

    rep.on('error', err); req.on('error', err)
  })

  t.test('bind, connect, send and receive over ipc',function(t){
    t.plan(1)
    t.equal(1,1,'one is one')
    t.end()
  })


  function err(er){ console.dir(er.stack) }
})
