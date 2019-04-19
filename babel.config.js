module.exports = {
    presets: [['zillow', { modules: false }]],
    env: {
        cjs: {
            presets: ['zillow'],
        },
        test: {
            presets: ['zillow'],
        },
    },
};
