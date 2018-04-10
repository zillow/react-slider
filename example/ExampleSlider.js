import * as React from 'react';
import Slider from '../react-slider';

export default class ExampleSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: props.defaultValue};
    }

    onChange(newValue) {
        this.setState({value: newValue});
    }

    generateHandles() {
        if (this.state.value.map) {
            return this.state.value.map((value, i) => <div key={i}>{value}</div>);
        } else {
            return <div>{this.state.value}</div>;
        }
    }

    render() {
        let containerClassNames = 'slider-container';
        if (this.props.containerClassName) {
            containerClassNames += ` ${this.props.containerClassName}`;
        }

        return (
            <div className={containerClassNames}>
                <Slider className={`${this.props.orientation}-slider`}
                        pearling={true}
                        minDistance={10}
                        value={this.state.value}
                        onChange={this.onChange.bind(this)}
                        {...this.props}>
                    {this.generateHandles()}
                </Slider>
            </div>
        )
    }
}