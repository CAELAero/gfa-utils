/*
 * Copyright (c) 2020, Justin Couch
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AircraftDirectiveData } from './aircraft-directive-data';

/**
 * Loads directives from a given source data. It is assumed to be an excel spreadsheet that
 * matches the GFA format found online.
 *
 * http://doc.glidingaustralia.org/index.php?option=com_docman&view=download&alias=2136-gfa-ad-an-awa-register
 */
export class DirectivesLoader {
    public listAllDirectives(source: string): AircraftDirectiveData[] {
        return [];
    }
}
