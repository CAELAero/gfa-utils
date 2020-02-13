![npm type definitions](https://img.shields.io/npm/types/@cael-aero/gfa-utils)
![node](https://img.shields.io/node/v/@cael-aero/gfa-utils)
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

let data:AircraftDirectiveData[] = DirectivesLoader.loadAllDirectives('somefile.xls');
```

## API Examples

### Load Data Specific to a Certification Type

The second argument provides the option for an exact match of the type certificate.
Variations are not returned. Eg looking for a DG 300 will not return anything that
is registered for a DG303 Elan. This will load all matching type certificates, whether
currently active or not.
 
```typescript
let data:AircraftDirectiveData[] = DirectivesLoader.loadAllDirectives('somefile.xls', "Standard Cirrus");
```

### Load Only the Current ADs

If you are only interested in the currently active ADs for, then the third option can
be used to request only providing the current list. 

```typescript
let data:AircraftDirectiveData[] = DirectivesLoader.loadAllDirectives('somefile.xls', "Standard Cirrus", true);
```

You can request all currently active ADs regardless of Type Certificate, by leaving the
second argument as null  

```typescript
let data:AircraftDirectiveData[] = DirectivesLoader.loadAllDirectives('somefile.xls', null, true);
```

Using an empty string will also have the same effect.

## License
This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree. 
