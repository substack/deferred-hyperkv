# deferred-hyperkv

defer operations on a [hyperkv][1]

[1]: https://npmjs.com/package/hyperkv

# example

``` js
var hyperkv = require('hyperkv')
var hyperlog = require('hyperlog')
var level = require('level')
var defkv = require('deferred-hyperkv')

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
```

# api

``` js
var defkv = require('deferred-hyperkv')
```
## var kv = defkv()

Create a new deferred hyperkv instance `kv`.

`kv` has all the methods of a typical [hyperkv][1] instance.

## kv.setKV(newkv)

Defer all batched and future operations to `newkv`.

Call `kv.setKV()` with no argument to stop sending operations to the previously
set kv instance.

Operations are switched to the latest `newkv` provided to `setKV()`.

# install

```
npm install deferred-hyperkv
```

# license

BSD
