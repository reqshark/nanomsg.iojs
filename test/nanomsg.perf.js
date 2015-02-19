var nano        = require('..')
var through     = require('through')

module.exports  = function (t) {

  var sent      = 0
  var recv      = 0

  t.test('send 100K messages',function(t){
    var addr    = 'tcp://127.0.0.1:44448'
    var pub     = nano.socket('pub')
    var sub     = nano.socket('sub')

    sub.connect(addr)
    pub.bind(addr)

    sub.on('data',function(msg){
      if(sent > 99999){

        t.equal(sent, 100000, 'sent 100K')

        pub.close()

        sub.close(function(){

          t.end()

        })

      }
    })

    do pub.write('count it')
    while(++sent < 100000)
  })

  t.test('recv 30K messages', function(t){
    var addr    = 'tcp://127.0.0.1:44449'
    var push    = nano.socket('push', { tcpnodelay: true })
    var pull    = nano.socket('pull', { tcpnodelay: true })

    pull.connect(addr)
    push.bind(addr)

    var start = Date.now()

    pull.pipe(through(function(msg){
      if(++recv > 30000){

        t.equal(recv, 30001, 'piped 30K msgs to a transform stream in '
          + (Date.now() - start)/1000 + ' seconds')

        push.close()

        pull.close( function(){

          t.end()

        })
      }

      this.queue(null)
    }))

    var buf = Buffer('get it')

    do push.write(buf)
    while (--sent > 69999)

  })

}
