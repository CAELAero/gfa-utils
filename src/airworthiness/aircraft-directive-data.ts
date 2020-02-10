/*
 * Copyright (c) 2020, Justin Couch
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ADType } from './directive-type';

export class AircraftDirectiveData {
    /** Internal or external reference from GFA, EASA or other NAA, or Manufacturer */
    documentReference: string = "unknown";
    issueNumber: number = 0;
    active: boolean = false;

    typeCertificate?: string;
    type?: ADType;
    description?: string;

    public static create(ref: string, issue: number, active: boolean, typeCert?: string, type?: ADType, description?: string) {
        if(issue <= 0) {
            throw new Error("Issue number must be greater than 0");
        }

        let retval = new AircraftDirectiveData();
        retval.documentReference = ref;
        retval.issueNumber  = issue;
        retval.active = active;
        retval.typeCertificate = typeCert;
        retval.type = type;
        retval.description = description;

        return retval;
    }
}
