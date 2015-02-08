var nano = require('../');
var assert = require('assert');

if (process.argv.length != 5) {
  console.log('usage: local_thr <bind-to> <msg-size> <msg-count>');
  process.exit(1);
}

var bind_to = process.argv[2];
var message_size = Number(process.argv[3]);
var message_count = Number(process.argv[4]);
var counter = 0;

var sock = nano.socket('pull',{
//  stopBufferOverflow:true
});
sock.bind(bind_to);

var timer;

sock.on('msg', function (data) {
  if (!timer) {
    console.log('started receiving');
    timer = process.hrtime();
  }

  assert.equal(data.length, message_size, 'msg-size did not match');
  if (++counter === message_count) finish();
})

function finish(){
  var endtime = process.hrtime(timer);
  var sec = endtime[0] + (endtime[1]/1000000000);
  var throughput = message_count / sec;
  var megabits = (throughput * message_size * 8) / 1000000;

  console.log('msg size: %d [B]', message_size);
  console.log('msg count: %d', message_count);
  console.log('mean throughput: %d [msg/s]', throughput.toFixed(0));
  console.log('mean throughput: %d [Mbit/s]', megabits.toFixed(0));
  console.log('overall time: %d secs and %d nanoseconds', endtime[0], endtime[1]);
  sock.close();
}
