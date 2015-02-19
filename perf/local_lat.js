var nano = require('../');
var assert = require('assert');

if (process.argv.length != 5) {
  console.log('usage: local_lat <bind-to> <message-size> <roundtrip-count>');
  process.exit(1);
}

var bind_to = process.argv[2];
var message_size = Number(process.argv[3]);
var roundtrip_count = Number(process.argv[4]);
var counter = 0;

var rep = nano.socket('rep');
rep.bind(bind_to);

rep.on('data', function (data) {
  assert.equal(data.length, message_size, 'message-size did not match');
  rep.write(data);
  if (++counter === roundtrip_count){
    setTimeout( function(){
      process.exit(0)
    }, 1000);
  }
})
