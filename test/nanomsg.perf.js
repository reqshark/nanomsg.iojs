var nano        = require('..')

module.exports  = function (t) {

  var recv      = 0
  var addr      = 'tcp://127.0.0.1:44448'

  t.test('send 100K messages',function(t){
    var pub     = nano.socket('pub')
    var sub     = nano.socket('sub')

    sub.connect(addr)
    pub.bind(addr)

    sub.on('data',function(msg){
      if(recv > 99999){
        t.equal(recv,100000, 'sent 100K')
        pub.close()
        sub.close(function(){
          t.end()
        })
      }
    })

    do pub.write('count it')
    while(++recv < 100000)
  })

}
