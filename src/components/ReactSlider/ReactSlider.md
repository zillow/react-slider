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
