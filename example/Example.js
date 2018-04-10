import * as React from 'react';
import ExampleSlider from './ExampleSlider';

export default () => (
    <div>
        <ExampleSlider defaultValue={0} 
                       orientation="horizontal" 
                       ariaLabel="This is a single handle" />

        <ExampleSlider defaultValue={[0, 100]}
                       orientation="horizontal"
                       withBars={true}
                       ariaLabel={['Lower handle', 'Upper handle']}
                       ariaValuetext="Some arbitrary value" 
                       containerClassName="example-2"/>

        <ExampleSlider defaultValue={[0, 50, 100]}
                       orientation="horizontal"
                       withBars={true}
                       ariaLabel={['Leftmost handle', 'Middle handle', 'Rightmost handle']} />

        <ExampleSlider defaultValue={[0, 50, 100]}
                       orientation="vertical"
                       withBars={true}
                       invert={true}
                       ariaLabel={['Lowest handle', 'Middle handle', 'Top handle']} />
    </div>
);