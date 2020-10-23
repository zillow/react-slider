Single slider, similar to `<input type="range" defaultValue={0} />`

```jsx
<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
/>
```

Slider with marks

```jsx
<ReactSlider
    className="horizontal-slider"
    marks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
    renderMark={(props) => <span className="example-dot" {...props} />}
    min={0}
    max={9}
    thumbClassName="example-thumb"
    trackClassName="example-track"
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
/>
```

Slider with marks and right to left

```jsx
<ReactSlider
    className="horizontal-slider"
    marks={[5, 7, 9]}
    renderMark={(props) => <span className="example-dot" {...props} />}
    min={0}
    max={9}
    invert
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

Vertical slider with marks

```jsx
<ReactSlider
    className="vertical-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    defaultValue={[0, 5, 10]}
    max={10}
    ariaLabel={['Lowest thumb', 'Middle thumb', 'Top thumb']}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    orientation="vertical"
    invert
    pearling
    minDistance={1}
    marks={[0, 3, 5, 8, 10]}
    renderMark={(props) => <span className="example-dot" {...props} />}
/>
```

Track changes with `onBeforeChange`, `onChange`, and `onAfterChange` event handlers

```jsx
<ReactSlider
    className="horizontal-slider"
    thumbClassName="example-thumb"
    trackClassName="example-track"
    onBeforeChange={val => console.log('onBeforeChange value:', val)}
    onChange={val => console.log('onChange value:', val)}
    onAfterChange={val => console.log('onAfterChange value:', val)}
    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
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

In some case you may need to programatically tell the slider to resize, for example if the parent container is resizing independently of the window.
Set a [ref](https://reactjs.org/docs/refs-and-the-dom.html) on the slider component, and call `resize`.

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
    background: ${props => (props.index === 2 ? '#f00' : props.index === 1 ? '#0f0' : '#ddd')};
    border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const StyledContainer = styled.div`
    resize: horizontal;
    overflow: auto;
    width: 50%;
    max-width: 100%;
    padding-right: 8px;
`;

const ResizableSlider = () => {
    const containerRef = React.useRef();
    const sliderRef = React.useRef();
    React.useEffect(() => {
        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            sliderRef.current.resize();
        });
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.unobserve(containerRef.current);
        };
    });

    return (
        <StyledContainer ref={containerRef}>
            <StyledSlider
                ref={sliderRef}
                defaultValue={[50, 75]}
                renderTrack={Track}
                renderThumb={Thumb}
            />
        </StyledContainer>
    );
};

<ResizableSlider />
```
