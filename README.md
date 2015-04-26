# React Slider

CSS agnostic slider component for React.

See demo: [https://cell303.github.io/react-slider](https://cell303.github.io/react-slider/)

### Important Note

This is an alpha release. Use with caution and hope.

### Installation

```sh
npm install react-slider
```

### Overview

#### Single slider:

Similar to `<input type="range" defaultValue={50} />`

```javascript
React.render(<ReactSlider defaultValue={50} />, document.body);
```

#### Double slider (with bars between the handles):

```javascript
React.render(<ReactSlider defaultValue={[0, 100]} withBars />, document.body);
```

#### Multi slider:

```javascript
React.render(<ReactSlider defaultValue={[0, 33, 67, 100]} withBars />, document.body);
```

#### Provide custom handles:

```javascript
React.render(
  <ReactSlider withBars>
    <div className="my-handle">1</div>
    <div className="my-handle">2</div>
    <div className="my-handle">3</div>
  </ReactSlider>,
  document.body
);
```

Now you can style it as you want. Checkout the `index.html` example to see how.

### Properties

##### min {number} default: 0

The minimum value of the slider.

##### max {number} default: 100

The maximum value of the slider.

##### step {number} default: 1

Value to be added or subtracted on each step the slider makes.
Must be greater than zero.
`max - min` should be evenly divisible by the step value.

##### minDistance {number} default: 0

The minimal distance between any pair of handles.
Zero means they can sit on top of each other.

##### defaultValue {oneOfType([number, arrayOf(number)])} default: 0

Determines the initial positions of the handles and the number of handles if the component has no children.

If a number is passed a slider with one handle will be rendered.
If an array is passed each value will determine the position of one handle.
The values in the array must be sorted.
If the component has children, the length of the array must match the number of children.

##### value {oneOfType([number, arrayOf(number)])} default: 0

Like `defaultValue` but for [controlled components](http://facebook.github.io/react/docs/forms.html#controlled-components).

##### orientation {oneOf(['horizontal', 'vertical'])} default: 'horizontal'

Determines whether the slider moves horizontally (from left to right) or vertically (from top to bottom).

##### className {string} default: 'slider'

The css class set on the slider node.

##### handleClassName {string} default: 'handle'

The css class set on each handle node.
In addition each handle will receive a numbered css class of the form `${handleClassName}-${i}`,
e.g. `handle-0`, `handle-1`, ...

##### handleActiveClassName {string} default: 'active'

The css class set on the handle that is currently being moved.

##### withBars {boolean} default: false

If `true` bars between the handles will be rendered.

##### barClassName {string} default: 'bar'

The css class set on the bars between the handles.
In addition bar fragment will receive a numbered css class of the form `${barClassName}-${i}`,
e.g. `bar-0`, `bar-1`, ...

##### pearling {bool} default: false

If `true` the active handle will push other handles within the constraints of `min`, `max`, `step` and `minDistance`.

##### disabled {bool} default: false

If `true` the handles can't be moved.

##### snapDragDisabled {bool} default: false

Disables handle move when clicking the slider bar.

##### invert {bool} default: false

Inverts the slider.

##### onBeforeChange {func}

Callback called before starting to move a handle.

##### onChange {func}

Callback called on every value change.

##### onAfterChange {func}

Callback called only after moving a handle has ended or when a new value is set by clicking on the slider.

##### onSliderClick {func}

Callback called when the the slider is clicked (handle or bars). Receives the value at the clicked position as argument.

### Methods

##### getValue

Returns the current value of the slider, which is a number in the case of a single slider,
or an array of numbers in case of a multi slider.

### License

See the [License](LICENSE) file.
