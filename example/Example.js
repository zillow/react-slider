import * as React from 'react';
import ExampleSlider from './ExampleSlider';

export default () => (
    <div>
        <div id="horizontal-1">
            <ExampleSlider defaultValue={0} 
                        orientation="horizontal" 
                        ariaLabel="This is a single handle" />
        </div>

        <div id="horizontal-2">
            <ExampleSlider defaultValue={[0, 100]}
                        orientation="horizontal"
                        withBars={true}
                        ariaLabel={['Lower handle', 'Upper handle']}
                        ariaValuetext="Some arbitrary value" />
        </div>

        <div id="horizontal-3">
            <ExampleSlider defaultValue={[0, 50, 100]}
                        orientation="horizontal"
                        withBars={true}
                        ariaLabel={['Leftmost handle', 'Middle handle', 'Rightmost handle']} />
        </div>

        <div id="vertical">
            <ExampleSlider defaultValue={[0, 50, 100]}
                        orientation="vertical"
                        withBars={true}
                        invert={true}
                        ariaLabel={['Lowest handle', 'Middle handle', 'Top handle']} />
        </div>
    </div>
);