import React from 'react';
// eslint-disable-next-line zillow/import/no-extraneous-dependencies
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from '../themes';

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

    .example-handle {
        font-size: 0.9em;
        text-align: center;
        background-color: black;
        color: white;
        cursor: pointer;
    }

    .example-handle.active {
        background-color: grey;
    }

    .example-bar {
        position: relative;
        background: #ddd;
    }

    .example-bar.example-bar-1 {
        background: #f00;
    }

    .example-bar.example-bar-2 {
        background: #0f0;
    }

    .horizontal-slider .example-bar {
        top: 20px;
        height: 10px;
    }

    .horizontal-slider .example-handle {
        top: 1px;
        width: 50px;
        height: 48px;
        line-height: 48px;
    }

    .vertical-slider .example-handle {
        left: 1px;
        width: 48px;
        line-height: 50px;
        height: 50px;
    }

    .vertical-slider .example-bar {
        left: 20px;
        width: 10px;
    }
`;

export default props => (
    <React.Fragment>
        <GlobalStyle />
        <ThemeProvider {...props} theme={theme} />
    </React.Fragment>
);
