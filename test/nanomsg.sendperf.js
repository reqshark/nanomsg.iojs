var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.sendperf', function() {

  var pub    = nano.socket('pub')
  var sub    = nano.socket('sub',{
    asBuffer:true,
    stopBufferOverflow: true
  })
  var recv    = 0
  var addr    = 'inproc://whatever'

  sub.connect(addr)

  it('should send a million messages', function(done){

    pub.bind(addr)

    sub.on('msg',function(msg){

      if(recv > 999999){
        sub.close(); pub.close();
        recv.should.equal(1000000)
        done()
      }
    })

    while(++recv < 1000000){
      pub.send('count it')
    }
  })
})
