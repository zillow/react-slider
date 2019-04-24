### Single slider

Similar to `<input type="range" defaultValue={50} />`

```jsx
initialState = { value: 0 };

<ReactSlider
    className="horizontal-slider"
    value={state.value}
    onChange={value => setState({ value })}
    orientation="horizontal"
    ariaLabel="This is a single handle"
>
    <div>{state.value}</div>
</ReactSlider>
```

### Double slider (with bars between the handles)

```jsx
initialState = { value: [0, 100] };

<ReactSlider
    className="horizontal-slider"
    value={state.value}
    onChange={value => setState({ value })}
    orientation="horizontal"
    withBars
    ariaLabel={['Lower handle', 'Upper handle']}
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
    value={state.value}
    onChange={value => setState({ value })}
    orientation="horizontal"
    withBars
    ariaLabel={['Leftmost handle', 'Middle handle', 'Rightmost handle']}
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
    value={state.value}
    onChange={value => setState({ value })}
    orientation="vertical"
    withBars
    invert
    ariaLabel={['Lowest handle', 'Middle handle', 'Top handle']}
    pearling
    minDistance={10}
>
    {state.value.map((value, i) => <div key={i}>{value}</div>)}
</ReactSlider>
```

### Custom styling with [styled-components](https://www.styled-components.com/)

The bar fragment can be customized with the `renderBar` render prop,
and you can pass in custom handles as `children`.

```jsx
import styled from 'styled-components';

const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 25px;
`;

const StyledHandle = styled.div`
    height: 25px;
    width: 25px;
    background-color: #000;
    border-radius: 50%;
    cursor: grab;
`;

const StyledBar = styled.div`
    top: 0;
    bottom: 0;
    background: ${props => props.index ? '#0f0' : '#ddd'};
    border-radius: 999px;
`;

const Bar = ({ className, ...props }) => <StyledBar {...props} />;

<StyledSlider
    defaultValue={50}
    withBars
    renderBar={Bar}
    handleClassName=""
>
    <StyledHandle />
</StyledSlider>
```
