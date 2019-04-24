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

    .horizontal-slider .example-track {
        top: 20px;
        height: 10px;
    }

    .horizontal-slider .example-thumb {
        top: 1px;
        width: 50px;
        height: 48px;
        line-height: 48px;
    }

    .vertical-slider .example-thumb {
        left: 1px;
        width: 48px;
        line-height: 50px;
        height: 50px;
    }

    .vertical-slider .example-track {
        left: 20px;
        width: 10px;
    }
`;

export default props => (
    <React.Fragment>
        <GlobalStyle />
        <div {...props} />
    </React.Fragment>
);
