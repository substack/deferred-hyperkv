var hyperkv = require('hyperkv')
var hyperlog = require('hyperlog')
var level = require('level')
var defkv = require('../')

var kv = defkv()

kv.get('count', function (err, values) {
  if (err) console.error(err)
  var keys = Object.keys(values)
  var count = values[keys[0]] || 0
  console.log(count)
  kv.put('count', count+1, function (err) {
    if (err) console.error(err)
  })
})

setTimeout(function () {
  kv.setKV(hyperkv({
    db: level('/tmp/count'),
    log: hyperlog(level('/tmp/log'), { valueEncoding: 'json' })
  }))
}, 500)
