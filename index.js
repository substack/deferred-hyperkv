var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var duplexify = require('duplexify')

module.exports = KV
inherits(KV, EventEmitter)

function KV () {
  var self = this
  if (!(self instanceof KV)) return new KV
  self._onput = function (key, value, node) {
    self.emit('put', key, value, node)
  }
  self._onupdate = function (key, value, node) {
    self.emit('update', key, value, node)
  }
}
KV.prototype.setKV = function (kv) {
  if (this._kv) {
    this.removeListener('put', this._onput)
    this.removeListener('update', this._onupdate)
  }
  kv.on('put', this._onput)
  kv.on('update', this._onupdate)
  this._kv = kv
  this.emit('_kv', kv)
}
KV.prototype.put = function (key, value, opts, cb) {
  if (this._kv) this._kv.put(key, value, opts, cb)
  else this.once('_kv', function (kv) { kv.put(key, value, opts, cb) })
}
KV.prototype.get = function (key, opts, cb) {
  if (this._kv) this._kv.get(key, opts, cb)
  else this.once('_kv', function (kv) { kv.get(key, opts, cb) })
}
KV.prototype.del = function (key, opts, cb) {
  if (this._kv) this._kv.del(key, opts, cb)
  else this.once('_kv', function (kv) { kv.del(key, opts, cb) })
}
KV.prototype.batch = function (rows, opts, cb) {
  if (this._kv) this._kv.batch(rows, opts, cb)
  else this.once('_kv', function (kv) { kv.batch(rows, opts, cb) })
}
KV.prototype.createReadStream = function (opts) {
  if (this._kv) return this._kv.createReadStream(opts)
  var d = duplexify.obj()
  this.once('_kv', function (kv) {
    d.setReadable(kv.createReadStream(opts))
  })
  return d
}
KV.prototype.createHistoryStream = function (key, opts) {
  if (this._kv) return this._kv.createHistoryStream(key, opts)
  var d = duplexify.obj()
  this.once('_kv', function (kv) {
    d.setReadable(kv.createHistoryStream(key, opts))
  })
  return d
}
