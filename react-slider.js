(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('react'));
  } else {
    root.ReactSlider = factory(root.React);
  }
}(this, function (React) {

  var ReactSlider = React.createClass({
    displayName: 'ReactSlider',

    propTypes: {
      minValue: React.PropTypes.number,
      maxValue: React.PropTypes.number,
      step: React.PropTypes.number,
      initialValue: React.PropTypes.number,
      initialValue2: React.PropTypes.number,
      orientation: React.PropTypes.oneOf(['horizontal', 'vertical']),
      onChange: React.PropTypes.func,
      onChange2: React.PropTypes.func,
      valuePropName: React.PropTypes.string
    },

    getDefaultProps: function () {
      return {
        minValue: 0,
        maxValue: 100,
        step: 1,
        initialValue: 0,
        initialValue2: 100,
        orientation: 'horizontal',
        valuePropName: 'sliderValue'
      };
    },

    getInitialState: function () {
      return {
        offset: 0,
        offset2: 0,
        lowerBound: 0,
        upperBound: 0,
        handleWidth: 0,
        sliderMin: 0,
        sliderMax: 0,
        value: this.props.initialValue,
        value2: this.props.initialValue2
      };
    },

    componentDidMount: function () {
      var slider = this.refs.slider.getDOMNode();
      var handle = this.refs.handle.getDOMNode();
      var rect = slider.getBoundingClientRect();

      var size = {
        horizontal: 'clientWidth',
        vertical: 'clientHeight'
      }[this.props.orientation];

      var position = {
        horizontal: { min: 'left', max: 'right' },
        vertical: { min: 'top', max: 'bottom' }
      }[this.props.orientation];

      // position the handle if the intial handle value is non-zero
      var value = this._trimAlignValue(this.props.initialValue);
      var currRatio = (value - this.props.minValue) / (this.props.maxValue - this.props.minValue)
      var currOffset = currRatio * (slider[size] - handle[size]);

      if (this.refs.handle2) {
        var handle2 = this.refs.handle2.getDOMNode(); // TODO
        var value2 = this._trimAlignValue(this.props.initialValue2); // TODO
        var currRatio2 = (value2 - this.props.minValue) / (this.props.maxValue - this.props.minValue); // TODO
        var currOffset2 = currRatio2 * (slider[size] - handle2[size]); // TODO
        this.setState({
          value2: value2, // TODO
          offset2: currOffset2 // TODO
        })
      }

      this.setState({
        upperBound: slider[size] - handle[size],
        handleWidth: handle[size],
        sliderMin: rect[position.min],
        sliderMax: rect[position.max] - handle[size],
        value: value,
        offset: currOffset
      });
    },

    render: function () {

      var styles = {
        handleStyle: {
          transform: 'translate' + this._axis() + '(' + this.state.offset + 'px)',
          // let this element be the same size as its children.
          display: 'inline-block',
          position: 'absolute'
        },

        handleStyle2: {
          transform: 'translate' + this._axis() + '(' + this.state.offset2 + 'px)',
          display: 'inline-block',
          position: 'absolute'
        }
      };


      var handles = React.Children.map(this.props.children, function (child, i) {
        var num = (i + 1 > 1 ? i + 1 : '');
        child.props[this.props.valuePropName] = this.state['value' + num]; // TODO
        return (
          React.createElement('div', {
              ref: 'handle' + num, // TODO
              style: styles['handleStyle' + num], // TODO
              onMouseDown: this['_dragStart' + num],
              onTouchMove: this['_touchMove' + num]
            },
            child
          )
        );
      }, this);

      return (
        React.createElement('div', {ref: 'slider', className: this.props.className, onClick: this._onClick},
          handles
        )
      );
    },

    _onClick: function (e) {
      if (!this.refs.handle2) {
        var position = e['page' + this._axis()];
        this._moveHandle(position);
      }
    },

    _dragStart: function () {
      document.addEventListener('mousemove', this._dragMove, false);
      document.addEventListener('mouseup', this._dragEnd, false);
    },

    _dragStart2: function () {
      document.addEventListener('mousemove', this._dragMove2, false);
      document.addEventListener('mouseup', this._dragEnd2, false);
    },

    _dragMove: function (e) {
      var position = e['page' + this._axis()];
      this._moveHandle(position);
    },

    _dragMove2: function (e) {
      var position = e['page' + this._axis()];
      this._moveHandle2(position);
    },

    _dragEnd: function () {
      document.removeEventListener('mousemove', this._dragMove, false);
      document.removeEventListener('mouseup', this._dragEnd, false);
    },

    _dragEnd2: function () {
      document.removeEventListener('mousemove', this._dragMove2, false);
      document.removeEventListener('mouseup', this._dragEnd2, false);
    },

    _touchMove: function (e) {
      var last = e.changedTouches[e.changedTouches.length - 1];
      var position = last['page' + this._axis()];
      this._moveHandle(position);
      e.preventDefault();
    },

    _touchMove2: function (e) {
      var last = e.changedTouches[e.changedTouches.length - 1];
      var position = last['page' + this._axis()];
      this._moveHandle2(position);
      e.preventDefault();
    },

    _moveHandle: function (position) {

      // make center of handle appear under the cursor position
      position = position - (this.state.handleWidth / 2);

      var lastValue = this.state.value;

      var ratio = (position - this.state.sliderMin) / (this.state.sliderMax - this.state.sliderMin);
      var value = ratio * (this.props.maxValue - this.props.minValue) + this.props.minValue;

      var nextValue = this._trimAlignValue(value);
      var nextRatio = (nextValue - this.props.minValue) / (this.props.maxValue - this.props.minValue);
      var nextOffset = nextRatio * this.state.upperBound;

      this.setState({
        value: nextValue,
        offset: nextOffset
      });

      var changed = nextValue !== lastValue;
      if (changed && this.props.onChange) {
        this.props.onChange(nextValue);
      }
    },

    _moveHandle2: function (position) {
      // make center of handle appear under the cursor position
      position = position - (this.state.handleWidth / 2);

      var lastValue = this.state.value2; // TODO

      var ratio = (position - this.state.sliderMin) / (this.state.sliderMax - this.state.sliderMin);
      var value = ratio * (this.props.maxValue - this.props.minValue) + this.props.minValue;

      var nextValue = this._trimAlignValue(value);
      var nextRatio = (nextValue - this.props.minValue) / (this.props.maxValue - this.props.minValue);
      var nextOffset = nextRatio * this.state.upperBound;

      this.setState({
        value2: nextValue,
        offset2: nextOffset
      });

      var changed = nextValue !== lastValue;
      if (changed && this.props.onChange2) {
        this.props.onChange2(nextValue);
      }
    },

    _axis: function () {
      return {
        'horizontal': 'X',
        'vertical': 'Y'
      }[this.props.orientation];
    },

    _trimAlignValue: function (val) {
      if (val <= this.props.minValue) val = this.props.minValue;
      if (val >= this.props.maxValue) val = this.props.maxValue;

      var valModStep = (val - this.props.minValue) % this.props.step;
      var alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= this.props.step) {
        alignValue += (valModStep > 0) ? this.props.step : (-this.props.step);
      }

      return parseFloat(alignValue.toFixed(5));
    }

  });

  return ReactSlider;

}));