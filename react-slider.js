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
      maxValue: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {
        offset: 0,
        minValue: 0,
        maxValue: 100
      };
    },

    getInitialState: function() {
      return {
        offset: 0,
        lowerBound: 0,
        upperBound: 0,
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

      return (
        React.DOM.div({ ref: 'slider', className: this.props.className },
          React.DOM.div({ ref: 'handle', style: handleStyle, onMouseDown: this._dragStart }, 
            this.props.children
      )));
    },

    _dragStart: function() {
      document.addEventListener('mousemove', this._dragMove, false);
      document.addEventListener('mouseup', this._dragEnd, false);
    },

    _dragMove: function(e) {
      var position = e.pageX;

      if (position < this.state.sliderMin) position = this.state.sliderMin;
      if (position > this.state.sliderMax) position = this.state.sliderMax;

      var ratio = (position - this.state.sliderMin) / (this.state.sliderMax - this.state.sliderMin);

      var nextValue = ratio * (this.props.maxValue - this.props.minValue) + this.props.minValue;
      var nextOffset = ratio * this.state.upperBound;

      this.setState({
        value: nextValue,
        offset: nextOffset
      });
    },

    _dragEnd: function() {
      document.removeEventListener('mousemove', this._dragMove, false);
      document.removeEventListener('mouseup', this._dragEnd, false);
    }
  });

  return ReactSlider;

}));
