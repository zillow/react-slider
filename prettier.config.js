// eslint-disable-next-line zillow/import/no-extraneous-dependencies
const { prettierConfig } = require('create-react-styleguide');

if (process.env.DEBUG) {
    // eslint-disable-next-line no-console
    console.log('prettierConfig object:', JSON.stringify(prettierConfig, null, 4));
}

module.exports = {
    ...prettierConfig,
};
