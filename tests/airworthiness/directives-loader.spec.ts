/*
 * Copyright (c) 2020, Justin Couch
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { DirectivesLoader } from '../../src/airworthiness/directives-loader';

test('Basic Construction', () => {
  expect(new DirectivesLoader()).toBeTruthy();
});
