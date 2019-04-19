const path = require('path');
const { createStyleguideConfig } = require('create-react-styleguide');

module.exports = createStyleguideConfig({
    getComponentPathLine() {
        return `import ReactSlider from '@zillowgroup/react-slider'`;
    },
    styleguideComponents: {
        Wrapper: path.join(__dirname, 'src/styleguidist/ThemeWrapper'),
    },
    title: '@zillowgroup/react-slider',
}, {
    packageSection: false,
    componentsSection: false,
});
