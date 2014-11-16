require('./index.js')

const test = require('tape')
const fs = require('fs')

const domify = require('domify')
var body = domify(fs.readFileSync(__dirname + '/index.html', 'utf8'))

document.body.appendChild(
  body
)

test('shudown', function(t) {
  t.end()
  setTimeout(function() {
    window.close()
  })
})
