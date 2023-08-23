import React from 'react';
import renderer from 'react-test-renderer';
import ReactSlider from '../ReactSlider';

window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
    }));

describe('<ReactSlider>', () => {
    it('can render', () => {
        const tree = renderer.create(<ReactSlider />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    describe('event handlers', () => {
        beforeEach(() => {
            // https://github.com/facebook/jest/issues/890#issuecomment-209698782
            Object.defineProperty(document, 'addEventListener', {
                writable: true,
                value: jest.fn(),
            });
            Object.defineProperty(document, 'removeEventListener', {
                writable: true,
                value: jest.fn(),
            });
        });

        it('does not call any event handlers if the value does not change', () => {
            const onBeforeChange = jest.fn();
            const onChange = jest.fn();
            const onAfterChange = jest.fn();
            const testRenderer = renderer.create(
                <ReactSlider
                    onBeforeChange={onBeforeChange}
                    onChange={onChange}
                    onAfterChange={onAfterChange}
                    thumbClassName="test-thumb"
                    min={0}
                    step={1}
                />
            );

            const testInstance = testRenderer.root;
            const thumb = testInstance.findByProps({ className: 'test-thumb test-thumb-0 ' });

            const { addEventListener } = document;
            expect(addEventListener).not.toHaveBeenCalled();

            // simulate focus on thumb
            thumb.props.onFocus();

            expect(addEventListener).toHaveBeenCalledTimes(3);
            expect(addEventListener.mock.calls[0][0]).toBe('keydown');
            expect(addEventListener.mock.calls[1][0]).toBe('keyup');
            expect(addEventListener.mock.calls[2][0]).toBe('focusout');

            const onKeyDown = addEventListener.mock.calls[0][1];

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} });

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            onKeyDown({ key: 'Home', preventDefault: () => {} });

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            onKeyDown({ key: 'PageDown', preventDefault: () => {} });

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();
        });

        it('calls onBeforeChange only once before onChange', () => {
            const onBeforeChange = jest.fn();
            const onChange = jest.fn();
            const testRenderer = renderer.create(
                <ReactSlider
                    onBeforeChange={onBeforeChange}
                    onChange={onChange}
                    thumbClassName="test-thumb"
                    min={0}
                    step={1}
                />
            );

            const testInstance = testRenderer.root;
            const thumb = testInstance.findByProps({ className: 'test-thumb test-thumb-0 ' });

            const { addEventListener } = document;
            expect(addEventListener).not.toHaveBeenCalled();

            // simulate focus on thumb
            thumb.props.onFocus();

            expect(addEventListener).toHaveBeenCalledTimes(3);
            expect(addEventListener.mock.calls[0][0]).toBe('keydown');
            expect(addEventListener.mock.calls[1][0]).toBe('keyup');
            expect(addEventListener.mock.calls[2][0]).toBe('focusout');

            const onKeyDown = addEventListener.mock.calls[0][1];

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();

            // simulate keydown
            onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });

            expect(onBeforeChange).toHaveBeenCalledTimes(1);
            expect(onBeforeChange).toHaveBeenCalledWith(0, 0);
            expect(onBeforeChange.mock.invocationCallOrder[0]).toBeLessThan(
                onChange.mock.invocationCallOrder[0]
            );
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(1, 0);

            // simulate keydown
            onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });

            expect(onBeforeChange).toHaveBeenCalledTimes(1);
            expect(onBeforeChange).toHaveBeenCalledWith(0, 0);
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange).toHaveBeenCalledWith(2, 0);
        });

        it('calls onChange for every change', () => {
            const onChange = jest.fn();
            const testRenderer = renderer.create(
                <ReactSlider onChange={onChange} thumbClassName="test-thumb" min={0} step={1} />
            );

            const testInstance = testRenderer.root;
            const thumb = testInstance.findByProps({ className: 'test-thumb test-thumb-0 ' });

            const { addEventListener } = document;
            expect(addEventListener).not.toHaveBeenCalled();

            // simulate focus on thumb
            thumb.props.onFocus();

            expect(addEventListener).toHaveBeenCalledTimes(3);
            expect(addEventListener.mock.calls[0][0]).toBe('keydown');
            expect(addEventListener.mock.calls[1][0]).toBe('keyup');
            expect(addEventListener.mock.calls[2][0]).toBe('focusout');

            const onKeyDown = addEventListener.mock.calls[0][1];

            expect(onChange).not.toHaveBeenCalled();

            // simulate keydown
            onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(1, 0);

            // simulate keydown
            onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} });

            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange).toHaveBeenCalledWith(0, 0);
        });

        it('calls onAfterChange only once after onChange', () => {
            const onChange = jest.fn();
            const onAfterChange = jest.fn();
            const testRenderer = renderer.create(
                <ReactSlider
                    onChange={onChange}
                    onAfterChange={onAfterChange}
                    thumbClassName="test-thumb"
                    min={0}
                    step={1}
                />
            );

            const testInstance = testRenderer.root;
            const thumb = testInstance.findByProps({ className: 'test-thumb test-thumb-0 ' });

            const { addEventListener } = document;
            expect(addEventListener).not.toHaveBeenCalled();

            // simulate focus on thumb
            thumb.props.onFocus();

            expect(addEventListener).toHaveBeenCalledTimes(3);
            expect(addEventListener.mock.calls[0][0]).toBe('keydown');
            expect(addEventListener.mock.calls[1][0]).toBe('keyup');
            expect(addEventListener.mock.calls[2][0]).toBe('focusout');

            const onKeyDown = addEventListener.mock.calls[0][1];
            const onKeyUp = addEventListener.mock.calls[1][1];

            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(1, 0);
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });

            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange).toHaveBeenCalledWith(2, 0);
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keyup
            onKeyUp();

            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onAfterChange).toHaveBeenCalledTimes(1);
            expect(onAfterChange).toHaveBeenCalledWith(2, 0);
            expect(onAfterChange.mock.invocationCallOrder[0]).toBeGreaterThan(
                onChange.mock.invocationCallOrder[1]
            );
        });

        it('should handle left and right arrow keydown events when the slider is horizontal', async () => {
            const testRenderer = renderer.create(
                <ReactSlider min={0} max={10} step={1} thumbClassName="test-thumb" />
            );
            const testInstance = testRenderer.root;
            const thumb = testInstance.findByProps({ className: 'test-thumb test-thumb-0 ' });
            const { addEventListener } = document;

            // simulate focus on thumb
            thumb.props.onFocus();
            expect(addEventListener.mock.calls[0][0]).toBe('keydown');
            const onKeyDown = addEventListener.mock.calls[0][1];

            onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} });
            const valueTestOne = testRenderer.toJSON().children[2].props['aria-valuenow'];
            expect(valueTestOne).toBe(0);

            thumb.props.onFocus();
            onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });
            onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });

            const valueTestTwo = testRenderer.toJSON().children[2].props['aria-valuenow'];
            expect(valueTestTwo).toBe(2);
        });

        it('should handle left and right arrow keydown events when the slider is horizontal and inverted', async () => {
            const testRenderer = renderer.create(
                <ReactSlider invert min={0} max={10} step={1} thumbClassName="test-thumb" />
            );

            const testInstance = testRenderer.root;
            const thumb = testInstance.findByProps({ className: 'test-thumb test-thumb-0 ' });
            const { addEventListener } = document;

            // simulate focus on thumb
            thumb.props.onFocus();

            expect(addEventListener.mock.calls[0][0]).toBe('keydown');

            const onKeyDown = addEventListener.mock.calls[0][1];

            onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} });
            onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} });
            onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} });

            const valueTestOne = testRenderer.toJSON().children[2].props['aria-valuenow'];
            expect(valueTestOne).toBe(3);

            onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });
            onKeyDown({ key: 'ArrowRight', preventDefault: () => {} });

            const valueTestTwo = testRenderer.toJSON().children[2].props['aria-valuenow'];
            expect(valueTestTwo).toBe(1);
        });
    });

    it('should replace state value when props value changes', () => {
        const mockRenderThumb = jest.fn();
        const mockFirstValue = 40;
        const mockSecondValue = 80;
        const testRenderer = renderer.create(
            <ReactSlider
                thumbClassName="test-thumb"
                renderThumb={mockRenderThumb}
                value={mockFirstValue}
                min={0}
                step={1}
            />
        );
        expect(mockRenderThumb).toHaveBeenCalledTimes(1);
        expect(mockRenderThumb.mock.calls[0][1].value).toBe(mockFirstValue);

        renderer.act(() => {
            testRenderer.update(
                <ReactSlider
                    thumbClassName="test-thumb"
                    renderThumb={mockRenderThumb}
                    value={mockSecondValue}
                    min={0}
                    step={1}
                />
            );
        });

        expect(mockRenderThumb).toHaveBeenCalledTimes(2);
        expect(mockRenderThumb.mock.calls[1][1].value).toBe(mockSecondValue);
    });

    describe('marks prop', () => {
        describe('boolean value', () => {
            it('should not render marks if "false" is passed', () => {
                const mockRenderMark = jest.fn();
                renderer.create(
                    <ReactSlider
                        value={0}
                        min={0}
                        max={100}
                        marks={false}
                        renderMark={mockRenderMark}
                    />
                );

                expect(mockRenderMark).not.toHaveBeenCalled();
            });

            it('should render marks if "true" is passed', () => {
                const mockedMin = 0;
                const mockedMax = 10;
                const mockRenderMark = jest.fn();
                renderer.create(
                    <ReactSlider
                        value={0}
                        min={mockedMin}
                        max={mockedMax}
                        marks
                        renderMark={mockRenderMark}
                    />
                );

                expect(mockRenderMark).toHaveBeenCalledTimes(mockedMax + 1);
                mockRenderMark.mock.calls.forEach(([call], index) => {
                    expect(call.key).toBe(mockedMin + index);
                });
            });

            it('should render marks if "true" is passed and "min" is not 0', () => {
                const mockedMin = 10;
                const mockedMax = 20;
                const mockRenderMark = jest.fn();
                renderer.create(
                    <ReactSlider
                        value={0}
                        min={mockedMin}
                        max={mockedMax}
                        marks
                        renderMark={mockRenderMark}
                    />
                );

                expect(mockRenderMark).toHaveBeenCalledTimes(mockedMax - mockedMin + 1);
                mockRenderMark.mock.calls.forEach(([call], index) => {
                    expect(call.key).toBe(mockedMin + index);
                });
            });
        });

        describe('number value', () => {
            it('should render correct marks', () => {
                const mockedMin = 0;
                const mockedMax = 10;
                const mockedMarks = 2;
                const mockRenderMark = jest.fn();
                renderer.create(
                    <ReactSlider
                        value={0}
                        min={mockedMin}
                        max={mockedMax}
                        marks={mockedMarks}
                        renderMark={mockRenderMark}
                    />
                );

                expect(mockRenderMark).toHaveBeenCalledTimes(6);
                mockRenderMark.mock.calls.forEach(([call], index) => {
                    expect(call.key).toBe(mockedMin + mockedMarks * index);
                });
            });

            it('should render correct marks if "min" is not 0', () => {
                const mockedMin = 10;
                const mockedMax = 20;
                const mockedMarks = 2;
                const mockRenderMark = jest.fn();
                renderer.create(
                    <ReactSlider
                        value={0}
                        min={mockedMin}
                        max={mockedMax}
                        marks={mockedMarks}
                        renderMark={mockRenderMark}
                    />
                );

                expect(mockRenderMark).toHaveBeenCalledTimes(6);
                mockRenderMark.mock.calls.forEach(([call], index) => {
                    expect(call.key).toBe(mockedMin + mockedMarks * index);
                });
            });
        });

        describe('array of numbers is passed', () => {
            it('should render correct marks', () => {
                const mockedMin = 0;
                const mockedMax = 10;
                const mockedMarks = [1, 2, 3, 4, 5];
                const mockRenderMark = jest.fn();
                renderer.create(
                    <ReactSlider
                        value={0}
                        min={mockedMin}
                        max={mockedMax}
                        marks={mockedMarks}
                        renderMark={mockRenderMark}
                    />
                );

                expect(mockRenderMark).toHaveBeenCalledTimes(mockedMarks.length);
                mockRenderMark.mock.calls.forEach(([call], index) => {
                    expect(call.key).toBe(mockedMarks[index]);
                });
            });
        });
    });
});
