const fs = require('fs')
const domify = require('domify')
const test = require('tape')
const PolymerExpressions = require('polymer-expressions')

document.registerElement('definition-list', require('./definition-list'))

let model = undefined

test('setup', function(t) {
  let template = () => domify(
    fs.readFileSync(__dirname + '/values.html', 'utf8')
  )
  model = {
    name: 'TEST',
    items: [
      {name: 'red', value: '#FF0000'},
      {name: 'green', value: '#00FF00'},
      {name: 'blue', value: '#0000FF'}
    ]
  }
  let el = template().createInstance(model, new PolymerExpressions())

  document.body.innerHTML = ''
  document.body.appendChild(el)
  t.end()
})

test('string values are bound', function(t) {
  t.equal(document.querySelector('definition-list h3').textContent.trim(), model.name)
  t.end()
})

test('object values are bound', function(t) {
  var itemLength = document.querySelector('definition-list dl').title.trim()
  t.equal(parseInt(itemLength), model.items.length)
  t.end()
})

test('iterates arrays are bound', function(t) {
  let el = document.querySelector('definition-list')
  let dts = Array.from(el.querySelectorAll('dt'))
  let dds = Array.from(el.querySelectorAll('dd'))
  t.ok(el.querySelectorAll('dl').length)
  t.deepEqual(
    dts.map((dt) => dt.textContent.trim()),
    model.items.map((item) => item.name)
  )
  t.deepEqual(
    dds.map((dd) => dd.textContent.trim()),
    model.items.map((item) => item.value)
  )
  t.end()
})


