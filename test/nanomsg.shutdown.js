var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.shutdown', function() {

  var addr  = 'tcp://127.0.0.1:4445', i=1, actives = []
  var pubs  = {
    p1      : nano.socket('pub'),
    p2      : nano.socket('pub'),
    p3      : nano.socket('pub'),
    p4      : nano.socket('pub'),
    p5      : nano.socket('pub')
  }
  var sub   = nano.socket('sub',{asBuffer:false})

  it('should bind and connect multiple',function(done){
    pubs.p1.bind(addr+1)
    pubs.p2.bind(addr+2)
    pubs.p3.bind(addr+3)
    pubs.p4.bind(addr+4)
    pubs.p5.bind(addr+5)

    sub.connect(addr+1)
    sub.connect(addr+2)
    sub.connect(addr+3)
    sub.connect(addr+4)
    sub.connect(addr+5)

    while(i<=5) pubs['p'+i++].should.be.an.instanceOf(Object).with.a.property('how')

    sub.should.be.an.instanceOf(Object).with.a.property('how')

    sub.how.should.have.a.property('tcp://127.0.0.1:44451')
    sub.how.should.have.a.property('tcp://127.0.0.1:44452')
    sub.how.should.have.a.property('tcp://127.0.0.1:44453')
    sub.how.should.have.a.property('tcp://127.0.0.1:44454')
    sub.how.should.have.a.property('tcp://127.0.0.1:44455')

    pubs.p1.how.should.have.a.property('tcp://127.0.0.1:44451')
    pubs.p2.how.should.have.a.property('tcp://127.0.0.1:44452')
    pubs.p3.how.should.have.a.property('tcp://127.0.0.1:44453')
    pubs.p4.how.should.have.a.property('tcp://127.0.0.1:44454')
    pubs.p5.how.should.have.a.property('tcp://127.0.0.1:44455')

    done()
  })

  it('should demonstrate a socket shutdown', function(done){

    Object.keys(sub.how).length.should.equal(5)

    sub.on('msg', function(msg){

      if(msg == 'hello from p1'){
        if(i++ == 10) console.log(sub.shutdown('tcp://127.0.0.1:44451'))

        //lets crash this test if we keep getting messages after shutdown
        if(i > 11) throw 'it'

        //one more msg after calling shutdown is acceptable
        if(i == 11){
          for(var h in sub.how) actives.push(h)
          actives.length.should.equal(4)
          if(actives.length < 5){
            //since there were five endpoints before shutting one
            //and now only four established endpoints, lets clean up
            //but before cleaning, wait 20ms to show we won't get another msg
            setTimeout(function(){
              clearInterval(pubInterval)
              for(var p in pubs) pubs[p].close()
              done()
            }, 20)
          }
        }
      }
    })

    var pubInterval = setInterval(function(){
      pubs.p1.send('hello from p1')
      pubs.p2.send('hello from p2')
      pubs.p3.send('hello from p3')
      pubs.p4.send('hello from p4')
      pubs.p5.send('hello from p5')
    },5)
  })

})
