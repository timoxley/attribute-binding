# attribute-binding

Bind to incoming data via attributes on your custom elements.

For [custom-element](https://github.com/requireio/custom-element).

## Example

```html
<template bind>
  <content-toggle open="{{open}}"></content-toggle>
</template>
```

```js

// prerequisites
require('polyfill-webcomponents')
require('templatebinding')
const PolymerExpressions = require('polymer-expressions')

const CustomElement = require('custom-element')
const AttributeBinding = require('attribute-binding')

let ContentToggle = CustomElement()

ContentToggle.on('created', function() {
  this.model = {
    open: false
  }
})

AttributeBinding(ContentToggle)

ContentToggle.onChange('open', function(open) {
  // fired whenever the "open" attribute changes
  // with bound data.
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

## License

MIT

