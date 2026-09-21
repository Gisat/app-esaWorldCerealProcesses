## [0.9.0](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.8.0...v0.9.0) (2026-09-21)

### Features

* added carto api key ([c365af0](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/c365af0f0a7ff27d9913b9f69ad79d8727daa625))

### Bug Fixes

* drop unused CARTO_API_KEY from ssr environments ([687dd12](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/687dd123b7d6302e8a81c5be0f0a3f18d1ebcd51))
* render Carto map routes at request time ([2e2fcc5](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/2e2fcc5d5916fa7740b029631d298a209ebfe041))
* use Voyager raster tiles for cartoVoyager layer ([3e51070](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/3e510706d5948bf59f981d2b6cc709fc7680822f))

## [0.8.0](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.7.1...v0.8.0) (2026-09-01)

### Features

* persist instance warning dismissal in session storage ([8dd79fd](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/8dd79fd307951a7bbdd745d5d6d82ba944441362))
* point processing hub UDPs to processinghub-udps tag ([b7e04d9](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/b7e04d949de589eb544da5d1a404e742f1915878)), closes [#252](https://github.com/Gisat/app-esaWorldCerealProcesses/issues/252)

### Bug Fixes

* **ci:** pin conventional-changelog-conventionalcommits to v9 ([d834e2f](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/d834e2fbf93412b903966505be03676ed8a0c751)), closes [semantic-release/release-notes-generator#992](https://github.com/semantic-release/release-notes-generator/issues/992)

## [0.7.1](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.7.0...v0.7.1) (2026-07-22)

## [0.7.0](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.6.1...v0.7.0) (2026-07-22)

## [0.6.1](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.6.0...v0.6.1) (2026-07-09)

## [0.6.0](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.5.0...v0.6.0) (2026-07-09)

## [0.5.0](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.4.7...v0.5.0) (2026-07-01)

## [0.4.7](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.4.6...v0.4.7) (2026-06-17)

### Bug Fixes

* unify seasonWindows date handling for cropland and crop type products ([43cfdb9](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/43cfdb9f75e5f8441efd1c0a78af136b70d2cfdf))

## [0.4.6](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.4.5...v0.4.6) (2026-06-15)

### Bug Fixes

* set majority_vote as default postprocess method and improve kernel size validation ([ff20275](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/ff202752c41ae0edbd78ca9adcacd1ccf0cfb6d9))

## [0.4.5](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.4.4...v0.4.5) (2026-06-15)

### Bug Fixes

* bump sqlite3 to ^6.0.1 to satisfy @gisatcz/ptr-be-core peer dependency ([f3ffe0c](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/f3ffe0ce43a20d59da0c6e46fb8e36b23e3e83b9))

## [0.4.4](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.4.3...v0.4.4) (2026-06-12)

### Bug Fixes

* harden session cookie handling ([1668ab0](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/1668ab08d3003a9fdcd4c96075cb076ae2978a44))

## [0.4.3](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.4.2...v0.4.3) (2026-06-12)

### Bug Fixes

* add ignore-error to Docker GHA cache export ([37bd58a](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/37bd58a4e34c810933a0344c6a600d4519ed6d1e))

## [0.4.2](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.4.1...v0.4.2) (2026-06-12)

### Bug Fixes

* update UDP namespace URLs and misc config fixes ([43da16c](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/43da16cfe2504fa5b19562745725132ab96cb680))

## [0.4.1](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.4.0...v0.4.1) (2026-05-06)

### Bug Fixes

* switch release Docker push from Docker Hub to GHCR ([eacccbe](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/eacccbef409f88a34c39523f3abc2f4223554c42))

## [0.4.0](https://github.com/Gisat/app-esaWorldCerealProcesses/compare/v0.3.0...v0.4.0) (2026-05-06)

### Features

* updated dependencies & resolved duplicate code imports ([57a0db4](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/57a0db4798fa7e506e87b88849b381863fcfb9c2))
* upgrade CI workflows to multi-stage Docker build and semantic-release ([ada1d9a](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/ada1d9a73cfce29a1ae44c00e80df73f53d93463))

### Bug Fixes

* replace next lint with eslint for Next.js 16 compatibility, ignore .next in eslint ([1a35ca2](https://github.com/Gisat/app-esaWorldCerealProcesses/commit/1a35ca2eebedfbdea5b53b736f65c08c9280cb49))
