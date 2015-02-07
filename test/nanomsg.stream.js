var nano    = require('..')
var should  = require('should')
var semver  = require('semver')
var through = require('through')

describe('nanomsg.stream', function() {

  it('should stream a hundred inbound messages', function(done){

    var pub    = nano.socket('pub'), recv = 0
    var sub    = nano.socket('sub',{
      stream: true,
      stopBufferOverflow:true
    })
    sub.connect('inproc://stream',{stopBufferOverflow: true})
    pub.bind('inproc://stream')

    sub.should.have.a.property('readable')

    //apply pressure and get some msgs out
    var publisher = setInterval(function(){
      pub.send('count it')
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

    sub.pipe(bufToStr).pipe(strToBuf).pipe(backToBuf)

  })

})
