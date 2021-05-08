/*
 * Copyright (c) 2021, Justin Couch
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { DirectivesLoader, ADType, AircraftDirectiveData } from '../src/index';

describe('Module export tests', () => {
    it('exports all files correctly', () => {
        expect(AircraftDirectiveData).toBeTruthy();
        expect(ADType).toBeTruthy();
        expect(DirectivesLoader).toBeTruthy();
    });
});
