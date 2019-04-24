### Single slider

Similar to `<input type="range" defaultValue={50} />`

```jsx
initialState = { value: 0 };

<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    value={state.value}
    onChange={value => setState({ value })}
    orientation="horizontal"
    ariaLabel="This is a single thumb"
>
    <div>{state.value}</div>
</ReactSlider>
```

### Double slider (with tracks between the thumbs)

```jsx
initialState = { value: [0, 100] };

<ReactSlider
    className="horizontal-slider"
    trackClassName="example-track"
    thumbClassName="example-thumb"
    value={state.value}
    onChange={value => setState({ value })}
    orientation="horizontal"
    withTracks
    ariaLabel={['Lower thumb', 'Upper thumb']}
    ariaValuetext="Some arbitrary value"
    pearling
    minDistance={10}
>
    {state.value.map((value, i) => <div key={i}>{value}</div>)}
</ReactSlider>
```

### Multi slider

```jsx
initialState = { value: [0, 50, 100] };

<ReactSlider
    className="horizontal-slider"
    trackClassName="example-track"
    thumbClassName="example-thumb"
    value={state.value}
    onChange={value => setState({ value })}
    orientation="horizontal"
    withTracks
    ariaLabel={['Leftmost thumb', 'Middle thumb', 'Rightmost thumb']}
    pearling
    minDistance={10}
>
    {state.value.map((value, i) => <div key={i}>{value}</div>)}
</ReactSlider>
```

### Vertical slider

```jsx
initialState = { value: [0, 50, 100] };

<ReactSlider
    className="vertical-slider"
    trackClassName="example-track"
    thumbClassName="example-thumb"
    value={state.value}
    onChange={value => setState({ value })}
    orientation="vertical"
    withTracks
    invert
    ariaLabel={['Lowest thumb', 'Middle thumb', 'Top thumb']}
    pearling
    minDistance={10}
>
    {state.value.map((value, i) => <div key={i}>{value}</div>)}
</ReactSlider>
```

### Custom styling with [styled-components](https://www.styled-components.com/)

The track and thumb nodes can be customized with the `renderTrack` and `renderThumb` render props.

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

const Thumb = ({ value, ...props }) => <StyledThumb {...props}>{value}</StyledThumb>;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => props.index === 2 ? '#f00' : props.index === 1 ? '#0f0' : '#ddd'};
    border-radius: 999px;
`;

const Track = ({ className, ...props }) => <StyledTrack {...props} />;

<StyledSlider
    defaultValue={[50, 75]}
    withTracks
    renderTrack={Track}
    renderThumb={Thumb}
/>
```
