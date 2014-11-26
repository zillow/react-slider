(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('react'));
  } else {
    root.ReactMultiSlider = factory(root.React);
  }
}(this, function (React) {

  var ReactMultiSlider = React.createClass({
    displayName: 'ReactMultiSlider',

    propTypes: {
      min: React.PropTypes.number,
      max: React.PropTypes.number,
      step: React.PropTypes.number,
      value: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.arrayOf(React.PropTypes.number)
      ]),
      initialValue: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.arrayOf(React.PropTypes.number)
      ]),
      orientation: React.PropTypes.oneOf(['horizontal', 'vertical']),
      className: React.PropTypes.string,
      handleClassName: React.PropTypes.string,
      barClassName: React.PropTypes.string,
      disabled: React.PropTypes.bool,
      onChange: React.PropTypes.func,
      onChanged: React.PropTypes.func // unlike onChange gets called only after sliding has stopped
    },

    getDefaultProps: function () {
      return {
        min: 0,
        max: 100,
        step: 1,
        initialValue: 0,
        orientation: 'horizontal',
        className: 'slider',
        handleClassName: 'handle',
        barClassName: 'bar',
        disabled: false
      };
    },

    getInitialState: function () {
      return {
        _dragMoveCache: {}, // TODO: find better solution
        _touchMoveCache: {}, // TODO: find better solution
        upperBound: 0,
        handleWidth: 0,
        sliderMin: 0,
        sliderMax: 0,
        value: or(this.props.value, this.props.initialValue)
      };
    },

    componentDidMount: function () {
      window.addEventListener('resize', this._handleResize);
      this._handleResize();

      var value = map(this.state.value, this._trimAlignValue);
      this.setState({value: value});
    },

    componentWillUnmount: function () {
      window.removeEventListener('resize', this._handleResize);
    },

    getValue: function () {
      return this.state.value
    },

    _handleResize: function () {
      var slider = this.refs.slider.getDOMNode();
      var handle = this.refs.handle0.getDOMNode();
      var rect = slider.getBoundingClientRect();

      var size = {
        horizontal: 'clientWidth',
        vertical: 'clientHeight'
      }[this.props.orientation];

      this.setState({
        upperBound: slider[size] - handle[size],
        handleWidth: handle[size],
        sliderMin: rect[this._min()],
        sliderMax: rect[this._max()] - handle[size]
      });
    },

    _calcOffset: function (value) {
      var ratio = (value - this.props.min) / (this.props.max - this.props.min);
      return ratio * this.state.upperBound;
    },

    _buildHandleStyle: function (offset) {
      var transform = 'translate' + this._axis() + '(' + offset + 'px)';
      return {
        WebkitTransform: transform,
        MozTransform: transform,
        msTransform: transform,
        OTransform: transform,
        transform: transform,
        display: 'inline-block',
        position: 'absolute'
      }
    },

    _buildBarStyle: function (minMax) {
      var obj = {
        position: 'absolute'
      };
      obj[this._min()] = minMax.min;
      obj[this._max()] = minMax.max;
      return obj;
    },

    _getClosestIndex: function (clickOffset) {
      var self = this;

      // TODO: No need to iterate all
      return reduce(this.state.value, function (min, value, i) {
        var minDist = min[1];

        var offset = self._calcOffset(value);
        var dist = Math.abs(clickOffset - offset);

        return (dist < minDist) ? [i, dist] : min;

      }, [-1, Number.MAX_VALUE])[0];
    },

    // TODO: prevent this event when the mouse is on top of the slider when dragging stops
    _onClick: function (e) {
      var position = e['page' + this._axis()];

      var clickOffset = position - this.state.sliderMin;
      var closestIndex = this._getClosestIndex(clickOffset);

      this._moveHandle(closestIndex, position);

      if (this.props.onChanged) {
        this.props.onChanged(this.state.value);
      }
    },

    _preventClick: function (e) {
      pauseEvent(e);
    },

    _dragStart: function (i) {
      var self = this;
      return function (e) {
        document.addEventListener('mousemove', self._dragMove(i), false);
        document.addEventListener('mouseup', self._dragEnd(i), false);
        pauseEvent(e);
      }
    },

    _dragMove: function (i) {
      var self = this;
      if (!this.state._dragMoveCache[i]) {
        this.state._dragMoveCache[i] =
          function (e) {
            var position = e['page' + self._axis()];
            self._moveHandle(i, position);
          }
      }
      return this.state._dragMoveCache[i];
    },

    _dragEnd: function (i) {
      var self = this;
      return function () {
        document.removeEventListener('mousemove', self._dragMove(i), false);
        document.removeEventListener('mouseup', self._dragEnd(i), false);
        if (self.props.onChanged) {
          self.props.onChanged(this.state.value);
        }
      }
    },

    _onTouchEnd: function () {
      if (this.props.onChanged) {
        this.props.onChanged(this.state.value);
      }
    },

    _touchMove: function (i) {
      var self = this;
      if (!this.state._touchMoveCache[i]) {
        this.state._touchMoveCache[i] =
          function (e) {
            var last = e.changedTouches[e.changedTouches.length - 1];
            var position = last['page' + self._axis()];
            self._moveHandle(i, position);
            e.preventDefault();
          }
      }
      return this.state._touchMoveCache[i];
    },

    _moveHandle: function (i, position) {
      if (this.props.disabled) return;

      position = position - (this.state.handleWidth / 2);

      var lastValue = this.state.value;

      var nextValue = select(this.state.value, i, function () {
        var ratio = (position - this.state.sliderMin) / (this.state.sliderMax - this.state.sliderMin);
        var value = ratio * (this.props.max - this.props.min) + this.props.min;
        var nextValue = this._trimAlignValue(value);

        // TODO: DRY?
        if (i > 0) {
          var valueBefore = at(this.state.value, i - 1);
          if (nextValue <= valueBefore) {
            nextValue = this._trimAlignValue(valueBefore + this.props.step);
          }
        }

        if (i < size(this.state.value) - 1) {
          var valueAfter = at(this.state.value, i + 1);
          if (nextValue >= valueAfter) {
            nextValue = this._trimAlignValue(valueAfter - this.props.step);
          }
        }

        return nextValue;
      }, this);

      var changed = !is(nextValue, lastValue);
      if (changed) {
        this.setState({value: nextValue});
        if (this.props.onChange) this.props.onChange(nextValue);
      }
    },

    _axis: function () {
      return {
        'horizontal': 'X',
        'vertical': 'Y'
      }[this.props.orientation];
    },

    _min: function () {
      return {
        'horizontal': 'left',
        'vertical': 'top'
      }[this.props.orientation];
    },

    _max: function () {
      return {
        'horizontal': 'right',
        'vertical': 'bottom'
      }[this.props.orientation];
    },

    _trimAlignValue: function (val) {
      if (val <= this.props.min) val = this.props.min;
      if (val >= this.props.max) val = this.props.max;

      var valModStep = (val - this.props.min) % this.props.step;
      var alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= this.props.step) {
        alignValue += (valModStep > 0) ? this.props.step : (-this.props.step);
      }

      return parseFloat(alignValue.toFixed(5));
    },

    _renderHandle: function (styles) {
      var self = this;
      return function (child, i) {
        return (
          React.createElement('div', {
              ref: 'handle' + i,
              className: self.props.handleClassName,
              style: at(styles, i),
              onMouseDown: self._dragStart(i),
              onTouchMove: self._touchMove(i),
              onTouchEnd: self._onTouchEnd,
              onClick: self._preventClick
            },
            child
          )
        );
      }
    },

    _renderHandles: function (value, styles) {
      if (React.Children.count(this.props.children) > 0) {
        return React.Children.map(this.props.children, this._renderHandle(styles), this);
      } else {
        return map(value, function (value, i) {
          return this._renderHandle(styles)(null, i);
        }, this);
      }
    },

    _renderBar: function (i, offsetFrom, offsetTo) {
      return (
        React.createElement('div', {
          key: 'bar' + i,
          ref: 'bar' + i,
          className: this.props.barClassName + ' ' + this.props.barClassName + '-' + i,
          style: this._buildBarStyle({
            min: offsetFrom,
            max: this.state.upperBound - offsetTo
          })
        })
      );
    },

    _renderBars: function (offset) {
      var bars = [];
      var lastIndex = size(offset) - 1;

      bars.push(this._renderBar(0, 0, at(offset, 0)));

      for (var i = 0; i < lastIndex; i++) {
        bars.push(this._renderBar(i + 1, offset[i], offset[i + 1]));
      }

      bars.push(this._renderBar(lastIndex + 1, at(offset, lastIndex), this.state.upperBound));

      return bars;
    },

    render: function () {
      var value = or(this.props.value, this.state.value);
      var offset = map(value, this._calcOffset, this);
      var styles = map(offset, this._buildHandleStyle, this);

      var bars = this._renderBars(offset);
      var handles = this._renderHandles(value, styles);

      return (
        React.createElement('div', {
            ref: 'slider',
            style: {position: 'relative'},
            className: this.props.className,
            onClick: this._onClick
          },
          bars,
          handles
        )
      );
    }
  });

  /**
   * Prevent text selection while dragging.
   * http://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
   */
  function pauseEvent(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }

  /**
   * A little "hack" to treat a value and an array of values equally.
   */
  function map(v, f, context) {
    return (v && v.map) ? v.map(f, context) : f.call(context, v, 0);
  }

  /**
   * Like map, but apply f only to index i.
   */
  function select(v, i, f, context) {
    return (v && v.map) ? v.map(function (value, j) {
      return (i === j) ? f.call(context, value) : value;
    }, context) : f.call(context, v);
  }

  function reduce(v, f, init) {
    return (v && v.reduce) ? v.reduce(f, init) : f(init, v, 0);
  }

  function size(v) {
    return (v && v.map) ? v.length : 1;
  }

  function at(v, i) {
    return (v && v.map) ? v[i] : v;
  }

  function is(a, b) {
    return size(a) === size(b) &&
      reduce(a, function (res, v, i) {
        return res && v === at(b, i)
      }, true);
  }

  function or(maybe, other) {
      return typeof maybe !== 'undefined' ? maybe : other;
  }

  return ReactMultiSlider;

}));