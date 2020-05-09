const path = require('path');
const { createStyleguideConfig } = require('create-react-styleguide');

module.exports = createStyleguideConfig({
    getComponentPathLine() {
        return `import ReactSlider from 'react-slider'`;
    },
    styleguideComponents: {
        Wrapper: path.join(__dirname, 'src/styleguidist/ThemeWrapper'),
    },
    title: 'react-slider',
    usageMode: 'expand',
}, {
    packageSection: false,
    componentsSection: false,
});
