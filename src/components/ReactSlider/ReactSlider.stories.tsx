import { useState } from 'react';
import { ReactSlider } from './ReactSlider';

const meta = {
  title: 'ReactSlider',
  component: ReactSlider,
  tags: ['autodocs'],
};

export default meta;

const defaults = {
  min: 0,
  max: 100,
  step: 1,
  pageFn: (step) => step * 10,
  minDistance: 0,
  defaultValue: 0,
  orientation: 'horizontal',
  className: 'react-slider',
  thumbClassName: 'react-slider__thumb',
  thumbActiveClassName: 'react-slider__thumb--active',
  trackClassName: 'react-slider__track',
  markClassName: 'react-slider__mark',
  withTracks: true,
  pearling: false,
  disabled: false,
  snapDragDisabled: false,
  invert: false,
  marks: [],
  renderThumb: ({ key, ...props }) => <div key={key} {...props} />,
  renderTrack: ({ key, ...props }) => <div key={key} {...props} />,
  renderMark: ({ key, ...props }) => <span key={key} {...props} />,
};

/**
 * Single slider, similar to `<input type="range" defaultValue={0} />`
 */

export const DefaultSlider = {
  args: {
    ...defaults,
    className: 'react-slider--horizontal',
    renderThumb: (props, state) => <div {...props}>{state.valueNow}</div>,
  },
};

export const SliderWithMarks = {
  args: {
    ...defaults,
    className: 'react-slider--horizontal',
    marks: true,
    min: 0,
    max: 9,
    renderThumb: (props, state) => <div {...props}>{state.valueNow}</div>,
  },
};

export const InvertedSliderWithMarks = {
  args: {
    ...defaults,
    className: 'react-slider--horizontal',
    marks: [5, 6, 7, 8, 9],
    min: 0,
    max: 9,
    invert: true,
    renderThumb: (props, state) => <div {...props}>{state.valueNow}</div>,
  },
};

export const DoubleSlider = {
  args: {
    ...defaults,
    className: 'react-slider--horizontal',
    defaultValue: [0, 100],
    ariaLabel: ['Lower thumb', 'Upper thumb'],
    ariaValuetext: (state) => `Thumb value ${state.valueNow}`,
    pearling: true,
    minDistance: 10,
    renderThumb: (props, state) => <div {...props}>{state.valueNow}</div>,
  },
};

export const MultiSlider = {
  args: {
    ...defaults,
    className: 'react-slider--horizontal',
    defaultValue: [0, 50, 100],
    ariaLabel: ['Leftmost thumb', 'Middle thumb', 'Rightmost thumb'],
    pearling: true,
    minDistance: 10,
    renderThumb: (props, state) => <div {...props}>{state.valueNow}</div>,
  },
};

export const VerticalSlider = {
  args: {
    ...defaults,
    className: 'react-slider--vertical',
    defaultValue: [0, 50, 100],
    ariaLabel: ['Lowest thumb', 'Middle thumb', 'Top thumb'],
    orientation: 'vertical',
    invert: true,
    pearling: true,
    minDistance: 10,
    renderThumb: (props, state) => <div {...props}>{state.valueNow}</div>,
  },
};

export const VerticalSliderWithMarks = {
  args: {
    ...defaults,
    className: 'react-slider--vertical',
    defaultValue: [0, 50, 100],
    marks: 25,
    ariaLabel: ['Lowest thumb', 'Middle thumb', 'Top thumb'],
    orientation: 'vertical',
    invert: true,
    pearling: true,
    minDistance: 10,
    renderThumb: (props, state) => <div {...props}>{state.valueNow}</div>,
  },
};

/**
 * Track changes with `onBeforeChange`, `onChange`, and `onAfterChange` event handlers.
 */

export const SliderWithEventHandlers = {
  args: {
    ...defaults,
    className: 'react-slider--horizontal',
    onBeforeChange: (value, index) =>
      console.log(`onBeforeChange: ${JSON.stringify({ value, index })}`),
    onChange: (value, index) =>
      console.log(`onChange: ${JSON.stringify({ value, index })}`),
    onAfterChange: (value, index) =>
      console.log(`onAfterChange: ${JSON.stringify({ value, index })}`),
    renderThumb: (props, state) => <div {...props}>{state.valueNow}</div>,
  },
};

/**
 * Using the `onChange` event handler, you can use the slider as a controlled component.
 */

export const SliderWithControlledValue = {
  args: {
    ...defaults,
    onBeforeChange: (value, index) =>
      console.log(`onBeforeChange: ${JSON.stringify({ value, index })}`),
    onChange: (value, index) =>
      console.log(`onChange: ${JSON.stringify({ value, index })}`),
    onAfterChange: (value, index) =>
      console.log(`onAfterChange: ${JSON.stringify({ value, index })}`),
    className: 'react-slider--horizontal',
    renderThumb: (props, state) => <div {...props}>{state.valueNow}</div>,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value] = useState([25, 50]);
    return <ReactSlider {...args} value={value} />;
  },
};
