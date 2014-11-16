const CustomElement = require('custom-element')
const AttributeBinding = require('../../index')
const domify = require('domify')
const fs = require('fs')

let PolymerExpressions = require('polymer-expressions')
let DefinitionList = CustomElement()

let template = () => domify(
  fs.readFileSync(__dirname + '/index.html', 'utf8')
)

DefinitionList.on('created', function() {
  this.model = {
    name: '',
    items: []
  }
})

AttributeBinding(DefinitionList)
.onChange('items', function(items) {
  this.model.items = items
})
.onChange('name', function(name) {
  this.model.name = name
})


DefinitionList.on('attached', function() {
  this.appendChild(template().createInstance(this.model, new PolymerExpressions()))
})

module.exports = DefinitionList
