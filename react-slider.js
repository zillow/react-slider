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

  function ensureArray(x) {
    return Array.isArray(x) ? x : [x];
  }

  function undoEnsureArray(x) {
    return x.length === 1 ? x[0] : x;
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
      var value = ensureArray(this.props.value);
      var defaultValue = ensureArray(this.props.defaultValue);

      value = this._or(value, defaultValue).map(function (v) {
        return this._trimAlignValue(v, this.props);
      }, this);

      return {
        index: -1,
        upperBound: 0,
        sliderLength: 0,
        value: value,
        zIndices: value.reduce(function (acc, x, i) {
          acc.push(i);
          return acc;
        }, [])
      };
    },

    // Keep the internal `value` consistent with an outside `value` if present.
    // This basically allows the slider to be a controlled component.
    componentWillReceiveProps: function (newProps) {
      var value = this._or(ensureArray(newProps.value), this.state.value);

      this.state.value = value.map(function (v) {
        return this._trimAlignValue(v, newProps);
      }, this);
    },

    // Check if the arity of `value` or `defaultValue` matches the number of children (= number of custom handles) and returns it.
    // If no custom handles are provided, just returns `value` if present or `defaultValue` otherwise.
    // If custom handles are present but neither `value` nor `defaultValue` are applicable the handles are spread out equally.
    _or: function (value, defaultValue) {
      var count = React.Children.count(this.props.children);
      switch (count) {
        case 0:
          return value != null ? value : defaultValue;
        case value.length:
          return value;
        case defaultValue.length:
          return defaultValue;
        default:
          if (value.length !== count || defaultValue.length !== count) {
            console.warn("ReactSlider: Number of values does not match number of children.");
          }
          return linspace(this.props.min, this.props.max, count);
      }
    },

    componentDidMount: function () {
      window.addEventListener('resize', this._handleResize);
      this._handleResize();
    },

    componentWillUnmount: function () {
      window.removeEventListener('resize', this._handleResize);
    },

    getValue: function () {
      return undoEnsureArray(this.state.value);
    },

    _handleResize: function () {
      var slider = this.refs.slider.getDOMNode();
      var handle = this.refs.handle0.getDOMNode();
      var rect = slider.getBoundingClientRect();

      var size = this._sizeKey();

      var sliderMax = rect[this._posMaxKey()] - handle[size];
      var sliderMin = rect[this._posMinKey()];

      this.setState({
        upperBound: slider[size] - handle[size],
        sliderLength: sliderMax - sliderMin,
        sliderMin: sliderMin,
        handleSize: handle[size]
      });
    },

    // calculates the offset of a handle in pixels based on its value.
    _calcOffset: function (value) {
      var ratio = (value - this.props.min) / (this.props.max - this.props.min);
      return ratio * this.state.upperBound;
    },

    // Calculates the value corresponding to a given pixel offset, i.e. the inverse of `_calcOffset`.
    _calcValue: function (offset) {
      var ratio = offset / this.state.upperBound;
      return ratio * (this.props.max - this.props.min) + this.props.min;
    },

    _buildHandleStyle: function (offset, i) {
      var style = {
        position: 'absolute',
        willChange: this.state.index >= 0 ? this._posMinKey() : '',
        zIndex: this.state.zIndices.indexOf(i) + 1
      };
      style[this._posMinKey()] = offset + 'px';
      return style;
    },

    _buildBarStyle: function (min, max) {
      var obj = {
        position: 'absolute',
        willChange: this.state.index >= 0 ? this._posMinKey() + ',' + this._posMaxKey() : ''
      };
      obj[this._posMinKey()] = min;
      obj[this._posMaxKey()] = max;
      return obj;
    },

    _getClosestIndex: function (pixelOffset) {
      // TODO: No need to iterate all
      return this.state.value.reduce(function (min, value, i) {
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
      var value = this.state.value;
      value[closestIndex] = nextValue;

      this.setState({value: value}, callback.bind(this, closestIndex));
    },

    _getMousePosition: function (e) {
      return e['page' + this._axisKey()];
    },

    _getTouchPosition: function (e) {
      var last = e.changedTouches[e.changedTouches.length - 1];
      return last['page' + this._axisKey()];
    },

    _getMouseEventMap: function () {
      return {
        'mousemove': this._onMouseMove,
        'mouseup': this._onMouseUp
      }
    },

    _getTouchEventMap: function () {
      return {
        'touchmove': this._onTouchMove,
        'tochend': this._onTouchEnd
      }
    },

    _createOnMouseDown: function (i) {
      return this._createOnStart(i, this._getMousePosition, this._getMouseEventMap())
    },

    _createOnTouchStart: function (i) {
      return this._createOnStart(i, this._getTouchPosition, this._getTouchEventMap())
    },

    _createOnStart: function (i, getPosition, eventMap) {
      if (this.props.disabled) return;

      return function (e) {
        document.activeElement.blur();

        var position = getPosition(e);
        this._start(i, position);

        for (var key in eventMap) {
          document.addEventListener(key, eventMap[key], false);
        }

        pauseEvent(e);
      }.bind(this);
    },

    _start: function (i, position) {
      var zIndices = this.state.zIndices;
      zIndices.splice(zIndices.indexOf(i), 1); // remove wherever the element is
      zIndices.push(i); // add to end

      this.setState({
        startValue: this.state.value[i],
        startPosition: position,
        index: i,
        zIndices: zIndices
      });
    },

    _onMouseUp: function () {
      this._onEnd(this._getMouseEventMap());
    },

    _onTouchEnd: function () {
      this._onEnd(this._getTouchEventMap());
    },

    _onEnd: function (eventMap) {
      for (var key in eventMap) {
        document.removeEventListener(key, eventMap[key], false);
      }

      this.setState({index: -1});
      this._fireEvent('onChanged');
    },

    _onMouseMove: function (e) {
      var position = this._getMousePosition(e);
      this._move(this.state.index, position);
    },

    _onTouchMove: function (e) {
      var position = this._getTouchPosition(e);
      this._move(this.state.index, position);
    },

    _move: function (index, position) {
      if (this.props.disabled) return;

      var lastValue = this.state.value;

      var nextValue = this.state.value.map(function (v, i) {
        if (index !== i) return v;

        var diffPosition = position - this.state.startPosition;
        var diffValue = (diffPosition / this.state.sliderLength) * (this.props.max - this.props.min);
        var nv = this.state.startValue + diffValue;

        if (!this.props.pearling) {
          if (index > 0) {
            var valueBefore = this.state.value[index - 1];
            if (nv < valueBefore + this.props.minDistance) {
              nv = valueBefore + this.props.minDistance;
            }
          }

          if (index < this.state.value.length - 1) {
            var valueAfter = this.state.value[index + 1];
            if (nv > valueAfter - this.props.minDistance) {
              nv = valueAfter - this.props.minDistance;
            }
          }
        }

        return this._trimAlignValue(nv);

      }, this);

      if (this.props.pearling) {
        var n = nextValue.length;
        if (n > 1) {
          if (nextValue[index] > lastValue[index]) {
            this._pearlNext(index, nextValue);
            this._limitNext(n, nextValue);
          } else if (nextValue[index] < lastValue[index]) {
            this._pearlPrev(index, nextValue);
            this._limitPrev(n, nextValue);
          }
        }
      }

      var isEqual = nextValue.reduce(function (isEqual, v, i) {
        return isEqual && v === lastValue[i];
      }, true);

      if (!isEqual) {
        this.setState({value: nextValue}, this._fireEvent.bind(this, 'onChange'));
      }
    },

    _pearlNext: function (i, nextValue) {
      var padding = nextValue[i] + this.props.minDistance;
      if (nextValue[i + 1] && padding > nextValue[i + 1]) {
        nextValue[i + 1] = this._alignValue(padding);
        this._pearlNext(i + 1, nextValue);
      }
    },

    _limitNext: function (n, nextValue) {
      for (var i = 0; i < n; i++) {
        var padding = this.props.max - i * this.props.minDistance;
        if (nextValue[n - 1 - i] > padding) {
          nextValue[n - 1 - i] = padding;
        }
      }
    },

    _pearlPrev: function (i, nextValue) {
      var padding = nextValue[i] - this.props.minDistance;
      if (nextValue[i - 1] && padding < nextValue[i - 1]) {
        nextValue[i - 1] = this._alignValue(padding);
        this._pearlPrev(i - 1, nextValue);
      }
    },

    _limitPrev: function (n, nextValue) {
      for (var i = 0; i < n; i++) {
        var padding = this.props.min + i * this.props.minDistance;
        if (nextValue[i] < padding) {
          nextValue[i] = padding;
        }
      }
    },

    _axisKey: function () {
      return {
        'horizontal': 'X',
        'vertical': 'Y'
      }[this.props.orientation];
    },

    _posMinKey: function () {
      return {
        'horizontal': 'left',
        'vertical': 'top'
      }[this.props.orientation];
    },

    _posMaxKey: function () {
      return {
        'horizontal': 'right',
        'vertical': 'bottom'
      }[this.props.orientation];
    },

    _sizeKey: function () {
      return {
        horizontal: 'clientWidth',
        vertical: 'clientHeight'
      }[this.props.orientation];
    },

    _trimAlignValue: function (val, props) {
      return this._alignValue(this._trimValue(val, props), props);
    },

    _trimValue: function (val, props) {
      props = props || this.props;

      if (val <= props.min) val = props.min;
      if (val >= props.max) val = props.max;

      return val;
    },

    _alignValue: function (val, props) {
      props = props || this.props;

      var valModStep = (val - props.min) % props.step;
      var alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= props.step) {
        alignValue += (valModStep > 0) ? props.step : (-props.step);
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
              style: styles[i],
              onMouseDown: this._createOnMouseDown(i),
              onTouchStart: this._createOnTouchStart(i)
            },
            child
          )
        );
      }.bind(this);
    },

    _renderHandles: function (offset) {
      var styles = offset.map(this._buildHandleStyle);

      if (React.Children.count(this.props.children) > 0) {
        return React.Children.map(this.props.children, this._renderHandle(styles));
      } else {
        var renderHandle = this._renderHandle(styles);
        return offset.map(function (offset, i) {
          return renderHandle(null, i);
        }, this);
      }
    },

    _renderBar: function (i, offsetFrom, offsetTo) {
      return (
        React.createElement('div', {
          key: 'bar' + i,
          ref: 'bar' + i,
          className: this.props.barClassName + ' ' + this.props.barClassName + '-' + i,
          style: this._buildBarStyle(offsetFrom, this.state.upperBound - offsetTo)
        })
      );
    },

    _renderBars: function (offset) {
      var bars = [];
      var lastIndex = offset.length - 1;

      bars.push(this._renderBar(0, 0, offset[0]));

      for (var i = 0; i < lastIndex; i++) {
        bars.push(this._renderBar(i + 1, offset[i], offset[i + 1]));
      }

      bars.push(this._renderBar(lastIndex + 1, offset[lastIndex], this.state.upperBound));

      return bars;
    },

    _onSliderStart: function (e, getPosition, eventMap) {
      if (this.props.disabled) return;

      document.activeElement.blur();

      var position = getPosition(e);

      this._forceValueFromPosition(position, function (i) {
        this._fireEvent('onChange');
        this._start(i, position);

        for (var key in eventMap) {
          document.addEventListener(key, eventMap[key], false);
        }
      }.bind(this));

      pauseEvent(e);
    },

    _onSliderMouseDown: function (e) {
      this._onSliderStart(e, this._getMousePosition, this._getMouseEventMap());
    },

    _onSliderTouchStart: function (e) {
      this._onSliderStart(e, this._getTouchPosition, this._getTouchEventMap());
    },

    _fireEvent: function (event) {
      if (this.props[event]) {
        this.props[event](undoEnsureArray(this.state.value));
      }
    },

    render: function () {
      var offset = this.state.value.map(this._calcOffset);

      var bars = this.props.withBars ? this._renderBars(offset) : null;
      var handles = this._renderHandles(offset);

      return (
        React.createElement('div', {
            ref: 'slider',
            style: {position: 'relative'},
            className: this.props.className + (this.props.disabled ? ' disabled' : ''),
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