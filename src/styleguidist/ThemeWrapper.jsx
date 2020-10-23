import React from 'react';
// eslint-disable-next-line zillow/import/no-extraneous-dependencies
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    .horizontal-slider {
        width: 100%;
        max-width: 500px;
        height: 50px;
        border: 1px solid grey;
    }

    .vertical-slider {
        height: 380px;
        width: 50px;
        border: 1px solid grey;
    }

    .example-thumb {
        font-size: 0.9em;
        text-align: center;
        background-color: black;
        color: white;
        cursor: pointer;
        border: 5px solid gray;
        box-sizing: border-box;
    }

    .example-thumb.active {
        background-color: grey;
    }

    .example-track {
        position: relative;
        background: #ddd;
    }

    .example-track.example-track-1 {
        background: #f00;
    }

    .example-track.example-track-2 {
        background: #0f0;
    }

    .example-dot {
        position: absolute;
        width: 8px;
        height: 8px;
        border: 2px solid #000;
        background-color: #fff;
        cursor: pointer;
        border-radius: 50%;
        vertical-align: middle;
    }

    .horizontal-slider .example-track {
        top: 20px;
        height: 10px;
    }

    .horizontal-slider .example-thumb {
        top: 1px;
        width: 50px;
        height: 48px;
        line-height: 38px;
    }

    .horizontal-slider .example-dot {
        margin: 0 calc(25px - 6px);
        bottom: calc(50% - 6px);
    }

    .vertical-slider .example-thumb {
        left: 1px;
        width: 48px;
        line-height: 40px;
        height: 50px;
    }

    .vertical-slider .example-track {
        left: 20px;
        width: 10px;
    }

    .vertical-slider .example-dot {
        margin: calc(25px - 6px) 0;
        left: calc(50% - 6px);
    }
`;

export default props => (
    <React.Fragment>
        <GlobalStyle />
        <div {...props} />
    </React.Fragment>
);
