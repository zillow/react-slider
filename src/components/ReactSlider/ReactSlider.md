Single slider, similar to `<input type="range" defaultValue={0} />`

```jsx
<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
/>
```

Double slider

```jsx
<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    defaultValue={[0, 100]}
    ariaLabel={['Lower thumb', 'Upper thumb']}
    ariaValuetext={state => `Thumb value ${state.valueNow}`}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    pearling
    minDistance={10}
/>
```

Multi slider

```jsx
<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    defaultValue={[0, 50, 100]}
    ariaLabel={['Leftmost thumb', 'Middle thumb', 'Rightmost thumb']}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    pearling
    minDistance={10}
/>
```

Vertical slider

```jsx
<ReactSlider
    className="vertical-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    defaultValue={[0, 50, 100]}
    ariaLabel={['Lowest thumb', 'Middle thumb', 'Top thumb']}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    orientation="vertical"
    invert
    pearling
    minDistance={10}
/>
```

Custom styling using [styled-components](https://www.styled-components.com/)

```jsx
import styled from 'styled-components';

const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 25px;
`;

const StyledThumb = styled.div`
    height: 25px;
    line-height: 25px;
    width: 25px;
    text-align: center;
    background-color: #000;
    color: #fff;
    border-radius: 50%;
    cursor: grab;
`;

const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => props.index === 2 ? '#f00' : props.index === 1 ? '#0f0' : '#ddd'};
    border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

<StyledSlider
    defaultValue={[50, 75]}
    renderTrack={Track}
    renderThumb={Thumb}
/>
```
