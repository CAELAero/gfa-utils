/*
 * Copyright (c) 2020, Justin Couch
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ADType } from '../../src/airworthiness/directive-type';
import { DirectivesLoader } from '../../src/airworthiness/directives-loader';

describe('Erroneous input handling', () => {
    it('generates an error if no file given', () => {
        expect(() => { DirectivesLoader.listAllDirectives(null); }).toThrow();
    });

    it('generates an error if file does not exist', () => {
        expect(() => { DirectivesLoader.listAllDirectives("randompath.xls"); }).toThrowError();
    });

    it('generates an error if file is not an excel sheet', () => {
        expect(() => { DirectivesLoader.listAllDirectives("tests/airworthiness/data/dummy_text_data.txt"); }).toThrowError();
    });
});

describe('Parsing literal data', () => {
    it('handles a single line input with all data specified', () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_single_row_all_provided.xlsx");

        expect(result).toBeDefined();
        expect(result.length).toBe(1);

        let entry = result[0];
        expect(entry.documentReference).toBe("GFA AD 0017");
        expect(entry.issueNumber).toBe(2);
        expect(entry.active).toBe(true);
        expect(entry.issueDate).toBe("1998-09-17");
        expect(entry.typeCertificate).toBe("Standard Cirrus");
        expect(entry.type).toBe(ADType.GLIDER);
        expect(entry.description).toBe("Inspection of the Control Column Mounting Bulkheads");
    });
    it('handles a single line input with the issue number missing', () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_single_row_missing_issue.xlsx");

        expect(result).toBeDefined();
        expect(result.length).toBe(1);

        let entry = result[0];
        expect(entry.documentReference).toBe("GFA AD 0017");
        expect(entry.issueNumber).toBeUndefined();
        expect(entry.active).toBe(true);
        expect(entry.issueDate).toBe("1998-09-17");
        expect(entry.typeCertificate).toBe("Standard Cirrus");
        expect(entry.type).toBe(ADType.GLIDER);
        expect(entry.description).toBe("Inspection of the Control Column Mounting Bulkheads");
    });
    it('handles a single line input with the type certificate missing', () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_single_row_missing_cert.xlsx");

        expect(result).toBeDefined();
        expect(result.length).toBe(1);

        let entry = result[0];
        expect(entry.documentReference).toBe("GFA AD 0017");
        expect(entry.issueNumber).toBe(2);
        expect(entry.active).toBe(true);
        expect(entry.issueDate).toBe("1998-09-17");
        expect(entry.typeCertificate).toBeUndefined();
        expect(entry.type).toBe(ADType.GLIDER);
        expect(entry.description).toBe("Inspection of the Control Column Mounting Bulkheads");
    });
    it('handles a single line input with the issue date missing', () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_single_row_missing_date.xlsx");

        expect(result).toBeDefined();
        expect(result.length).toBe(1);

        let entry = result[0];
        expect(entry.documentReference).toBe("GFA AD 0017");
        expect(entry.issueNumber).toBe(2);
        expect(entry.active).toBe(true);
        expect(entry.issueDate).toBeNull();
        expect(entry.typeCertificate).toBe("Standard Cirrus");
        expect(entry.type).toBe(ADType.GLIDER);
        expect(entry.description).toBe("Inspection of the Control Column Mounting Bulkheads");
    });
    it('handles a single line input with the AD Type missing', () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_single_row_missing_ad_type.xlsx");

        expect(result).toBeDefined();
        expect(result.length).toBe(1);

        let entry = result[0];
        expect(entry.documentReference).toBe("GFA AD 0017");
        expect(entry.issueNumber).toBe(2);
        expect(entry.active).toBe(true);
        expect(entry.issueDate).toBe("1998-09-17");
        expect(entry.typeCertificate).toBe("Standard Cirrus");
        expect(entry.type).toBeUndefined();
        expect(entry.description).toBe("Inspection of the Control Column Mounting Bulkheads");
    });
});
