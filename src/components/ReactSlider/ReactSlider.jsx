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
        if (typeof document !== 'undefined') {
            document.addEventListener(key, eventMap[key], false);
        }
    });
}

function removeHandlers(eventMap) {
    Object.keys(eventMap).forEach(key => {
        if (typeof document !== 'undefined') {
            document.removeEventListener(key, eventMap[key], false);
        }
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
         * The result of the function is the value to be added or subtracted
         * when the `Page Up` or `Page Down` keys are pressed.
         *
         * The current `step` value will be passed as the only argument.
         * By default, paging will modify `step` by a factor of 10.
         */
        pageFn: PropTypes.func,

        /**
         * The minimal distance between any pair of thumbs.
         * Must be positive, but zero means they can sit on top of each other.
         */
        minDistance: PropTypes.number,

        /**
         * Determines the initial positions of the thumbs and the number of thumbs.
         *
         * If a number is passed a slider with one thumb will be rendered.
         * If an array is passed each value will determine the position of one thumb.
         * The values in the array must be sorted.
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
         * The css class set on each thumb node.
         *
         * In addition each thumb will receive a numbered css class of the form
         * `${thumbClassName}-${i}`, e.g. `thumb-0`, `thumb-1`, ...
         */
        thumbClassName: PropTypes.string,

        /**
         * The css class set on the thumb that is currently being moved.
         */
        thumbActiveClassName: PropTypes.string,

        /**
         * If `true` tracks between the thumbs will be rendered.
         */
        withTracks: PropTypes.bool,

        /**
         * The css class set on the tracks between the thumbs.
         * In addition track fragment will receive a numbered css class of the form
         * `${trackClassName}-${i}`, e.g. `track-0`, `track-1`, ...
         */
        trackClassName: PropTypes.string,

        /**
         * If `true` the active thumb will push other thumbs
         * within the constraints of `min`, `max`, `step` and `minDistance`.
         */
        pearling: PropTypes.bool,

        /**
         * If `true` the thumbs can't be moved.
         */
        disabled: PropTypes.bool,

        /**
         * Disables thumb move when clicking the slider track
         */
        snapDragDisabled: PropTypes.bool,

        /**
         * Inverts the slider.
         */
        invert: PropTypes.bool,

        /**
         * Callback called before starting to move a thumb.
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
         * Callback called only after moving a thumb has ended.
         */
        // eslint-disable-next-line max-len
        // eslint-disable-next-line zillow/react/require-default-props, zillow/react/no-unused-prop-types
        onAfterChange: PropTypes.func,

        /**
         * Callback called when the the slider is clicked (thumb or tracks).
         * Receives the value at the clicked position as argument.
         */
        // eslint-disable-next-line zillow/react/require-default-props
        onSliderClick: PropTypes.func,

        /**
         * aria-label for screen-readers to apply to the thumbs.
         * Use an array for more than one thumb.
         * The length of the array must match the number of thumbs in the value array.
         */
        // eslint-disable-next-line zillow/react/require-default-props
        ariaLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),

        /**
         * aria-valuetext for screen-readers.
         * Can be a static string, or a function that returns a string.
         * The function will be passed a single argument,
         * an object with the following properties:
         *
         *     state => `Value: ${state.value}`
         *
         * - `state.index` {`number`} the index of the thumb
         * - `state.value` {`number` | `array`} the current value state
         * - `state.valueNow` {`number`} the value of the thumb (i.e. aria-valuenow)
         */
        // eslint-disable-next-line zillow/react/require-default-props
        ariaValuetext: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

        /**
         * Provide a custom render function for the track node.
         * The render function will be passed two arguments,
         * an object with props that should be added to your handle node,
         * and an object with track and slider state:
         *
         *     (props, state) => <div {...props} />
         *
         * - `props` {`object`} props to be spread into your track node
         * - `state.index` {`number`} the index of the track
         * - `state.value` {`number` | `array`} the current value state
         */
        renderTrack: PropTypes.func,

        /**
         * Provide a custom render function for dynamic thumb content.
         * The render function will be passed two arguments,
         * an object with props that should be added to your thumb node,
         * and an object with thumb and slider state:
         *
         *     (props, state) => <div {...props} />
         *
         * - `props` {`object`} props to be spread into your thumb node
         * - `state.index` {`number`} the index of the thumb
         * - `state.value` {`number` | `array`} the current value state
         * - `state.valueNow` {`number`} the value of the thumb (i.e. aria-valuenow)
         */
        // eslint-disable-next-line zillow/react/require-default-props
        renderThumb: PropTypes.func,
    };

    static defaultProps = {
        min: 0,
        max: 100,
        step: 1,
        pageFn: step => step * 10,
        minDistance: 0,
        defaultValue: 0,
        orientation: 'horizontal',
        className: 'slider',
        thumbClassName: 'thumb',
        thumbActiveClassName: 'active',
        trackClassName: 'track',
        withTracks: true,
        pearling: false,
        disabled: false,
        snapDragDisabled: false,
        invert: false,
        renderThumb: props => <div {...props} />,
        renderTrack: props => <div {...props} />,
    };

    constructor(props) {
        super(props);

        let value = ensureArray(props.value);
        if (!value.length) {
            value = ensureArray(props.defaultValue);
        }

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
        let value = ensureArray(newProps.value);
        if (!value.length) {
            // eslint-disable-next-line prefer-destructuring
            value = this.state.value;
        }

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
        this.setState({ index: -1 }, this.onEnd(this.getKeyDownEventMap()));
    };

    onEnd(eventMap) {
        removeHandlers(eventMap);
        this.fireChangeEvent('onAfterChange');
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
            case 'Left':
            case 'Down':
                e.preventDefault();
                this.moveDownByStep();
                break;
            case 'ArrowRight':
            case 'ArrowUp':
            case 'Right':
            case 'Up':
                e.preventDefault();
                this.moveUpByStep();
                break;
            case 'Home':
                e.preventDefault();
                this.move(this.props.min);
                break;
            case 'End':
                e.preventDefault();
                this.move(this.props.max);
                break;
            case 'PageDown':
                e.preventDefault();
                this.moveDownByStep(this.props.pageFn(this.props.step));
                break;
            case 'PageUp':
                e.preventDefault();
                this.moveUpByStep(this.props.pageFn(this.props.step));
                break;
            default:
        }
    };

    onSliderMouseDown = e => {
        // do nothing if disabled or right click
        if (this.props.disabled || e.button === 2) {
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
            (position / (this.state.sliderLength - this.state.thumbSize)) *
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

    // create the `keydown` handler for the i-th thumb
    createOnKeyDown = i => e => {
        if (this.props.disabled) {
            return;
        }
        this.start(i);
        addHandlers(this.getKeyDownEventMap());
        pauseEvent(e);
    };

    // create the `mousedown` handler for the i-th thumb
    createOnMouseDown = i => e => {
        // do nothing if disabled or right click
        if (this.props.disabled || e.button === 2) {
            return;
        }
        const position = this.getMousePosition(e);
        this.start(i, position[0]);
        addHandlers(this.getMouseEventMap());
        pauseEvent(e);
    };

    // create the `touchstart` handler for the i-th thumb
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
        const thumb = this.thumb0;
        const rect = slider.getBoundingClientRect();

        const sizeKey = this.sizeKey();

        const sliderMax = rect[this.posMaxKey()];
        const sliderMin = rect[this.posMinKey()];

        this.setState({
            upperBound: slider[sizeKey] - thumb[sizeKey],
            sliderLength: Math.abs(sliderMax - sliderMin),
            thumbSize: thumb[sizeKey],
            sliderStart: this.props.invert ? sliderMax : sliderMin,
        });
    }

    // calculates the offset of a thumb in pixels based on its value.
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
        pixelOffset -= this.state.thumbSize / 2;
        return pixelOffset;
    }

    // Snaps the nearest thumb to the value corresponding to `position`
    // and calls `callback` with that thumb's index.
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

    start(i, position) {
        const thumbRef = this[`thumb${i}`];
        thumbRef.focus();

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

    moveUpByStep(step = this.props.step) {
        const oldValue = this.state.value[this.state.index];
        const newValue = oldValue + step;
        this.move(Math.min(newValue, this.props.max));
    }

    moveDownByStep(step = this.props.step) {
        const oldValue = this.state.value[this.state.index];
        const newValue = oldValue - step;
        this.move(Math.max(newValue, this.props.min));
    }

    move(newValue) {
        this.hasMoved = true;

        const { index, value } = this.state;
        const { length } = value;
        const oldValue = value[index];

        const { pearling, max, min, minDistance } = this.props;

        // if "pearling" (= thumbs pushing each other) is disabled,
        // prevent the thumb from getting closer than `minDistance` to the previous or next thumb.
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

        // if "pearling" is enabled, let the current thumb push the pre- and succeeding thumbs.
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

    buildThumbStyle(offset, i) {
        const style = {
            position: 'absolute',
            willChange: this.state.index >= 0 ? this.posMinKey() : '',
            zIndex: this.state.zIndices.indexOf(i) + 1,
        };
        style[this.posMinKey()] = `${offset}px`;
        return style;
    }

    buildTrackStyle(min, max) {
        const obj = {
            position: 'absolute',
            willChange: this.state.index >= 0 ? `${this.posMinKey()},${this.posMaxKey()}` : '',
        };
        obj[this.posMinKey()] = min;
        obj[this.posMaxKey()] = max;
        return obj;
    }

    renderThumb = (style, i) => {
        const className = `${this.props.thumbClassName} ${this.props.thumbClassName}-${i} ${
            this.state.index === i ? this.props.thumbActiveClassName : ''
        }`;

        const props = {
            'ref': r => {
                this[`thumb${i}`] = r;
            },
            'key': `${this.props.thumbClassName}-${i}`,
            className,
            style,
            'onMouseDown': this.createOnMouseDown(i),
            'onTouchStart': this.createOnTouchStart(i),
            'onFocus': this.createOnKeyDown(i),
            'tabIndex': 0,
            'role': 'slider',
            'aria-orientation': this.props.orientation,
            'aria-valuenow': this.state.value[i],
            'aria-valuemin': this.props.min,
            'aria-valuemax': this.props.max,
            'aria-label': Array.isArray(this.props.ariaLabel)
                ? this.props.ariaLabel[i]
                : this.props.ariaLabel,
        };

        const state = {
            index: i,
            value: undoEnsureArray(this.state.value),
            valueNow: this.state.value[i],
        };

        if (this.props.ariaValuetext) {
            props['aria-valuetext'] =
                typeof this.props.ariaValuetext === 'string'
                    ? this.props.ariaValuetext
                    : this.props.ariaValuetext(state);
        }

        return this.props.renderThumb(props, state);
    };

    renderThumbs(offset) {
        const { length } = offset;

        const styles = this.tempArray;
        for (let i = 0; i < length; i += 1) {
            styles[i] = this.buildThumbStyle(offset[i], i);
        }

        const res = [];
        for (let i = 0; i < length; i += 1) {
            res[i] = this.renderThumb(styles[i], i);
        }
        return res;
    }

    renderTrack = (i, offsetFrom, offsetTo) => {
        const props = {
            key: `${this.props.trackClassName}-${i}`,
            className: `${this.props.trackClassName} ${this.props.trackClassName}-${i}`,
            style: this.buildTrackStyle(offsetFrom, this.state.upperBound - offsetTo),
        };
        const state = {
            index: i,
            value: undoEnsureArray(this.state.value),
        };
        return this.props.renderTrack(props, state);
    };

    renderTracks(offset) {
        const tracks = [];
        const lastIndex = offset.length - 1;

        tracks.push(this.renderTrack(0, 0, offset[0]));

        for (let i = 0; i < lastIndex; i += 1) {
            tracks.push(this.renderTrack(i + 1, offset[i], offset[i + 1]));
        }

        tracks.push(this.renderTrack(lastIndex + 1, offset[lastIndex], this.state.upperBound));

        return tracks;
    }

    render() {
        const offset = this.tempArray;
        const { value } = this.state;
        const l = value.length;
        for (let i = 0; i < l; i += 1) {
            offset[i] = this.calcOffset(value[i], i);
        }

        const tracks = this.props.withTracks ? this.renderTracks(offset) : null;
        const thumbs = this.renderThumbs(offset);

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
            tracks,
            thumbs
        );
    }
}

export default ReactSlider;
