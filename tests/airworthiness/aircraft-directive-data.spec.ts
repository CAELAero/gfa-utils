/*
 * Copyright (c) 2020, Justin Couch
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AircraftDirectiveData } from '../../src/airworthiness/aircraft-directive-data';
import { ADType } from '../../src/airworthiness/directive-type';

describe('Construction tests', () => {
    it('Basic Construction', () => {
      expect(new AircraftDirectiveData()).toBeTruthy();
    });

    it('Static constructor with everything', () => {
        const expectedRef = "MyGFA-AD-10";
        const expectedIssue = 4;
        const expectedActive = false;
        const expectedCert = "DG1000S";
        const expectedType = ADType.ENGINE;
        const expectedDescription = "Something happened";

        let result = AircraftDirectiveData.create(expectedRef, expectedIssue, expectedActive,
                                                  expectedCert, expectedType, expectedDescription);

        expect(result).not.toBeNull();
        expect(result.documentReference).toBe(expectedRef);
        expect(result.issueNumber).toBe(expectedIssue);
        expect(result.active).toBe(expectedActive);
        expect(result.typeCertificate).toBe(expectedCert);
        expect(result.type).toBe(expectedType);
        expect(result.description).toBe(expectedDescription);
    });

    it('Static constructor with minimal inputs', () => {
        const expectedRef = "MyGFA-AD-040";
        const expectedIssue = 2;
        const expectedActive = true;

        let result = AircraftDirectiveData.create(expectedRef, expectedIssue, expectedActive);

        expect(result).not.toBeNull();
        expect(result.documentReference).toBe(expectedRef);
        expect(result.issueNumber).toBe(expectedIssue);
        expect(result.active).toBe(expectedActive);
        expect(result.typeCertificate).toBeUndefined();
        expect(result.type).toBeUndefined();
        expect(result.description).toBeUndefined();
    });
});

describe('Error condition handling', () => {
    it('Rejects negative issue numbers', () => {
        expect(() => { AircraftDirectiveData.create("something", -1, true) }).toThrow(Error);
    });
});
