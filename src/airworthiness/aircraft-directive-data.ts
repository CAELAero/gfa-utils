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
  documentReference: string = 'unknown';
  issueNumber: number = 0;
  active: boolean = false;

  /** ISO format string for the date */
  issueDate?: string;

  /** Type certificate this AD entry effects */
  typeCertificate?: string;
  type?: ADType;
  description?: string;

  public static create(
    ref: string,
    issue: number,
    active: boolean,
    date?: string,
    typeCert?: string,
    type?: ADType,
    description?: string,
  ) {
    if (issue <= 0) {
      throw new Error('Issue number must be greater than 0');
    }

    const retval = new AircraftDirectiveData();
    retval.documentReference = ref;
    retval.issueNumber = issue;
    retval.active = active;
    retval.issueDate = date;
    retval.typeCertificate = typeCert;
    retval.type = type;
    retval.description = description;

    return retval;
  }
}
