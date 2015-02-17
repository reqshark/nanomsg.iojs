require('tape')('libnanomsg', function(t) {
  t.test('returns a beta release version', function(t) {
    t.plan(1)
    t.ok(require('..').version < 6, 'beta version:' + require('..').version )
    t.end()
    process.exit(0)
  })
})
