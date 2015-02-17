var f = -1

var path = require('path');
require('fs').readdir(__dirname,files)
function files(er,fls){

  fls.shift() //knock this index.js itself off the test run

  //run()

//  function run(){
//    if ( fls.length-1 > f++ ) require('child_process').spawn('node',
//                                       //sequential execution
//      ['test/'+fls[f]],{ stdio:'inherit'}).on('close', run ).on('error', err )
//  }

//  function run(){
//    if ( fls.length-1 > f++ ){
//      //require('child_process').spawnSync('node'['test/'+fls[f]], { stdio:'inherit'})
//      //run()
//      require('child_process').fork(fls[f]).on('message', function(msg){
//        console.log(msg)
//      })
//    }
//  }

  var test = require('tape')

  test.createStream().pipe(process.stdout)

  fls.forEach(function (file) {
    require(path.resolve('test/'+file));
  })


}

//function err(er){ console.dir(er.stack) }
