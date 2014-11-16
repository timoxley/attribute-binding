"use strict"

module.exports = function(Definition) {
  if (Definition.bind) return Definition.bind
  var proto = Definition.prototype

  var bindings = Definition.bindings = Definition.bindings || []

  Definition.prototype.bind = function bind(name, observer) {
    let observers = this._observers
    if (observers[name] && observers[name] !== observer) {
      observers[name].close()
    }

    return observers[name] = observer
  }

  Definition.on('created', function() {
    this._observers = {}
    this._listeners = Object.assign({}, Definition._listeners)
  })

  Definition.on('detached', function onDetached() {
    let observers = this._observers
    for(let name in observers) {
      observers[name].close()
    }
  })

  Definition.on('attached', function onAttached() {
    let observers = this._observers
    for(let name in observers) {
      observers[name].open((...args) => {
        // deliver changes
        for (let i = 0; i < this._listeners[name].length; i++) {
          this._listeners[name][i].call(this, ...args)
        }
      })

      // deliver initial value
      for (let i = 0; i < this._listeners[name].length; i++) {
        this._listeners[name][i].call(this, observers[name].value_)
      }
    }
  })

  Definition._listeners = Definition._listeners || {}

  Definition.onChange = function(name, fn) {
    Definition._listeners[name] = Definition._listeners[name] || []
    Definition._listeners[name].push(fn)
    return this
  }

  return Definition
}
