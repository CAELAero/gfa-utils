[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
![GitHub package.json version](https://img.shields.io/github/package-json/v/CAELAero/gfa-utils)
[![Build Status](https://travis-ci.com/CAELAero/gfa-utils.svg?branch=master)](https://travis-ci.com/CAELAero/gfa-utils)
[![Coverage Status](https://coveralls.io/repos/github/CAELAero/gfa-utils/badge.svg)](https://coveralls.io/github/CAELAero/gfa-utils)
# CAEL Aero GFA Utils

Utilities for interacting with Gliding Federation of Australia files and systems. 

## Installation

```sh
npm install @cael-aero/gfa-utils --save
yarn add @cael-aero/gfa-utils
bower install @cael-aero/gfa-utils --save
```                                      

## Usage
### Javascript
```javascript
var gfaUtils = require('@cael-aero/gfa-utils');
var data = gfaUtils.loadAllDirectives('somefile.xls');
```

### TypeScript
```typescript
import { DirectivesLoader } from '@cael-aero/gfa-utils';

let data = DirectivesLoader.loadAllDirectives('somefile.xls');
```

## License
This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree. 

