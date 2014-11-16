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
  let expressions = new PolymerExpressions()
  expressions.ident = ((item) => item)
  let el = template().createInstance(model, expressions)

  document.body.innerHTML = ''
  document.body.appendChild(el)
  t.end()
})

test('string values are bound', function(t) {
  let h3s = Array.from(document.querySelectorAll('definition-list h3'))
  h3s.forEach((h3) => t.equal(h3.textContent.trim(), model.name))
  t.end()
})

test('object values are bound', function(t) {
  let dls = Array.from(document.querySelectorAll('definition-list dl'))
  dls.forEach((dl) => t.looseEqual(dl.title.trim(), model.items.length))
  t.end()
})

test('iterates arrays are bound', function(t) {
  let dfnLists = Array.from(document.querySelectorAll('definition-list'))
  dfnLists.forEach((el) => {
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
  })
  t.end()
})

test('updates with changes', function(t) {
  model.items.push({name: 'purple', value: '#FF00FF'})
  setTimeout(function() {
    let dfnLists = Array.from(document.querySelectorAll('definition-list'))
    dfnLists.forEach((el) => {
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
    })
    t.end()
  })
})
