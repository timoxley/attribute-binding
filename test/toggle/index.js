const CustomElement = require('custom-element')
const AttributeBinding = require('../../index')
const domify = require('domify')
const fs = require('fs')

let PolymerExpressions = require('polymer-expressions')
let ContentToggle = CustomElement()

let template = () => domify(
  fs.readFileSync(__dirname + '/index.html', 'utf8')
)

ContentToggle.on('created', function() {
  this.model = {
    open: false
  }
})

AttributeBinding(ContentToggle)
.onChange('closed', function(closed) {
  this.model.open = !closed
})
.onChange('open', function(open) {
  this.model.open = open
})

ContentToggle.on('attached', function() {
  this.appendChild(template().createInstance(this.model, new PolymerExpressions()))
})

module.exports = ContentToggle
