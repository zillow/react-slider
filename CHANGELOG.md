# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.3](https://github.com/zillow/react-slider/compare/v1.0.2...v1.0.3) (2020-02-14)


### Bug Fixes

* change event handlers are now more reliable ([f1282d4](https://github.com/zillow/react-slider/commit/f1282d442d9d8ede3dca6c6ca91174b79461b61f)), closes [#161](https://github.com/zillow/react-slider/issues/161)
* no need to pause touch events as they do not cause text selection ([8e3e275](https://github.com/zillow/react-slider/commit/8e3e27526a8e48689fe72a88ed5f70e554bf375c)), closes [#162](https://github.com/zillow/react-slider/issues/162)



## [1.0.2](https://github.com/zillow/react-slider/compare/v1.0.1...v1.0.2) (2020-01-11)


### Bug Fixes

* clicking on the track of a vertical slider should move the correct handle ([114a56d](https://github.com/zillow/react-slider/commit/114a56d)), closes [#156](https://github.com/zillow/react-slider/issues/156)
* make sure borders are accounted for when calculating the slider size ([9e6f2f4](https://github.com/zillow/react-slider/commit/9e6f2f4)), closes [#152](https://github.com/zillow/react-slider/issues/152)



## [1.0.1](https://github.com/zillow/react-slider/compare/v1.0.0...v1.0.1) (2019-10-22)


### Bug Fixes

* mark componentWillReceiveProps as UNSAFE ([c6e8439](https://github.com/zillow/react-slider/commit/c6e8439)), closes [#149](https://github.com/zillow/react-slider/issues/149)



# [1.0.0](https://github.com/zillow/react-slider/compare/v0.11.2...v1.0.0) (2019-09-27)


### Bug Fixes

* `onAfterChange` was not being fired ([71746b2](https://github.com/zillow/react-slider/commit/71746b2)), closes [#3](https://github.com/zillow/react-slider/issues/3)
* add IE11 arrow key support ([20afb9e](https://github.com/zillow/react-slider/commit/20afb9e))
* aria keyboard support corrected so that left and down decreases and right and up increases ([1739606](https://github.com/zillow/react-slider/commit/1739606)), closes [#144](https://github.com/zillow/react-slider/issues/144)
* do nothing when right clicking on the slider ([9fa9eb4](https://github.com/zillow/react-slider/commit/9fa9eb4))
* Home and End keys no longer scroll the page when setting the value ([e8c8e1f](https://github.com/zillow/react-slider/commit/e8c8e1f))
* remove active state on thumb on blur ([f05c7b1](https://github.com/zillow/react-slider/commit/f05c7b1))
* the active thumb should get focus when a value is selected ([f1cc0cc](https://github.com/zillow/react-slider/commit/f1cc0cc))


### Code Refactoring

* remove support for custom thumbs via `children` ([3cb3413](https://github.com/zillow/react-slider/commit/3cb3413))


### Features

* "handle" and "bar" are now "thumb" and "track" to follow `input[type=range]` nomenclature ([e4e8ff8](https://github.com/zillow/react-slider/commit/e4e8ff8))
* `ariaValuetext` now supports a function for dynamic value text ([021a547](https://github.com/zillow/react-slider/commit/021a547))
* `renderThumb` now renders the entire thumb node rather than just the thumb content ([669dcdb](https://github.com/zillow/react-slider/commit/669dcdb))
* `withTracks` is now true by default ([a450420](https://github.com/zillow/react-slider/commit/a450420))
* add `renderBar` render prop for customizing bar content ([0de9013](https://github.com/zillow/react-slider/commit/0de9013))
* add `renderHandle` render prop for dynamic handle content ([c87ed4b](https://github.com/zillow/react-slider/commit/c87ed4b))
* add `valueNow` to state objects of `ariaValuetext` and `renderThumb` for easier access to the current value ([94712f2](https://github.com/zillow/react-slider/commit/94712f2))
* add aria-orientation to slider ([5125a98](https://github.com/zillow/react-slider/commit/5125a98))
* add support for Page Up and Page Down keys ([ed67408](https://github.com/zillow/react-slider/commit/ed67408))
* pass `value` state to render props ([8b0615d](https://github.com/zillow/react-slider/commit/8b0615d))
* remove dependency on create-react-class ([648512e](https://github.com/zillow/react-slider/commit/648512e))
* the paging value is now configurable via the `pageFn` prop ([de75419](https://github.com/zillow/react-slider/commit/de75419))


### BREAKING CHANGES

* The render props `renderThumb` and `renderTrack` are now passed two arguments
instead of one, `props` and `state`. This makes it easier to just spread props when using
a render function.
* `renderThumb` was previously given the indexed handle value
which now needs to be derived from `value` and `index.
* custom thumbs via `children` is no longer supported.
To customize thumbs, use the `renderThumb` render prop instead.
* `withTracks` is more commonly true than false,
so we are making that the default
* "handle" and "bar" props have been renamed to "thumb" and "track",
e.g. `withBars` is now `withTracks`, and `handleClassName` is now `thumbClassName`
