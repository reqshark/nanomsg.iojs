var nano = require('..')
module.exports = function (t) {

  t.test('tcp',function(t){

    var addr  = 'tcp://127.0.0.1:44442'
    var push = nano.socket('push')
    var pull = nano.socket('pull')

    push.connect(addr)
    pull.bind(addr)

    pull.on('data', function (msg) {

      t.ok(msg instanceof Buffer, 'msg type is a buffer' )
      t.equal(String(msg), 'sent over tcp', 'verified envelope: over tcp')

      push.close()
      pull.close()

      t.end()
    })

    push.write('sent over tcp')
    push.on('error', err); pull.on('error', err)
  })
  t.test('inproc',function(t){

    var addr  = 'inproc://transport'
    var push = nano.socket('push')
    var pull = nano.socket('pull')

    push.connect(addr)
    pull.bind(addr)

    pull.on('data', function (msg) {
      t.ok(msg instanceof Buffer, 'msg type is a buffer' )
      t.equal(String(msg), 'sent over inproc', 'verified envelope: over inproc')

      push.close()
      pull.close()

      t.end()

    })

    push.write('sent over inproc')
    push.on('error', err); pull.on('error', err)

  })
  t.test('ipc',function(t){

    var addr  = 'ipc://transport'
    var push = nano.socket('push')
    var pull = nano.socket('pull')

    push.connect(addr)
    pull.bind(addr)

    pull.on('data', function (msg) {
      t.ok(msg instanceof Buffer, 'msg type is a buffer' )
      t.equal(String(msg), 'sent over ipc', 'verified envelope: over ipc')

      push.close()
      pull.close()

      t.end()

    })

    push.write('sent over ipc')
    push.on('error', err); pull.on('error', err)

  })
}

function err(er){
  console.log(er.stack)
}
