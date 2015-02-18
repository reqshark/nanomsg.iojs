require ('fs').readdir(__dirname, files )

function files(er, fs){

  fs.shift()

  fs.forEach(specRunner)

  function specRunner(f){

    require ('tape') ( f, require ( './' + f ) )

  }

}
