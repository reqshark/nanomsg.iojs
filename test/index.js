var f = -1
require('fs').readdir(__dirname,files)
function files(er,fls){

  fls.shift() //knock this index.js itself off the test run

  run()

  function run(){
    if(fls.length-1 > f++){

      var t = require('child_process').spawn('node',
        ['test/'+fls[f]] , { stdio:'inherit' } )

      //sequential execution
      t.on('close', run )
    }
  }

}
