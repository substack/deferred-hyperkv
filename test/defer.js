var hyperkv = require('hyperkv')
var hyperlog = require('hyperlog')
var memdb = require('memdb')
var defkv = require('../')
var test = require('tape')

test('defer', function (t) {
  t.plan(2)
  var kv = defkv()
  kv.put('x', 555, function (err) {
    kv.get('x', function (err, values) {
      t.error(err)
      var keys = Object.keys(values)
      var expected = {}
      expected[keys[0]] = 555
      t.deepEqual(values, expected)
    })
  })
  setTimeout(function () {
    kv.setKV(hyperkv({
      db: memdb(),
      log: hyperlog(memdb(), { valueEncoding: 'json' })
    }))
  }, 1)
})
