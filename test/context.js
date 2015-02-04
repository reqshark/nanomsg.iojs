var nano    = require('..')
var should  = require('should')

describe('context', function() {

  it('should appreciate zero context', function (done) {
    var copy = 'ø'; copy.should.equal('ø')
    done()
  })

  it('should return beta version minor integer when asked', function(done){

    var libnanomsgBetaVersion = nano.version

    libnanomsgBetaVersion.should.be.below(6)

    done()
  })

  it('should return a beta release version string', function(done){

    console.log('libnanomsg version:', nano.versionstr)

    done()

  })
})
