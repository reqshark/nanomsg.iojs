var nano = require('../')
var assert = require('assert')

if (process.argv.length != 5) {
  console.log('usage: remote_thr <bind-to> <message-size> <message-count>')
  process.exit(1)
}

var connect_to = process.argv[2]
var message_size = Number(process.argv[3])
var message_count = Number(process.argv[4])
var message = new Buffer(message_size)
message.fill('h')

var counter = 0

var sock = nano.socket('push')
sock.connect(connect_to)

function send(){
  for (var i = 0; i < message_count; i++) {
    sock.send(message)
  }

  // all messages may not be received by local_thr if closed immediately
  setTimeout(function () {
    sock.close()
  }, 1000);
}

setTimeout(send, 1000);
