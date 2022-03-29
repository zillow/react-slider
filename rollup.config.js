// eslint-disable-next-line zillow/import/no-extraneous-dependencies
const { rollupConfig } = require('create-react-styleguide');

if (process.env.DEBUG) {
    // eslint-disable-next-line no-console
    console.log('rollupConfig object:', JSON.stringify(rollupConfig, null, 4));
}

module.exports = {
    ...rollupConfig,
};
