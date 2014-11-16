const fs = require('fs')
const domify = require('domify')
const test = require('tape')
const PolymerExpressions = require('polymer-expressions')

document.registerElement('content-toggle', require('./toggle'))

let model = undefined

let template = () => domify(
  fs.readFileSync(__dirname + '/expressions.html', 'utf8')
)

function setup(t) {
  model = {
    toggle: {
      state: {
        closed: true
      }
    }
  }

  let el = template().createInstance(model, new PolymerExpressions())

  el.querySelector('button').addEventListener('click', function() {
    model.toggle.state.closed = !model.toggle.state.closed
  })

  document.body.innerHTML = ''
  document.body.appendChild(el)
}

test('expressions work', function(t) {
  setup(t)
  let all = document.querySelectorAll('content-toggle')
  setTimeout(function() {
    model.toggle.state.closed = false
    setTimeout(function() {
      t.comment('should be all open')
      t.equal(document.querySelectorAll('content-toggle h1.closed').length, 0, 'all is open')
      t.equal(document.querySelectorAll('content-toggle h1.open').length, all.length, 'all not closed')
      model.toggle.state.closed = true

      setTimeout(function() {
        t.comment('should be all closed')
        t.equal(document.querySelectorAll('content-toggle h1.open').length, 0, 'all not open')
        t.equal(document.querySelectorAll('content-toggle h1.closed').length, all.length, 'all is closed')
        t.end()
      })
    })
  })
})

test('expressions work opposite defaults', function(t) {
  setup(t)
  let all = document.querySelectorAll('content-toggle')
  setTimeout(function() {
    model.toggle.state.closed = true
    setTimeout(function() {
      t.comment('should be all closed')
      t.equal(document.querySelectorAll('content-toggle h1.open').length, 0, 'all not open')
      t.equal(document.querySelectorAll('content-toggle h1.closed').length, all.length, 'all is closed')
      model.toggle.state.closed = false

      setTimeout(function() {
        t.comment('should be all open')
        t.equal(document.querySelectorAll('content-toggle h1.closed').length, 0, 'all is open')
        t.equal(document.querySelectorAll('content-toggle h1.open').length, all.length, 'all not closed')
        t.end()
      })
    })
  })
})
