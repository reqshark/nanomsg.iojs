var nano        = require('..')
var through     = require('through')

module.exports  = function (t) {

  t.test('returns a beta release version', function(t) {

    t.plan(1)

    t.ok(require('..').version < 6, 'beta version:' + require('..').version )

  })

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

  t.test('recv 10K messages', function(t){

    var addr    = 'tcp://127.0.0.1:44449'
    var push    = nano.socket('push')
    var pull    = nano.socket('pull')

    pull.connect(addr)
    push.bind(addr)

    var start = Date.now()

    pull.pipe(through(function(msg){
      if(++recv > 10000){

        t.equal(recv, 10001, 'piped 10K received msgs to a transform stream in '
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
    while (--sent > 89999)
  })

}
