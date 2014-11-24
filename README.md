CSS agnostic slider component for React.

### Important Note

This is alpha release. Use with caution and hope.

### Installation

```sh
npm install react-slider
```

### Overview

```javascript
var Handle = React.createClass({
  render: function() {
    return <div className="handle">{this.props.sliderValue}</div>;
  }
});

var slider = (
  <ReactSlider className="slider">
    <Handle />
  </ReactSlider>
);

React.renderComponent(slider, document.body);
```

Outputs following html:

```html
<div class="slider">
  <div style="/* some weird stuff */">
    <!-- yes, this is your handle component -->
    <div class="handle">0</div>
</div>
```

Now you can style it as you want. Checkout the ```examples``` directory to see how.

### Properties

##### minValue {number} default: 0

The minimum value of the slider.

##### maxValue {number} default: 100

The maximum value of the slider

##### step {number} default: 1

Value to be added or subtracted on each step the slider makes. Must be greater than zero. ```maxValue - minValue``` should be evenly divisible by the step value.

##### orientation {string} default: 'horizontal'

Determines whether the slider moves horizontally (from left to right) or vertically (from top to bottom). Can be one of: **horizontal**, **vertical**.

##### onChange {function}

Callback called on every value change. Example:

```javascript
function onChange(value) { 
  console.log('New slider value: ' + value); 
}
```

##### valuePropName {string} default: 'sliderValue'

Name of property which is passed to children component and contains current slider value.

### License ###

See the [License](LICENSE) file.
