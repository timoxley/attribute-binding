const fs = require('fs')
const domify = require('domify')
const test = require('tape')
const PolymerExpressions = require('polymer-expressions')
const CustomElement = require('custom-element')

const AttributeBinding = require('../index')

let NoBinding = CustomElement()
AttributeBinding(NoBinding)

document.registerElement('no-binding', NoBinding)

let template = () => domify(`
  <template bind="{{ {data: true} }}">
    <no-binding data="{{data}}"></no-binding>
  </template>
`)

test('does not crash with no bindings', function(t) {
  let el = template().createInstance({}, new PolymerExpressions())
  document.body.innerHTML = ''
  document.body.appendChild(el)
  setTimeout(function() {
    t.end()
  })
})
