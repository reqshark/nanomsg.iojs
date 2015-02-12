var nano    = require('..')
var should  = require('should')
var semver  = require('semver')

describe('nanomsg.sendperf', function() {

  var pub    = nano.socket('pub')
  var sub    = nano.socket('sub',{ stopBufferOverflow: true })
  var recv    = 0, addr    = 'inproc://whatever'

  sub.connect(addr)

  it('should send a hundred thousand messages', function (done) {

    pub.bind(addr)

    sub.on('data',function(msg){

      if(recv > 99999){
        sub.close(); pub.close();
        recv.should.equal(100000)
        done()
      }
    })

    do pub.write('count it')
    while(++recv < 100000)
  })
})
