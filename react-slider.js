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
        upperBound: 0
      };
    },

    componentDidMount: function() {
      var sliderWidth = this.refs.slider.getDOMNode().clientWidth;
      var handleWidth = this.refs.handle.getDOMNode().clientWidth;
      
      this.setState({
        upperBound: sliderWidth - handleWidth
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
      var nextOffset = this.state.offset + e.webkitMovementX;

      if (nextOffset < this.state.lowerBound) nextOffset = this.state.lowerBound;
      if (nextOffset > this.state.upperBound) nextOffset = this.state.upperBound;

      this.setState({
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
