var nano    = require('..')
var should  = require('should')
var semver  = require('semver')
var through = require('through')

describe('nanomsg.stream', function() {

  it('process a hundred messages over piped transform streams', function(done){

    var recv = 0

    var pub    = nano.socket('pub',{ stream: true })
    var sub    = nano.socket('sub',{
      stream: true,
      stopBufferOverflow:true
    })
    sub.connect('inproc://stream')
    pub.bind('inproc://stream')

    sub.stream.should.have.a.property('readable')

    //apply pressure and get some msgs out
    var publisher = setInterval(function(){
      pub.stream.write('count it')
    }, 5)

    var bufToStr = through(function(msg){
      msg.should.be.an.instanceOf(Buffer)
      this.queue(String(msg))
    })

    var strToBuf = through(function(msg){
      msg.should.be.an.instanceOf(String)
      msg.should.equal('count it'); recv++
      this.queue(Buffer(msg))
    })

    var backToBuf = through(function(msg){
      msg.should.be.an.instanceOf(Buffer)
      if(recv > 100){
        pub.close(); sub.close(); clearInterval(publisher)
        done()
      }
      this.queue(null)
    })

    sub.stream.pipe(bufToStr).pipe(strToBuf).pipe(backToBuf)

  })

  it('pipe incompatible endpoints, transports and protocols together', function(done){

    var push    = nano.socket ('push')
    var pub     = nano.socket ('pub',  { stream: true } )
    var sub     = nano.socket ('sub',  { stream: true } )
    var proxy   = nano.socket ('pub',  { stream: true } )
    var device1 = nano.socket ('sub',  { stream: true } )
    var device2 = nano.socket ('sub',  { stream: true } )
    var pull    = nano.socket ('pull', { stream: true } )
    var pair1   = nano.socket ('pair', { stream: true } )
    var pair2   = nano.socket ('pair', { stream: true } )

    //tcp
    push.bind('tcp://127.0.0.1:55556')
    pull.connect('tcp://127.0.0.1:55556')
    pair1.bind('tcp://127.0.0.1:55557')
    pair2.connect('tcp://127.0.0.1:55557')

    //domain sockets
    pub.bind('ipc://pipe')
    sub.connect('ipc://pipe')

    //in-process transport
    proxy.bind('inproc://foobar')
    device1.connect('inproc://foobar')
    device2.connect('inproc://foobar')

    //node streams blur the meaning of these transports.. or at least ignore it
    var pullstrm    = pull.stream
    var pubstrm     = pub.stream
    var substrm     = sub.stream
    var pair1strm   = pair1.stream
    var pair2strm   = pair2.stream
    var proxystrm   = proxy.stream
    var device1strm = device1.stream
    var device2strm = device2.stream

    //race! which devicestream will count 100 first?
    device1strm.on('data', function(data){
      String(data).should.equal('hello from nanomsg!!')
      if(++d1 > 100 && !won) finish('device1strm')
    })
    device2strm.on('data', function(data){
      String(data).should.equal('hello from nanomsg!!')
      if(++d2 > 100 && !won) finish('device2strm')
    })

    var d1 = Math.floor(Math.random()*100)
    var d2 = Math.floor(Math.random()*100)
    var won = false

    //pipe them together
    pair1strm.pipe(proxystrm)
    substrm.pipe(pair2strm)
    pullstrm.pipe(pubstrm)

    setInterval( source, 5 )

    function source(){
      push.send('hello from nanomsg!!')
    }

    function finish(winner){
      won = true
      console.log('and the winner is: %s!', winner)
      done()
    }
  })

})
