# React Multi Slider

CSS agnostic slider component for React.

### Important Note

This is alpha release. Use with caution and hope.

### Overview

#### Single slider:

Similar to `<input type="range" />`

```javascript
React.render(<ReactMultiSlider initialValue={50} />, document.body);
```

#### Double slider (Airbnb style):

```javascript
React.render(<ReactMultiSlider initialValue={[0, 100]} />, document.body);
```

#### Multi slider:

```javascript
React.render(<ReactMultiSlider initialValue={[0, 33, 67, 100]} />, document.body);
```

Now you can style it as you want. Checkout the ```examples``` directory to see how.

### Properties

##### min {number} default: 0

The minimum value of the slider.

##### max {number} default: 100

The maximum value of the slider

##### step {number} default: 1

Value to be added or subtracted on each step the slider makes. Must be greater than zero.
```maxValue - minValue``` should be evenly divisible by the step value.

##### defaultValue {number|array\<number\>} default: 0

Determines the initial positions of the handles.
Also determines the number of handles.

If a number is passed a slider with one handle will be rendered.
If an array is passed each value will determine the position of one handle.
The values in the array must be sorted.

##### value {number|array\<number\>}

Like `defaultValue` but for [controlled components](http://facebook.github.io/react/docs/forms.html#controlled-components).

##### orientation {string} default: 'horizontal'

Determines whether the slider moves horizontally (from left to right) or vertically (from top to bottom). Can be one of: **horizontal**, **vertical**.

##### className {string} default: 'slider'

The css class set on the slider node.

##### handleClassName {string} default: 'handle'

The css class set on each handle node.
In addition each handle will receive a numbered css class like `${handleClassName}-${i}`,
e.g. `handle-0`, `handle-1`

##### barClassName {string} default: 'bar'

The css class set on the bars between the handles.
In addition bar fragment will receive a numbered css class like `${barClassName}-${i}`,
e.g. `bar-0`, `bar-1`

##### disabled {boolean} default: false

If `true` the handles can't be moved.

##### onChange {function}

Callback called on every value change. Example:

```javascript
function onChange(value) {
  console.log('New slider value: ' + value);
}
```

##### onChanged {function}

Callback called only after dragging/touching has ended or when a new value is set by clicking on the slider.

### Methods

##### getValue

Returns the current value of the slider, which is a number in the case of a single slider,
or an array of numbers in case of a multi slider.

### License

See the [License](LICENSE) file.
