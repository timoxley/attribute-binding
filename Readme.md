# attribute-binding

Bind to incoming data via attributes.

For [custom-element](https://github.com/requireio/custom-element)s

```js
const CustomElement = require('custom-element')
const AttributeBinding = require('attribute-binding')

// prerequisites
require('polyfill-webcomponents')
require('polymer-expressions')
require('templatebinding')

let ContentToggle = CustomElement()
AttributeBinding(ContentToggle)

ContentToggle.on('created', function() {
  this.model = {
    open: false
  }
})

ContentToggle.onChange('open', function(open) {
  this.model.open = open
})

ContentToggle.on('attached', function() {
  this.innerHTML = `
    <h1>State: {{open ? 'open' : 'closed'}}</h1>
  `
})

document.register('content-toggle', ContentToggle)

let model = {
  open: false
}

let template = document.querySelector('template')
document.body.appendChild(
  template.createInstance(model, new PolymerExpressions())
)
```

```html
<template bind>
  <content-toggle open="{{open}}"></content-toggle>
</template>
```
