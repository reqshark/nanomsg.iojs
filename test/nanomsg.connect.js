var nano = require('..'), msgs = 0

var addr  = 'tcp://127.0.0.1:44445'
var addr2 = 'tcp://127.0.0.1:44446'
var addr3 = 'tcp://127.0.0.1:44447'

var pub  = nano.socket('pub')
var pub2 = nano.socket('pub')
var pub3 = nano.socket('pub')

//bind a few pub sockets
pub.bind(addr)
pub2.bind(addr2)
pub3.bind(addr3)

module.exports = function (t) {

  t.test('multiple heterogeneous connections', function (t) {

    var sub = nano.socket('sub')

    //connect three different pub sockets
    sub.connect(addr)
    sub.connect(addr2)
    sub.connect(addr3)

    sub.setEncoding('utf8')

    sub.on('data', function (msg) {

      if (msg.length > 27){

        t.equal(msg, 'hello from yet another source', 'msg source: pub3')

      } else {
        if (msg.length > 23){

          t.equal(msg, 'hello from another source', 'msg source: pub2')

        } else {

          t.equal(msg, 'hello from one source', 'msg source: pub')

        }
      }


      if(++msgs > 2) {

        pub.close()
        pub2.close()
        pub3.close()

        sub.close(function(){

          t.end()

        })
      }
    })

    pub.write('hello from one source')
    pub2.write('hello from another source')
    pub3.write('hello from yet another source')

  })
}
