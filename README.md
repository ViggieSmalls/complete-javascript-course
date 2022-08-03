# Course notes

## Numbers, Dates, Intl and Timers

### Working with BigInt

* regular numbers are represented with 64 bits.
  The highest possible number that can be represented correctly in JS is `2**53 -1`, because the other bits are used for storing the sign and the decimal places, plus counting starts at 0.
* BigInt can be written as `123n` or `BigInt(123)`, though latter is susceptible for errors when converting from a regular number.
* Operations between BigInt and regular numbers are restricted.
* `Math` operations are not possible.


### I18N
* `Intl.DateTimeFormat(locale, options)` can be used to display dates based on the user's preference.
* `Intl.NumberFormat(locale, options)` can be used to display numbers, units and currencies.
* The locale can be determined by `navigator.locale` for example.

## Advanced DOM and Events

* > The Document Object Model (DOM) is the data representation of the objects that comprise the structure and content of a document on the web.
  > 
  > -- <cite>[MDN Web docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)</cite> 
* Every object in a document inherits from a `Node`.
* `Node` as well as all inheriting classes add their own methods, like e.g. `.querySelector()`
* The four main objects that inherit from `Node` are the _Element_, _Text_, _Comment_, and `document`
* `Node` also inherits from `EventTarget`.
  This provides methods like `.addEventListener()`
* The `window` object also inherits from `EventTarget`

![DOM](DOM.png "How the DOM API is organized behind the scenes")

