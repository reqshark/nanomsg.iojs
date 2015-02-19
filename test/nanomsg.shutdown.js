var nano = require('..')
var actives = [], i = 0, msgs = 0
var pubs  = {
  p1      : nano.socket('pub'),
  p2      : nano.socket('pub'),
  p3      : nano.socket('pub'),
  p4      : nano.socket('pub'),
  p5      : nano.socket('pub')
}
var sub   = nano.socket('sub')

module.exports = function (t) {

  var addr  = 'tcp://127.0.0.1:4445'

  t.test('bind five heterogeneous pub connections to a subscriber',function(t){

    //bind/connect five pubs to one sub from tcp ports 44451 to 44455
    while(++i <= 5) pubs['p'+i].bind( addr + i)
    while(--i > 0) sub.connect( addr + i)

    //verify connection addresses known by publishers
    while(++i <= 5) t.ok(has(pubs['p'+i],'how'),'pub p'+i+' \'how\' property check')
    while(i-- > 1) t.ok(has(pubs['p'+i].how, addr+i ),'pub p'+i+' addr: '+ addr+i)

    t.end()
  })

  t.test('shutdown the sub\'s connections',function(t){

    t.equal( Object.keys(sub.how).length, 5, 'subscriber connections: 5' )

    sub.setEncoding('utf8')
    sub.on('data', function(msg){

      //lets crash and burn if we keep getting messages after shutdown
      if (msgs > 10) throw 'it'

      switch (msg) {

        case 'hello from p1': if (++msgs == 10) {

          t.equal( sub.shutdown(addr+1),
            'connect endpoint tcp://127.0.0.1:44451 shutdown',
            'shutting down connection to endpoint: tcp://127.0.0.1:44451' )

          t.equal( Object.keys(sub.how).length, 4, 'subscriber connections: 4' )

        } break

        case 'hello from p2': if (msgs == 10) {

          t.equal( sub.shutdown(addr+2),
            'connect endpoint tcp://127.0.0.1:44452 shutdown',
            'shutting down connection to endpoint: tcp://127.0.0.1:44452' )

          t.equal( Object.keys(sub.how).length, 3, 'subscriber connections: 3' )

        } break

        case 'hello from p3': if (msgs == 10) {

          t.equal( sub.shutdown(addr+3),
            'connect endpoint tcp://127.0.0.1:44453 shutdown',
            'shutting down connection to endpoint: tcp://127.0.0.1:44453' )

          t.equal( Object.keys(sub.how).length, 2, 'subscriber connections: 2' )

        } break

        case 'hello from p4': if (msgs == 10) {

          t.equal( sub.shutdown(addr+4),
            'connect endpoint tcp://127.0.0.1:44454 shutdown',
            'shutting down connection to endpoint: tcp://127.0.0.1:44454' )

          t.equal( Object.keys(sub.how).length, 1, 'subscriber connections: 1' )

        } break

        case 'hello from p5': if (msgs == 10) {

          t.equal( sub.shutdown(addr+5),
            'connect endpoint tcp://127.0.0.1:44455 shutdown',
            'shutting down connection to endpoint: tcp://127.0.0.1:44455' )

          t.equal( Object.keys(sub.how).length, 0, 'subscriber connections: 0' )

          //clean up
          clearInterval(pubInterval)
          for(var p in pubs) pubs[p].close()
          sub.close(function(){ t.end() })

        } break
      }

    })


    //publish another five hellos after 5ms
    var pubInterval = setInterval( hellos, 5 )

    function hellos(){
      pubs.p1.write('hello from p1')
      pubs.p2.write('hello from p2')
      pubs.p3.write('hello from p3')
      pubs.p4.write('hello from p4')
      pubs.p5.write('hello from p5')
    }

  })

}

function has (obj, prop) {
  return Object.hasOwnProperty.call(obj, prop)
}
