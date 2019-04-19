import React from 'react';
import renderer from 'react-test-renderer';
import ReactSlider from '../../../index';

describe('<ReactSlider>', () => {
    it('can render', () => {
        const tree = renderer.create(<ReactSlider />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
