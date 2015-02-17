var f = -1
require('fs').readdir(__dirname,files)
function files(er,fls){

  fls.shift() //knock this index.js itself off the test run

  run()

  function run(){
    if ( fls.length-1 > f++ ) require('child_process').spawn('node',

                                       //sequential execution
      ['test/'+fls[f]],{ stdio:'inherit'}).on('close', run ).on('error', err )
  }

}

function err(er){ console.dir(er.stack) }
