// Based on the default configuration from conventional-changelog:
// https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-conventionalcommits/writer-opts.js#L160
module.exports = {
    types: [
        { type: 'feat', section: 'Features' },
        { type: 'feature', section: 'Features' },
        { type: 'fix', section: 'Bug Fixes' },
        { type: 'perf', section: 'Performance Improvements' },
        { type: 'revert', section: 'Reverts' },
        { type: 'docs', section: 'Documentation' },
        { type: 'style', section: 'Styles' },
        { type: 'chore', section: 'Miscellaneous Chores', hidden: true },
        { type: 'refactor', section: 'Code Refactoring' },
        { type: 'test', section: 'Tests' },
        { type: 'build', section: 'Build System' },
        { type: 'ci', section: 'Continuous Integration' },
    ],
};
