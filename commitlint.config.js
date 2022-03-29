module.exports = {
    extends: ['@commitlint/config-conventional'],

    rules: {
        'body-case': [0],
        'subject-case': [0],
        'header-max-length': [0],
        'type-enum': [
            2,
            'always',
            [
                // Conventional Commit types
                'feat',
                'feature',
                'fix',
                'perf',
                'revert',
                'docs',
                'style',
                'chore',
                'refactor',
                'test',
                'build',
                'ci',
                // react-slider specific types
                'a11y',
                'deprecate',
            ],
        ],
    },
};
