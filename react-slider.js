(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('react'));
  } else {
    root.ReactSlider = factory(root.React);
  }
}(this, function (React) {

  /**
   * To prevent text selection while dragging.
   * http://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
   */
  function pauseEvent(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }

  // These functions allow to treat a single value and an array of values equally:
  // e.g. map(5, x => x + 1) returns 6
  //      map([5, 6, 7], x => x + 1) returns [6, 7, 8]

  /**
   * Apply `f` to each value in `v` or call `f` with `v` directly if it is a single value.
   */
  function map(v, f, context) {
    return (v && v.map) ? v.map(f, context) : f.call(context, v, 0);
  }

  /**
   * Reduce `v` with `f` and `init` or call `f` directly with `init` and `v` if it is a single value.
   */
  function reduce(v, f, init) {
    return (v && v.reduce) ? v.reduce(f, init) : f(init, v, 0);
  }

  /**
   * Returns the size of `v` if it is an array, or 1 if it is a single value or 0 if it does not exists.
   */
  function size(v) {
    return v != null ? v.length ? v.length : 1 : 0;
  }

  /**
   * Returns the value at `i` if `v` is an array. Just returns the value otherwise.
   */
  function at(v, i) {
    return v && v.map ? v[i] : v;
  }

  /**
   * Compares `a` and `b` which can be either single values or an array of values.
   */
  function is(a, b) {
    return size(a) === size(b) &&
      reduce(a, function (res, v, i) {
        return res && v === at(b, i)
      }, true);
  }

  /**
   * Spreads `count` values equally between `min` and `max`.
   */
  function linspace(min, max, count) {
    var range = (max - min) / (count - 1);
    var res = [];
    for (var i = 0; i < count; i++) {
      res.push(min + range * i);
    }
    return res;
  }

  /**
   * If `v` is an array, returns a copy of `v` with the `i`th element set to `newv`. Otherwise returns `newv`.
   */
  function insteadOf(v, i, newv) {
    if (v.length) {
      v = v.slice();
      v[i] = newv;
      return v;
    } else
      return newv;
  }

  function extend(dst, src) {
    for (var key in src)
      if (src.hasOwnProperty(key))
        dst[key] = src[key];
    return dst;
  }

  var ReactSlider = React.createClass({
    displayName: 'ReactSlider',

    propTypes: {
      min: React.PropTypes.number,
      max: React.PropTypes.number,
      step: React.PropTypes.number,
      defaultValue: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.arrayOf(React.PropTypes.number)
      ]),
      value: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.arrayOf(React.PropTypes.number)
      ]),
      orientation: React.PropTypes.oneOf(['horizontal', 'vertical']),
      className: React.PropTypes.string,
      handleClassName: React.PropTypes.string,
      handleActiveClassName: React.PropTypes.string,
      minDistance: React.PropTypes.number,
      barClassName: React.PropTypes.string,
      withBars: React.PropTypes.bool,
      pearling: React.PropTypes.bool,
      disabled: React.PropTypes.bool,
      onChange: React.PropTypes.func,
      onChanged: React.PropTypes.func
    },

    getDefaultProps: function () {
      return {
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
        orientation: 'horizontal',
        className: 'slider',
        handleClassName: 'handle',
        handleActiveClassName: 'active',
        minDistance: 0,
        barClassName: 'bar',
        withBars: false,
        pearling: false,
        disabled: false
      };
    },

    getInitialState: function () {
      //var value = this._or(this.props.value, this.props.defaultValue);
      var value = map(this._or(this.props.value, this.props.defaultValue), this._trimAlignValue);

      return {
        index: -1, // TODO: find better solution
        min: this._trimAlignValue(this.props.min),
        max: this._trimAlignValue(this.props.max),
        upperBound: 0,
        sliderLength: 0,
        value: value,
        zIndices: reduce(value, function (acc, x, i) {
          acc.push(i);
          return acc;
        }, [])
      };
    },

    // Keep the internal `value` consistent with an outside `value` if present.
    // This basically allows the slider to be a controlled component.
    componentWillReceiveProps: function (newProps) {
      this.state.value = map(this._or(newProps.value, this.state.value), this._trimAlignValue);
      this.state.min = this._trimAlignValue(newProps.min);
      this.state.max = this._trimAlignValue(newProps.max);
    },

    // Check if the arity of `value` or `defaultValue` matches the number of children (= number of custom handles) and returns it.
    // If no custom handles are provided, just returns `value` if present or `defaultValue` otherwise.
    // If custom handles are present but neither `value` nor `defaultValue` are applicable the handles are spread out equally.
    _or: function (value, defaultValue) {
      var count = React.Children.count(this.props.children);
      switch (count) {
        case 0:
          return value != null ? value : defaultValue;
        case size(value):
          return value;
        case size(defaultValue):
          return defaultValue;
        default:
          if (size(value) !== count || size(defaultValue) !== count) {
            console.warn("ReactSlider: Number of values does not match number of children.");
          }
          return linspace(this.props.min, this.props.max, count);
      }
    },

    componentDidMount: function () {
      window.addEventListener('resize', this._handleResize);
      this._handleResize();

      // values could have changed due to `this._trimAlignValue`.
      if (this.props.onChange && !is(this.props.value, this.state.value)) {
        this.props.onChange(this.state.value);
      }
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

      var sliderMax = rect[this._max()] - handle[size];
      var sliderMin = rect[this._min()];

      this.setState({
        upperBound: slider[size] - handle[size],
        sliderLength: sliderMax - sliderMin,
        sliderMin: sliderMin,
        handleSize: handle[size]
      });
    },

    // calculates the offset of a handle in pixels based on its value.
    _calcOffset: function (value) {
      var ratio = (value - this.state.min) / (this.state.max - this.state.min);
      return ratio * this.state.upperBound;
    },

    // Calculates the value corresponding to a given pixel offset, i.e. the inverse of `_calcOffset`.
    _calcValue: function (offset) {
      var ratio = offset / this.state.upperBound;
      return ratio * (this.props.max - this.props.min) + this.props.min;
    },

    _buildHandleStyle: function (offset, i) {
      var style = {
        horizontal: { left: offset + 'px' },
        vertical: { top: offset + 'px' }
      }[this.props.orientation];
      extend(style, {
        position: 'absolute',
        willChange: this.state.index >= 0 ? 'transform' : '',
        zIndex: this.state.zIndices.indexOf(i) + 1
      });
      return style;
    },

    _buildBarStyle: function (minMax) {
      var obj = {
        position: 'absolute',
        willChange: this.state.index >= 0 ? this._min() + ',' + this._max() : ''
      };
      obj[this._min()] = minMax.min;
      obj[this._max()] = minMax.max;
      return obj;
    },

    _getClosestIndex: function (pixelOffset) {
      // TODO: No need to iterate all
      return reduce(this.state.value, function (min, value, i) {
        var minDist = min[1];

        var offset = this._calcOffset(value);
        var dist = Math.abs(pixelOffset - offset);

        return (dist < minDist) ? [i, dist] : min;

      }.bind(this), [-1, Number.MAX_VALUE])[0];
    },

    // Snaps the nearest handle to the value corresponding to `position` and calls `callback` with that handle's index.
    _forceValueFromPosition: function (position, callback) {
      var pixelOffset = position - this.state.sliderMin - (this.state.handleSize / 2);
      var closestIndex = this._getClosestIndex(pixelOffset);

      var nextValue = this._trimAlignValue(this._calcValue(pixelOffset));

      this.setState({
        value: insteadOf(this.state.value, closestIndex, nextValue)
      }, function () {
        if (typeof callback === 'function')
          callback(closestIndex);
      });
    },

    _dragStart: function (i) {
      if (this.props.disabled) return;

      return function (e) {
        var position = e['page' + this._axis()];
        this._start(i, position);

        document.addEventListener('mousemove', this._dragMove, false);
        document.addEventListener('mouseup', this._dragEnd, false);

        pauseEvent(e);
      }.bind(this);
    },

    _touchStart: function (i) {
      if (this.props.disabled) return;

      return function (e) {
        var last = e.changedTouches[e.changedTouches.length - 1];
        var position = last['page' + this._axis()];
        this._start(i, position);

        document.addEventListener('touchmove', this._touchMove, false);
        document.addEventListener('touchend', this._touchEnd, false);

        pauseEvent(e);
      }.bind(this);
    },

    _start: function (i, position) {
      var zIndices = this.state.zIndices;
      zIndices.splice(zIndices.indexOf(i), 1); // remove wherever the element is
      zIndices.push(i); // add to end

      this.setState({
        startValue: at(this.state.value, i),
        startPosition: position,
        index: i,
        zIndices: zIndices
      });
    },

    _dragEnd: function () {
      document.removeEventListener('mousemove', this._dragMove, false);
      document.removeEventListener('mouseup', this._dragEnd, false);
      this._end();
    },

    _touchEnd: function () {
      document.removeEventListener('touchmove', this._touchMove, false);
      document.removeEventListener('touchend', this._touchEnd, false);
      this._end();
    },

    _end: function () {
      this.setState({
        index: -1
      });

      if (this.props.onChanged) {
        this.props.onChanged(this.state.value);
      }
    },

    _dragMove: function (e) {
      var position = e['page' + this._axis()];
      this._move(this.state.index, position);
    },

    _touchMove: function (e) {
      var last = e.changedTouches[e.changedTouches.length - 1];
      var position = last['page' + this._axis()];
      this._move(this.state.index, position);
      e.preventDefault();
    },

    _move: function (i, position) {
      if (this.props.disabled) return;

      var lastValue = this.state.value;
      var nextValue = map(this.state.value, function (value, j) {
        if (i !== j) return value;

        var diffPosition = position - this.state.startPosition;
        var diffValue = (diffPosition / this.state.sliderLength) * (this.state.max - this.state.min);
        var nextValue = this._trimAlignValue(this.state.startValue + diffValue);

        if (!this.props.pearling) {
          if (i > 0) {
            var valueBefore = at(this.state.value, i - 1);
            if (nextValue < valueBefore + this.props.minDistance) {
              nextValue = this._trimAlignValue(valueBefore + this.props.minDistance);
            }
          }

          if (i < size(this.state.value) - 1) {
            var valueAfter = at(this.state.value, i + 1);
            if (nextValue > valueAfter - this.props.minDistance) {
              nextValue = this._trimAlignValue(valueAfter - this.props.minDistance);
            }
          }
        }

        return nextValue;
      }, this);

      if (this.props.pearling) {
        var n = nextValue.length;
        if (n && n > 1) {
          if (nextValue[i] > lastValue[i]) {
            this._pearlNext(i, nextValue);
            this._limitNext(n, nextValue);
          } else if (nextValue[i] < lastValue[i]) {
            this._pearlPrev(i, nextValue);
            this._limitPrev(n, nextValue);
          }
        }
      }

      var changed = !is(nextValue, lastValue);
      if (changed) {
        this.setState({value: nextValue});
        if (this.props.onChange) this.props.onChange(nextValue);
      }
    },

    _pearlNext: function (i, nextValue) {
      if (nextValue[i + 1] && nextValue[i] + this.props.minDistance > nextValue[i + 1]) {
        nextValue[i + 1] = this._trimAlignValue(nextValue[i] + this.props.minDistance);
        this._pearlNext(i + 1, nextValue);
      }
    },

    _limitNext: function (n, nextValue) {
      for (var i = 0; i < n; i++) {
        if (nextValue[n - 1 - i] > this.state.max - i * this.props.minDistance) {
          nextValue[n - 1 - i] = this.state.max - i * this.props.minDistance;
        }
      }
    },

    _pearlPrev: function (i, nextValue) {
      if (nextValue[i - 1] && nextValue[i] - this.props.minDistance < nextValue[i - 1]) {
        nextValue[i - 1] = this._trimAlignValue(nextValue[i] - this.props.minDistance);
        this._pearlPrev(i - 1, nextValue);
      }
    },

    _limitPrev: function (n, nextValue) {
      for (var i = 0; i < n; i++) {
        if (nextValue[i] < this.state.min + i * this.props.minDistance) {
          nextValue[i] = this.state.min + i * this.props.minDistance;
        }
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
      return function (child, i) {
        var className = this.props.handleClassName + ' ' +
          (this.props.handleClassName + '-' + i) + ' ' +
          (this.state.index === i ? this.props.handleActiveClassName : '');

        return (
          React.createElement('div', {
              ref: 'handle' + i,
              key: 'handle' + i,
              className: className,
              style: at(styles, i),
              onMouseDown: this._dragStart(i),
              onTouchStart: this._touchStart(i)
              //onTouchMove: this._touchMove,
              //onTouchEnd: this._onTouchEnd
            },
            child
          )
        );
      }.bind(this);
    },

    _renderHandles: function (offset) {
      var styles = map(offset, this._buildHandleStyle, this);

      if (React.Children.count(this.props.children) > 0) {
        return React.Children.map(this.props.children, this._renderHandle(styles), this);
      } else {
        return map(offset, function (offset, i) {
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

      // Handle mouseDown events on the slider.
    _onSliderMouseDown: function (e) {
      if (this.props.disabled) return;

      var position = e['page' + this._axis()];

      this._forceValueFromPosition(position, function (i) {
        // Set up a drag operation.
        if (this.props.onChange) {
          this.props.onChange(this.state.value);
        }

        this._start(i, position);

        document.addEventListener('mousemove', this._dragMove, false);
        document.addEventListener('mouseup', this._dragEnd, false);
      }.bind(this));

      pauseEvent(e);
    },

    // Handle touchStart events on the slider.
    _onSliderTouchStart: function (e) {
      if (this.props.disabled) return;

      var last = e.changedTouches[e.changedTouches.length - 1];
      var position = last['page' + this._axis()];

      this._forceValueFromPosition(position, function (i) {
        // Set up a drag operation.
        if (this.props.onChange) {
          this.props.onChange(this.state.value);
        }

        this._start(i, position);

        document.addEventListener('touchmove', this._touchMove, false);
        document.addEventListener('touchend', this._touchEnd, false);
      }.bind(this));

      pauseEvent(e);
    },

    render: function () {
      var offset = map(this.state.value, this._calcOffset, this);

      var bars = this.props.withBars ? this._renderBars(offset) : null;
      var handles = this._renderHandles(offset);

      return (
        React.createElement('div', {
            ref: 'slider',
            style: {position: 'relative'},
            className: this.props.className,
            onMouseDown: this._onSliderMouseDown,
            onTouchStart: this._onSliderTouchStart
          },
          bars,
          handles
        )
      );
    }
  });

  return ReactSlider;

}));