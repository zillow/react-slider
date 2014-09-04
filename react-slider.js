(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('react'));
  } else {
    root.ReactSlider = factory(root.React);
  }
}(this, function(React) {

  var ReactSlider = React.createClass({ displayName: 'ReactSlider',
    
    propTypes: {
      offset: React.PropTypes.number,
      minValue: React.PropTypes.number,
      maxValue: React.PropTypes.number,
      step: React.PropTypes.number,
      valuePropName: React.PropTypes.string
    },

    getDefaultProps: function() {
      return {
        offset: 0,
        minValue: 0,
        maxValue: 100,
        step: 1,
        valuePropName: 'sliderValue'
      };
    },

    getInitialState: function() {
      return {
        offset: 0,
        lowerBound: 0,
        upperBound: 0,
        handleWidth: 0,
        sliderMin: 0,
        sliderMax: 0,
        value: this.props.minValue
      };
    },

    componentDidMount: function() {
      var slider = this.refs.slider.getDOMNode();
      var handle = this.refs.handle.getDOMNode();
      var rect = slider.getBoundingClientRect();
      
      this.setState({
        upperBound: slider.clientWidth - handle.clientWidth,
        handleWidth: handle.clientWidth,
        sliderMin: rect.left,
        sliderMax: rect.right - handle.clientWidth,
      });
    },

    render: function() {
      var handleStyle = {
        transform: 'translateX(' + this.state.offset + 'px)',
        // We use inline-block value to set 'wrapping element' width same as its children.
        display: 'inline-block'
      };

      var userHandle = this.props.children;
      userHandle.props[this.props.valuePropName] = this.state.value;

      return (
        React.DOM.div({ ref: 'slider', className: this.props.className, onClick: this._onClick },
          React.DOM.div({ ref: 'handle', style: handleStyle, onMouseDown: this._dragStart, onTouchMove: this._touchMove }, 
            userHandle
      )));
    },

    _onClick: function(e) {
      // make center of handle appear under the cursor position
      this._moveHandle(e.pageX - (this.state.handleWidth / 2));
    },

    _dragStart: function() {
      document.addEventListener('mousemove', this._dragMove, false);
      document.addEventListener('mouseup', this._dragEnd, false);
    },

    _dragMove: function(e) {
      this._moveHandle(e.pageX);
    },

    _dragEnd: function() {
      document.removeEventListener('mousemove', this._dragMove, false);
      document.removeEventListener('mouseup', this._dragEnd, false);
    },

    _touchMove: function(e) {
      var last = e.changedTouches[e.changedTouches.length - 1];
      this._moveHandle(last.pageX);
      e.preventDefault();
    },

    _moveHandle: function(position) {
      var ratio = (position - this.state.sliderMin) / (this.state.sliderMax - this.state.sliderMin);
      var value = ratio * (this.props.maxValue - this.props.minValue) + this.props.minValue;

      var nextValue = this._trimAlignValue(value);
      var nextRatio = (nextValue - this.props.minValue) / (this.props.maxValue - this.props.minValue);
      var nextOffset = nextRatio * this.state.upperBound;

      this.setState({
        value: nextValue,
        offset: nextOffset
      });
    },

    _trimAlignValue: function(val) {
      if (val <= this.props.minValue) val = this.props.minValue;
      if (val >= this.props.maxValue) val = this.props.maxValue;

      var valModStep = (val - this.props.minValue) % this.props.step;
      var alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= this.props.step) {
        alignValue += (valModStep > 0) ? this.props.step : (- this.props.step);
      }

      return parseFloat(alignValue.toFixed(5));
    }

  });

  return ReactSlider;

}));
