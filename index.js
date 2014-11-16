module.exports = function(Definition) {
  "use strict"

  if (Definition.bind) return Definition.bind
  var proto = Definition.prototype

  var bindings = Definition.bindings = Definition.bindings || []

  Definition.prototype.bind = function bind(name, observer) {
    let observers = this._observers
    if (observers[name] && observers[name] !== observer) {
      observers[name].close()
    }
    return observers[name] = observer
    //let newObserver = cloneObserver(observer)
    //return HTMLElement.prototype.bind.call(this, name, newObserver)
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

function cloneObserver(observer) {
  let newObserver = undefined

  if (observer instanceof Path) {
    return Path.get(observer)
  }
  if (observer instanceof PathObserver) {
    newObserver = new PathObserver(observer.object_, observer.path_)
  }
  if (observer instanceof ArrayObserver) {
    newObserver = new ArrayObserver(observer.value_)
  }
  if (observer instanceof ObjectObserver) {
    newObserver = new ObjectObserver(observer.value_)
  }
  if (observer instanceof ObserverTransform) {
    newObserver = new ObserverTransform(
      cloneObserver(observer.observable_),
      observer.getValueFn_,
      observer.setValueFn_,
      observer.dontPassThroughSet_
    )
  }

  if (observer instanceof CompoundObserver) {
    newObserver = new CompoundObserver(observer.reportChangesOnOpen_)

    for (let i = 0; i < observer.observed_.length; i += 2) {
      let object = observer.observed_[i]
      let observ = observer.observed_[i + 1]
      if (observ instanceof Path) {
        newObserver.addPath(object, Path.get(observ))
      } else {
        newObserver.addObserver(cloneObserver(observ))
      }
    }
  }

  if (!newObserver) throw new Error('Could not clone observer:' + observer)

  if (observer.callback_) {
    newObserver.open(observer.callback_)
  }

  return newObserver
}
