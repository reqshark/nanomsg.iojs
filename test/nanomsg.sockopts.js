var nano = require('..')
var req = nano.socket('req'), rep

module.exports = function (t) {
  t.test('tcp nodelay: opts initializer and setsockopt methods', function(t){

    //set tcp nodelay from `socket(type, opts)`
    rep = nano.socket('rep', {
      tcpnodelay: true
    })

    //set tcp nodelay from native setsockopt()
    t.equal( req.setsockopt('NN_TCP','NN_TCP_NODELAY',1), 0,
      'setsockopt tcpnodelay: returns zero when successfully set by native lib')

    //get tcp nodelay from native getsockopt()
    t.equal( rep.getsockopt('NN_TCP','NN_TCP_NODELAY'), 1,
      'getsockopt tcpnodelay: verified rep opts initializer setting')

    t.equal( req.getsockopt('NN_TCP','NN_TCP_NODELAY'), 1,
      'getsockopt tcpnodelay: verified native setting using setsockopt')

    //typo/error: insert asdf in lieu of proper nodelay symbol
    t.equal( req.getsockopt('NN_TCP','NN_TCP_ASDF'), undefined,
      'getsockopt tcpnodelay: return undefined if there was a getsockopt error')

    //using the native function to re-enable Nagle's algorithm (socket default)
    rep.setsockopt('NN_TCP','NN_TCP_NODELAY',0)

    //`socket.tcpnodelay()` method
    t.equal( req.tcpnodelay(), 'tcp nodelay: on', 'req.tcpnodelay(): on')
    t.equal( rep.tcpnodelay(), 'tcp nodelay: off', 'rep.tcpnodelay(): off')
    t.equal( req.tcpnodelay(false), 'tcp nodelay: off',
      'req.tcpnodelay(false) sets to: off')
    t.equal( req.tcpnodelay(), 'tcp nodelay: off',
      'req.tcpnodelay() gets: off')
    t.equal( req.tcpnodelay(true), 'tcp nodelay: on',
      'req.tcpnodelay(true) sets: on')
    t.equal( req.tcpnodelay(), 'tcp nodelay: on',
      'req.tcpnodelay() gets: on')
    t.end()
  })

  t.test('nanomsg.iøjs sockopt methods', function(t){

    //linger
    t.equal( req.linger(5000), 'linger set to 5000ms', 'req.linger(5000) sets: 5000ms')
    t.equal( req.linger(), 5000, 'req.linger() gets: 5000')

    //sndbuf
    t.equal( req.sndbuf(1024), 'sndbuf set to 1024 bytes', 'req.sndbuf(1024) sets: 1024 bytes')
    t.equal( req.sndbuf(), 1024, 'req.sndbuf() gets: 1024')

    //rcvbuf
    t.equal( req.rcvbuf(102400), 'rcvbuf set to 102400 bytes', 'req.rcvbuf(102400) sets: 102400 bytes')
    t.equal( req.rcvbuf(), 102400, 'req.rcvbuf() gets: 102400')

    //sndtimeo
    t.equal( req.sndtimeo(500), 'sndtimeo set to 500ms', 'req.sndtimeo(500) sets: 500ms')
    t.equal( req.sndtimeo(), 500, 'req.sndtimeo() gets: 500')

    //rcvtimeo
    t.equal( req.rcvtimeo(200), 'rcvtimeo set to 200ms', 'req.rcvtimeo(200) sets: 200ms')
    t.equal( req.rcvtimeo(), 200, 'req.rcvtimeo() gets: 200')

    //reconn
    t.equal( req.reconn(500), 'reconn set to 500ms', 'req.reconn(500) sets: 500ms')
    t.equal( req.reconn(), 500, 'req.reconn() gets: 500')

    //maxreconn
    t.equal( req.maxreconn(100000), 'maxreconn set to 100000ms', 'req.maxreconn(100000) sets: 100000ms')
    t.equal( req.maxreconn(), 100000, 'req.maxreconn() gets: 100000')

    //sndprio
    t.equal( req.sndprio(3), 'sndprio set to 3', 'req.sndprio(3) sets: 3 priority')
    t.equal( req.sndprio(), 3, 'req.sndprio() gets: 3')

    //rcvprio
    t.equal( req.rcvprio(10), 'rcvprio set to 10', 'req.rcvprio(10) sets: 10 priority')
    t.equal( req.rcvprio(), 10, 'req.rcvprio() gets: 10')

    req.close()
    rep.close()
    t.end()
  })
}
