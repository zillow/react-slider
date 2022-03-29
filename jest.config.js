// eslint-disable-next-line zillow/import/no-extraneous-dependencies
const { jestConfig } = require('create-react-styleguide');

if (process.env.DEBUG) {
    // eslint-disable-next-line no-console
    console.log('jestConfig object:', JSON.stringify(jestConfig, null, 4));
}

module.exports = {
    ...jestConfig,
};
