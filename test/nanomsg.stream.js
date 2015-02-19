var nano = require('..')
module.exports = function (t) {

  var recv = 10001, buf = Buffer('count it')

  t.test('recv and process 10K msgs over 3 piped transform streams', function(t){

    var through = require('through')
    var pub     = nano.socket('pub')
    var sub     = nano.socket('sub')

    sub.connect('inproc://stream')
    pub.bind('inproc://stream')

    t.ok(has(sub,'readable'), 'sub is a readable stream with readable property')

    var bufToStr = through(function(msg){

      if (++recv > 10000) t.ok(msg instanceof Buffer, 'msg type is a buffer' )

      this.queue(String(msg))
    })

    var strToBuf = through(function(msg){

      if (recv > 10000){

        t.ok(typeof msg == 'string',
          'msg type was transform converted to a string' )

        t.equal(msg, 'count it',
          'verified envelope: count it. receiving 10K messages in each stream')
      }

      this.queue(Buffer(msg))
    })

    var backToBuf = through(function(msg){

      if (recv > 10000) {

        t.ok(msg instanceof Buffer,
          'msg type was transform converted back to a buffer' )

        //this is the last transform stream... so let's clean up
        pub.close()
        sub.close(function(){
          t.end()
        })

      }

      this.queue(null)
    })

    //kick 10K msgs onto the subscription stream
    do pub.write(buf)
    while (--recv > 0)

    sub.pipe(bufToStr).pipe(strToBuf).pipe(backToBuf)

  })
  t.test('pipe 10K msgs across incompatible endpoints, transports and protocols',function(t){

    var push    = nano.socket ('push')
    var pull    = nano.socket ('pull')

    var pub     = nano.socket ('pub')
    var sub     = nano.socket ('sub')
    var sub2   = nano.socket ('sub')
    var pub2   = nano.socket ('pub')

    var proxy   = nano.socket ('pub')
    var device1 = nano.socket ('sub')
    var device2 = nano.socket ('sub')

    //tcp transport
    //node streams blur the meaning of these transports.. or at least ignore it
    push.bind('tcp://127.0.0.1:55556')
    pull.connect('tcp://127.0.0.1:55556')
    pub2.bind('tcp://127.0.0.1:55557')
    sub2.connect('tcp://127.0.0.1:55557')

    //domain sockets
    pub.bind('ipc://pipe')
    sub.connect('ipc://pipe')

    //in-process transport
    proxy.bind('inproc://foobar')
    device1.connect('inproc://foobar')
    device2.connect('inproc://foobar')

    proxy.sleep(100)

    var d1 = Math.floor(Math.random()*1000)
    var d2 = Math.floor(Math.random()*1000)
    //race! which device stream will count 10K first?
    device1.on('data', function (data){

      if(d1 % 1000 == 0) t.equal(String(data), 'hello from nanomsg!!',
        'd1 recv count: ' + d1)

      if(++d1 > 10000 && !won) finish('device1')
    })
    device2.on('data', function (data){

      if(d2 % 1000 == 0) t.equal(String(data), 'hello from nanomsg!!',
        'd2 recv count: ' + d2)

      if(++d2 > 10000 && !won) finish('device2')
    })

    //pipe together messages going from subscribers to publishers, etc.
    pull.pipe(pub)
    sub.pipe(pub2)
    sub2.pipe(proxy)

    var num = 10001
    while(--num > 1) push.write('hello from nanomsg!!')

    var won = false
    function finish (winner){

      won = true
      console.log('and the winner is: %s!', winner)

      pull.close()
      sub2.close()
      pub2.close()
      push.close()
      pub.close()
      sub.close()
      proxy.close()
      device1.close()
      device2.close()

      t.end()
    }
  })
}

function has (obj, prop) {
  return Object.hasOwnProperty.call(obj, prop)
}
