import React from 'react';
import PropTypes from 'prop-types';

/**
 * To prevent text selection while dragging.
 * http://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
 */
function pauseEvent(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
}

function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
}

/**
 * Spreads `count` values equally between `min` and `max`.
 */
function linspace(min, max, count) {
    const range = (max - min) / (count - 1);
    const res = [];
    for (let i = 0; i < count; i += 1) {
        res.push(min + range * i);
    }
    return res;
}

function ensureArray(x) {
    if (x == null) {
        return [];
    }
    return Array.isArray(x) ? x : [x];
}

function undoEnsureArray(x) {
    return x !== null && x.length === 1 ? x[0] : x;
}

function trimSucceeding(length, nextValue, minDistance, max) {
    for (let i = 0; i < length; i += 1) {
        const padding = max - i * minDistance;
        if (nextValue[length - 1 - i] > padding) {
            // eslint-disable-next-line no-param-reassign
            nextValue[length - 1 - i] = padding;
        }
    }
}

function trimPreceding(length, nextValue, minDistance, min) {
    for (let i = 0; i < length; i += 1) {
        const padding = min + i * minDistance;
        if (nextValue[i] < padding) {
            // eslint-disable-next-line no-param-reassign
            nextValue[i] = padding;
        }
    }
}

function addHandlers(eventMap) {
    Object.keys(eventMap).forEach(key => {
        document.addEventListener(key, eventMap[key], false);
    });
}

function removeHandlers(eventMap) {
    Object.keys(eventMap).forEach(key => {
        document.removeEventListener(key, eventMap[key], false);
    });
}

class ReactSlider extends React.Component {
    static displayName = 'ReactSlider';

    static propTypes = {
        /**
         * The minimum value of the slider.
         */
        min: PropTypes.number,

        /**
         * The maximum value of the slider.
         */
        max: PropTypes.number,

        /**
         * Value to be added or subtracted on each step the slider makes.
         * Must be greater than zero.
         * `max - min` should be evenly divisible by the step value.
         */
        step: PropTypes.number,

        /**
         * The minimal distance between any pair of handles.
         * Must be positive, but zero means they can sit on top of each other.
         */
        minDistance: PropTypes.number,

        /**
         * Determines the initial positions of the handles and the number of handles if the
         * component has no children.
         *
         * If a number is passed a slider with one handle will be rendered.
         * If an array is passed each value will determine the position of one handle.
         * The values in the array must be sorted.
         * If the component has children, the length of the array must match the number of children.
         */
        defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),

        /**
         * Like `defaultValue` but for
         * [controlled components](http://facebook.github.io/react/docs/forms.html#controlled-components).
         */
        // eslint-disable-next-line zillow/react/require-default-props
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),

        /**
         * Determines whether the slider moves horizontally (from left to right)
         * or vertically (from top to bottom).
         */
        orientation: PropTypes.oneOf(['horizontal', 'vertical']),

        /**
         * The css class set on the slider node.
         */
        className: PropTypes.string,

        /**
         * The css class set on each handle node.
         *
         * In addition each handle will receive a numbered css class of the form
         * `${handleClassName}-${i}`, e.g. `handle-0`, `handle-1`, ...
         */
        handleClassName: PropTypes.string,

        /**
         * The css class set on the handle that is currently being moved.
         */
        handleActiveClassName: PropTypes.string,

        /**
         * If `true` bars between the handles will be rendered.
         */
        withBars: PropTypes.bool,

        /**
         * The css class set on the bars between the handles.
         * In addition bar fragment will receive a numbered css class of the form
         * `${barClassName}-${i}`, e.g. `bar-0`, `bar-1`, ...
         */
        barClassName: PropTypes.string,

        /**
         * If `true` the active handle will push other handles
         * within the constraints of `min`, `max`, `step` and `minDistance`.
         */
        pearling: PropTypes.bool,

        /**
         * If `true` the handles can't be moved.
         */
        disabled: PropTypes.bool,

        /**
         * Disables handle move when clicking the slider bar
         */
        snapDragDisabled: PropTypes.bool,

        /**
         * Inverts the slider.
         */
        invert: PropTypes.bool,

        /**
         * Callback called before starting to move a handle.
         */
        // eslint-disable-next-line max-len
        // eslint-disable-next-line zillow/react/require-default-props, zillow/react/no-unused-prop-types
        onBeforeChange: PropTypes.func,

        /**
         * Callback called on every value change.
         */
        // eslint-disable-next-line max-len
        // eslint-disable-next-line zillow/react/require-default-props, zillow/react/no-unused-prop-types
        onChange: PropTypes.func,

        /**
         * Callback called only after moving a handle has ended.
         */
        // eslint-disable-next-line max-len
        // eslint-disable-next-line zillow/react/require-default-props, zillow/react/no-unused-prop-types
        onAfterChange: PropTypes.func,

        /**
         * Callback called when the the slider is clicked (handle or bars).
         * Receives the value at the clicked position as argument.
         */
        // eslint-disable-next-line zillow/react/require-default-props
        onSliderClick: PropTypes.func,

        /**
         * Provide custom handles:
         *
         *     <ReactSlider withBars>
         *       <div className="my-handle">1</div>
         *       <div className="my-handle">2</div>
         *       <div className="my-handle">3</div>
         *     </ReactSlider>
         *
         * Note: the children nodes must match the number of values provided
         * to `value` or `defaultValue`. To dynamically create custom handle
         * content, use the `renderHandle` render prop.
         */
        // eslint-disable-next-line zillow/react/require-default-props
        children: PropTypes.node,

        /**
         * aria-label for screen-readers to apply to the handles.
         * Use an array for more than one handle.
         * The length of the array must match the number of handles in the value array.
         */
        // eslint-disable-next-line zillow/react/require-default-props
        ariaLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),

        /**
         * aria-valuetext for screen-readers
         */
        // eslint-disable-next-line zillow/react/require-default-props
        ariaValuetext: PropTypes.string,

        /**
         * Provide a custom render function for the bar node.
         * The render function will be passed a single argument,
         * an object with the following properties:
         *
         * - `index` {`number`} the index of the bar
         * - `key` {`string`} a unique key for the bar
         * - `style` {`object`} positioning styles that should be applied to the node
         * - `className` {`string`} default classNames for the bar
         */
        renderBar: PropTypes.func,

        /**
         * Provide a custom render function for dynamic handle content.
         * For static handle content, you can use the `children` prop.
         * The render function will be passed a single argument,
         * an object with the following properties:
         *
         * - `index` {`number`} the index of the handle
         * - `key` {`string`} a unique key for the handle
         * - `value` {`number`} the value of the handle
         */
        // eslint-disable-next-line zillow/react/require-default-props
        renderHandle: PropTypes.func,
    };

    static defaultProps = {
        min: 0,
        max: 100,
        step: 1,
        minDistance: 0,
        defaultValue: 0,
        orientation: 'horizontal',
        className: 'slider',
        handleClassName: 'handle',
        handleActiveClassName: 'active',
        barClassName: 'bar',
        withBars: false,
        pearling: false,
        disabled: false,
        snapDragDisabled: false,
        invert: false,
        renderBar: props => <div {...props} />,
    };

    constructor(props) {
        super(props);

        const value = this.or(ensureArray(props.value), ensureArray(props.defaultValue));

        // reused throughout the component to store results of iterations over `value`
        this.tempArray = value.slice();

        // array for storing resize timeouts ids
        this.pendingResizeTimeouts = [];

        const zIndices = [];
        for (let i = 0; i < value.length; i += 1) {
            value[i] = this.trimAlignValue(value[i], props);
            zIndices.push(i);
        }

        this.state = {
            index: -1,
            upperBound: 0,
            sliderLength: 0,
            value,
            zIndices,
        };
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.handleResize);
            this.resize();
        }
    }

    // Keep the internal `value` consistent with an outside `value` if present.
    // This basically allows the slider to be a controlled component.
    componentWillReceiveProps(newProps) {
        const value = this.or(ensureArray(newProps.value), this.state.value);

        // ensure the array keeps the same size as `value`
        this.tempArray = value.slice();

        for (let i = 0; i < value.length; i += 1) {
            this.state.value[i] = this.trimAlignValue(value[i], newProps);
        }
        if (this.state.value.length > value.length) {
            this.state.value.length = value.length;
        }

        // If an upperBound has not yet been determined (due to the component being hidden
        // during the mount event, or during the last resize), then calculate it now
        if (this.state.upperBound === 0) {
            this.resize();
        }
    }

    componentWillUnmount() {
        this.clearPendingResizeTimeouts();
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleResize);
        }
    }

    onMouseUp = () => {
        this.onEnd(this.getMouseEventMap());
    };

    onTouchEnd = () => {
        this.onEnd(this.getTouchEventMap());
    };

    onBlur = () => {
        this.onEnd(this.getKeyDownEventMap());
    };

    onEnd(eventMap) {
        removeHandlers(eventMap);
        this.setState({ index: -1 }, this.fireChangeEvent.bind(this, 'onAfterChange'));
    }

    onMouseMove = e => {
        const position = this.getMousePosition(e);
        const diffPosition = this.getDiffPosition(position[0]);
        const newValue = this.getValueFromPosition(diffPosition);
        this.move(newValue);
    };

    onTouchMove = e => {
        if (e.touches.length > 1) {
            return;
        }

        const position = this.getTouchPosition(e);

        if (typeof this.isScrolling === 'undefined') {
            const diffMainDir = position[0] - this.startPosition[0];
            const diffScrollDir = position[1] - this.startPosition[1];
            this.isScrolling = Math.abs(diffScrollDir) > Math.abs(diffMainDir);
        }

        if (this.isScrolling) {
            this.setState({ index: -1 });
            return;
        }

        pauseEvent(e);

        const diffPosition = this.getDiffPosition(position[0]);
        const newValue = this.getValueFromPosition(diffPosition);

        this.move(newValue);
    };

    onKeyDown = e => {
        if (e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                e.preventDefault();
                this.moveDownOneStep();
                return;
            case 'ArrowRight':
            case 'ArrowUp':
                e.preventDefault();
                this.moveUpOneStep();
                return;
            case 'Home':
                this.move(this.props.min);
                return;
            case 'End':
                this.move(this.props.max);
                break;
            default:
        }
    };

    onSliderMouseDown = e => {
        if (this.props.disabled) {
            return;
        }
        this.hasMoved = false;
        if (!this.props.snapDragDisabled) {
            const position = this.getMousePosition(e);
            this.forceValueFromPosition(position[0], i => {
                this.start(i, position[0]);
                this.fireChangeEvent('onChange');
                addHandlers(this.getMouseEventMap());
            });
        }

        pauseEvent(e);
    };

    onSliderClick = e => {
        if (this.props.disabled) {
            return;
        }

        if (this.props.onSliderClick && !this.hasMoved) {
            const position = this.getMousePosition(e);
            const valueAtPos = this.trimAlignValue(
                this.calcValue(this.calcOffsetFromPosition(position[0]))
            );
            this.props.onSliderClick(valueAtPos);
        }
    };

    getValue() {
        return undoEnsureArray(this.state.value);
    }

    getClosestIndex(pixelOffset) {
        let minDist = Number.MAX_VALUE;
        let closestIndex = -1;

        const { value } = this.state;
        const l = value.length;

        for (let i = 0; i < l; i += 1) {
            const offset = this.calcOffset(value[i]);
            const dist = Math.abs(pixelOffset - offset);
            if (dist < minDist) {
                minDist = dist;
                closestIndex = i;
            }
        }

        return closestIndex;
    }

    getMousePosition(e) {
        return [e[`page${this.axisKey()}`], e[`page${this.orthogonalAxisKey()}`]];
    }

    getTouchPosition(e) {
        const touch = e.touches[0];
        return [touch[`page${this.axisKey()}`], touch[`page${this.orthogonalAxisKey()}`]];
    }

    getKeyDownEventMap() {
        return {
            keydown: this.onKeyDown,
            focusout: this.onBlur,
        };
    }

    getMouseEventMap() {
        return {
            mousemove: this.onMouseMove,
            mouseup: this.onMouseUp,
        };
    }

    getTouchEventMap() {
        return {
            touchmove: this.onTouchMove,
            touchend: this.onTouchEnd,
        };
    }

    getValueFromPosition(position) {
        const diffValue =
            (position / (this.state.sliderLength - this.state.handleSize)) *
            (this.props.max - this.props.min);
        return this.trimAlignValue(this.state.startValue + diffValue);
    }

    getDiffPosition(position) {
        let diffPosition = position - this.state.startPosition;
        if (this.props.invert) {
            diffPosition *= -1;
        }
        return diffPosition;
    }

    // create the `keydown` handler for the i-th handle
    createOnKeyDown = i => e => {
        if (this.props.disabled) {
            return;
        }
        this.start(i);
        addHandlers(this.getKeyDownEventMap());
        pauseEvent(e);
    };

    // create the `mousedown` handler for the i-th handle
    createOnMouseDown = i => e => {
        if (this.props.disabled) {
            return;
        }
        const position = this.getMousePosition(e);
        this.start(i, position[0]);
        addHandlers(this.getMouseEventMap());
        pauseEvent(e);
    };

    // create the `touchstart` handler for the i-th handle
    createOnTouchStart = i => e => {
        if (this.props.disabled || e.touches.length > 1) {
            return;
        }
        const position = this.getTouchPosition(e);
        this.startPosition = position;
        // don't know yet if the user is trying to scroll
        this.isScrolling = undefined;
        this.start(i, position[0]);
        addHandlers(this.getTouchEventMap());
        stopPropagation(e);
    };

    handleResize = () => {
        // setTimeout of 0 gives element enough time to have assumed its new size if
        // it is being resized
        const resizeTimeout = window.setTimeout(() => {
            // drop this timeout from pendingResizeTimeouts to reduce memory usage
            this.pendingResizeTimeouts.shift();
            this.resize();
        }, 0);

        this.pendingResizeTimeouts.push(resizeTimeout);
    };

    resize() {
        const { slider } = this;
        const handle = this.handle0;
        const rect = slider.getBoundingClientRect();

        const sizeKey = this.sizeKey();

        const sliderMax = rect[this.posMaxKey()];
        const sliderMin = rect[this.posMinKey()];

        this.setState({
            upperBound: slider[sizeKey] - handle[sizeKey],
            sliderLength: Math.abs(sliderMax - sliderMin),
            handleSize: handle[sizeKey],
            sliderStart: this.props.invert ? sliderMax : sliderMin,
        });
    }

    // calculates the offset of a handle in pixels based on its value.
    calcOffset(value) {
        const range = this.props.max - this.props.min;
        if (range === 0) {
            return 0;
        }
        const ratio = (value - this.props.min) / range;
        return ratio * this.state.upperBound;
    }

    // calculates the value corresponding to a given pixel offset, i.e. the inverse of `calcOffset`.
    calcValue(offset) {
        const ratio = offset / this.state.upperBound;
        return ratio * (this.props.max - this.props.min) + this.props.min;
    }

    calcOffsetFromPosition(position) {
        let pixelOffset = position - this.state.sliderStart;
        if (this.props.invert) {
            pixelOffset = this.state.sliderLength - pixelOffset;
        }
        pixelOffset -= this.state.handleSize / 2;
        return pixelOffset;
    }

    // Snaps the nearest handle to the value corresponding to `position`
    // and calls `callback` with that handle's index.
    forceValueFromPosition(position, callback) {
        const pixelOffset = this.calcOffsetFromPosition(position);
        const closestIndex = this.getClosestIndex(pixelOffset);
        const nextValue = this.trimAlignValue(this.calcValue(pixelOffset));

        // Clone this.state.value since we'll modify it temporarily
        // eslint-disable-next-line zillow/react/no-access-state-in-setstate
        const value = this.state.value.slice();
        value[closestIndex] = nextValue;

        // Prevents the slider from shrinking below `props.minDistance`
        for (let i = 0; i < value.length - 1; i += 1) {
            if (value[i + 1] - value[i] < this.props.minDistance) {
                return;
            }
        }

        this.setState({ value }, callback.bind(this, closestIndex));
    }

    // clear all pending timeouts to avoid error messages after unmounting
    clearPendingResizeTimeouts() {
        do {
            const nextTimeout = this.pendingResizeTimeouts.shift();

            clearTimeout(nextTimeout);
        } while (this.pendingResizeTimeouts.length);
    }

    // Check if the arity of `value` or `defaultValue` matches the number of children
    // (= number of custom handles).
    // If no custom handles are provided,
    // just returns `value` if present and `defaultValue` otherwise.
    // If custom handles are present but neither `value` nor `defaultValue` are applicable
    // the handles are spread out equally.
    // TODO: better name? better solution?
    or(value, defaultValue) {
        const count = React.Children.count(this.props.children);
        switch (count) {
            case 0:
                return value.length > 0 ? value : defaultValue;
            case value.length:
                return value;
            case defaultValue.length:
                return defaultValue;
            default:
                if (value.length !== count || defaultValue.length !== count) {
                    // eslint-disable-next-line no-console
                    console.warn(
                        `${
                            this.constructor.displayName
                        }: Number of values does not match number of children.`
                    );
                }
                return linspace(this.props.min, this.props.max, count);
        }
    }

    start(i, position) {
        const activeEl = document.activeElement;
        const handleRef = this[`handle${i}`];
        // if activeElement is body window will lost focus in IE9
        if (activeEl && activeEl !== document.body && activeEl !== handleRef && activeEl.blur) {
            activeEl.blur();
        }

        this.hasMoved = false;

        this.fireChangeEvent('onBeforeChange');

        const { zIndices } = this.state;
        // remove wherever the element is
        zIndices.splice(zIndices.indexOf(i), 1);
        // add to end
        zIndices.push(i);

        this.setState(prevState => ({
            startValue: prevState.value[i],
            startPosition: position !== undefined ? position : prevState.startPosition,
            index: i,
            zIndices,
        }));
    }

    moveUpOneStep() {
        const oldValue = this.state.value[this.state.index];
        const newValue = oldValue + this.props.step;
        this.move(Math.min(newValue, this.props.max));
    }

    moveDownOneStep() {
        const oldValue = this.state.value[this.state.index];
        const newValue = oldValue - this.props.step;
        this.move(Math.max(newValue, this.props.min));
    }

    move(newValue) {
        this.hasMoved = true;

        const { index, value } = this.state;
        const { length } = value;
        const oldValue = value[index];

        const { pearling, max, min, minDistance } = this.props;

        // if "pearling" (= handles pushing each other) is disabled,
        // prevent the handle from getting closer than `minDistance` to the previous or next handle.
        if (!pearling) {
            if (index > 0) {
                const valueBefore = value[index - 1];
                if (newValue < valueBefore + minDistance) {
                    // eslint-disable-next-line no-param-reassign
                    newValue = valueBefore + minDistance;
                }
            }

            if (index < length - 1) {
                const valueAfter = value[index + 1];
                if (newValue > valueAfter - minDistance) {
                    // eslint-disable-next-line no-param-reassign
                    newValue = valueAfter - minDistance;
                }
            }
        }

        value[index] = newValue;

        // if "pearling" is enabled, let the current handle push the pre- and succeeding handles.
        if (pearling && length > 1) {
            if (newValue > oldValue) {
                this.pushSucceeding(value, minDistance, index);
                trimSucceeding(length, value, minDistance, max);
            } else if (newValue < oldValue) {
                this.pushPreceding(value, minDistance, index);
                trimPreceding(length, value, minDistance, min);
            }
        }

        // Normally you would use `shouldComponentUpdate`,
        // but since the slider is a low-level component,
        // the extra complexity might be worth the extra performance.
        if (newValue !== oldValue) {
            this.setState({ value }, this.fireChangeEvent.bind(this, 'onChange'));
        }
    }

    pushSucceeding(value, minDistance, index) {
        let i;
        let padding;
        for (
            i = index, padding = value[i] + minDistance;
            value[i + 1] !== null && padding > value[i + 1];
            i += 1, padding = value[i] + minDistance
        ) {
            // eslint-disable-next-line no-param-reassign
            value[i + 1] = this.alignValue(padding);
        }
    }

    pushPreceding(value, minDistance, index) {
        for (
            let i = index, padding = value[i] - minDistance;
            value[i - 1] !== null && padding < value[i - 1];
            i -= 1, padding = value[i] - minDistance
        ) {
            // eslint-disable-next-line no-param-reassign
            value[i - 1] = this.alignValue(padding);
        }
    }

    axisKey() {
        if (this.props.orientation === 'vertical') {
            return 'Y';
        }
        // Defaults to 'horizontal';
        return 'X';
    }

    orthogonalAxisKey() {
        if (this.props.orientation === 'vertical') {
            return 'X';
        }
        // Defaults to 'horizontal'
        return 'Y';
    }

    posMinKey() {
        if (this.props.orientation === 'vertical') {
            return this.props.invert ? 'bottom' : 'top';
        }
        // Defaults to 'horizontal'
        return this.props.invert ? 'right' : 'left';
    }

    posMaxKey() {
        if (this.props.orientation === 'vertical') {
            return this.props.invert ? 'top' : 'bottom';
        }
        // Defaults to 'horizontal'
        return this.props.invert ? 'left' : 'right';
    }

    sizeKey() {
        if (this.props.orientation === 'vertical') {
            return 'clientHeight';
        }
        // Defaults to 'horizontal'
        return 'clientWidth';
    }

    trimAlignValue(val, props) {
        return this.alignValue(this.trimValue(val, props), props);
    }

    trimValue(val, props = this.props) {
        let trimmed = val;
        if (trimmed <= props.min) {
            trimmed = props.min;
        }
        if (trimmed >= props.max) {
            trimmed = props.max;
        }

        return trimmed;
    }

    alignValue(val, props = this.props) {
        const valModStep = (val - props.min) % props.step;
        let alignValue = val - valModStep;

        if (Math.abs(valModStep) * 2 >= props.step) {
            alignValue += valModStep > 0 ? props.step : -props.step;
        }

        return parseFloat(alignValue.toFixed(5));
    }

    fireChangeEvent(event) {
        if (this.props[event]) {
            this.props[event](undoEnsureArray(this.state.value));
        }
    }

    buildHandleStyle(offset, i) {
        const style = {
            position: 'absolute',
            willChange: this.state.index >= 0 ? this.posMinKey() : '',
            zIndex: this.state.zIndices.indexOf(i) + 1,
        };
        style[this.posMinKey()] = `${offset}px`;
        return style;
    }

    buildBarStyle(min, max) {
        const obj = {
            position: 'absolute',
            willChange: this.state.index >= 0 ? `${this.posMinKey()},${this.posMaxKey()}` : '',
        };
        obj[this.posMinKey()] = min;
        obj[this.posMaxKey()] = max;
        return obj;
    }

    renderHandle = (style, child, i) => {
        const className = `${this.props.handleClassName} ${this.props.handleClassName}-${i} ${
            this.state.index === i ? this.props.handleActiveClassName : ''
        }`;

        return React.createElement(
            'div',
            {
                ref: r => {
                    this[`handle${i}`] = r;
                },
                key: `handle${i}`,
                className,
                style,
                onMouseDown: this.createOnMouseDown(i),
                onTouchStart: this.createOnTouchStart(i),
                onFocus: this.createOnKeyDown(i),
                tabIndex: 0,
                role: 'slider',
                'aria-valuenow': this.state.value[i],
                'aria-valuemin': this.props.min,
                'aria-valuemax': this.props.max,
                'aria-label': Array.isArray(this.props.ariaLabel)
                    ? this.props.ariaLabel[i]
                    : this.props.ariaLabel,
                'aria-valuetext': this.props.ariaValuetext,
            },
            child
        );
    };

    renderHandles(offset) {
        const { length } = offset;

        const styles = this.tempArray;
        for (let i = 0; i < length; i += 1) {
            styles[i] = this.buildHandleStyle(offset[i], i);
        }

        const res = [];
        if (React.Children.count(this.props.children) > 0) {
            React.Children.forEach(this.props.children, (child, i) => {
                res[i] = this.renderHandle(styles[i], child, i);
            });
        } else if (this.props.renderHandle) {
            for (let i = 0; i < length; i += 1) {
                const child = this.props.renderHandle({
                    index: i,
                    key: `${this.props.handleClassName}-${i}`,
                    value: this.state.value[i],
                });
                res[i] = this.renderHandle(styles[i], child, i);
            }
        } else {
            for (let i = 0; i < length; i += 1) {
                res[i] = this.renderHandle(styles[i], null, i);
            }
        }
        return res;
    }

    renderBar = (i, offsetFrom, offsetTo) =>
        this.props.renderBar({
            index: i,
            key: `${this.props.barClassName}-${i}`,
            className: `${this.props.barClassName} ${this.props.barClassName}-${i}`,
            style: this.buildBarStyle(offsetFrom, this.state.upperBound - offsetTo),
        });

    renderBars(offset) {
        const bars = [];
        const lastIndex = offset.length - 1;

        bars.push(this.renderBar(0, 0, offset[0]));

        for (let i = 0; i < lastIndex; i += 1) {
            bars.push(this.renderBar(i + 1, offset[i], offset[i + 1]));
        }

        bars.push(this.renderBar(lastIndex + 1, offset[lastIndex], this.state.upperBound));

        return bars;
    }

    render() {
        const offset = this.tempArray;
        const { value } = this.state;
        const l = value.length;
        for (let i = 0; i < l; i += 1) {
            offset[i] = this.calcOffset(value[i], i);
        }

        const bars = this.props.withBars ? this.renderBars(offset) : null;
        const handles = this.renderHandles(offset);

        return React.createElement(
            'div',
            {
                ref: r => {
                    this.slider = r;
                },
                style: { position: 'relative' },
                className: this.props.className + (this.props.disabled ? ' disabled' : ''),
                onMouseDown: this.onSliderMouseDown,
                onClick: this.onSliderClick,
            },
            bars,
            handles
        );
    }
}

export default ReactSlider;
