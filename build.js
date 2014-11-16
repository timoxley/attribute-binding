"use strict";

var _slice = Array.prototype.slice;
"use strict";

module.exports = function (Definition) {
  if (Definition.bind) return Definition.bind;
  var proto = Definition.prototype;

  var bindings = Definition.bindings = Definition.bindings || [];

  Definition.prototype.bind = function bind(name, observer) {
    var observers = this._observers;
    if (observers[name] && observers[name] !== observer) {
      observers[name].close();
    }

    return observers[name] = observer;
  };

  Definition.on("created", function () {
    this._observers = {};
    this._listeners = Object.assign({}, Definition._listeners);
  });

  Definition.on("detached", function onDetached() {
    var observers = this._observers;
    for (var name in observers) {
      observers[name].close();
    }
  });

  Definition.on("attached", function onAttached() {
    var _this = this;
    var observers = this._observers;
    for (var name in observers) {
      (function (name) {
        observers[name].open(function () {
          var args = _slice.call(arguments);

          // deliver changes
          for (var i = 0; i < _this._listeners[name].length; i++) {
            _this._listeners[name][i].call.apply(_this._listeners[name][i], [_this].concat(Array.from(args)));
          }
        });

        // deliver initial value
        for (var i = 0; i < _this._listeners[name].length; i++) {
          _this._listeners[name][i].call(_this, observers[name].value_);
        }
      })(name);
    }
  });

  Definition._listeners = Definition._listeners || {};

  Definition.onChange = function (name, fn) {
    Definition._listeners[name] = Definition._listeners[name] || [];
    Definition._listeners[name].push(fn);
    return this;
  };

  return Definition;
};

