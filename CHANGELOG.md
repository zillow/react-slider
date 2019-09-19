# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.1](https://github.com/zillow/react-slider/compare/v2.0.0...v2.0.1) (2019-09-19)


### Bug Fixes

* `onAfterChange` was not being fired ([957e72c](https://github.com/zillow/react-slider/commit/957e72c)), closes [#3](https://github.com/zillow/react-slider/issues/3)



# [2.0.0](https://github.com/zillow/react-slider/compare/v1.3.0...v2.0.0) (2019-04-26)


### Bug Fixes

* add IE11 arrow key support ([39f6ae1](https://github.com/zillow/react-slider/commit/39f6ae1))
* do nothing when right clicking on the slider ([c7fd64f](https://github.com/zillow/react-slider/commit/c7fd64f))
* Home and End keys no longer scroll the page when setting the value ([fff37d5](https://github.com/zillow/react-slider/commit/fff37d5))
* remove active state on thumb on blur ([64d928a](https://github.com/zillow/react-slider/commit/64d928a))
* the active thumb should get focus when a value is selected ([b5d2115](https://github.com/zillow/react-slider/commit/b5d2115))


### Code Refactoring

* remove support for custom thumbs via `children` ([05bf77c](https://github.com/zillow/react-slider/commit/05bf77c))


### Features

* "handle" and "bar" are now "thumb" and "track" to follow `input[type=range]` nomenclature ([b7d18ea](https://github.com/zillow/react-slider/commit/b7d18ea))
* `ariaValuetext` now supports a function for dynamic value text ([706b275](https://github.com/zillow/react-slider/commit/706b275))
* `renderThumb` now renders the entire thumb node rather than just the thumb content ([04f3285](https://github.com/zillow/react-slider/commit/04f3285))
* `withTracks` is now true by default ([02a4bf3](https://github.com/zillow/react-slider/commit/02a4bf3))
* add `valueNow` to state objects of `ariaValuetext` and `renderThumb` for easier access to the current value ([08aa273](https://github.com/zillow/react-slider/commit/08aa273))
* add aria-orientation to slider ([714da9f](https://github.com/zillow/react-slider/commit/714da9f))
* add support for Page Up and Page Down keys ([7b9f536](https://github.com/zillow/react-slider/commit/7b9f536))
* pass `value` state to render props ([d42545e](https://github.com/zillow/react-slider/commit/d42545e))
* the paging value is now configurable via the `pageFn` prop ([a54021e](https://github.com/zillow/react-slider/commit/a54021e))


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



# [1.3.0](https://github.com/zillow/react-slider/compare/v1.2.0...v1.3.0) (2019-04-24)


### Features

* add `renderHandle` render prop for dynamic handle content ([3cea501](https://github.com/zillow/react-slider/commit/3cea501))



# [1.2.0](https://github.com/zillow/react-slider/compare/v1.1.0...v1.2.0) (2019-04-24)


### Features

* add `renderBar` render prop for customizing bar content ([2969f5e](https://github.com/zillow/react-slider/commit/2969f5e))



# [1.1.0](https://github.com/zillow/react-slider/compare/v0.11.2...v1.1.0) (2019-04-22)


### Features

* remove dependency on create-react-class ([ae214a2](https://github.com/zillow/react-slider/commit/ae214a2))
