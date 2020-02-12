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

    it('Missing active entry is considered active', () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_single_row_missing_active.xlsx");

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

    it("Skips rows that don't have proper data", () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_multi_row_with_trailer.xlsx");

        expect(result).toBeDefined();
        expect(result.length).toBe(4);

        let entry = result[0];
        expect(entry.documentReference).toBe("CASA AD/GEN/87");
        expect(entry.issueNumber).toBeUndefined();
        expect(entry.active).toBe(false);
        expect(entry.issueDate).toBe("2016-01-13");
        expect(entry.typeCertificate).toBe("General AD-AWAs");
        expect(entry.type).toBe(ADType.GENERAL);
        expect(entry.description).toBeDefined();

        entry = result[1];
        expect(entry.documentReference).toBe("CASA AD/GEN/87");
        expect(entry.issueNumber).toBe(1);
        expect(entry.active).toBe(true);
        expect(entry.issueDate).toBe("2017-09-29");
        expect(entry.typeCertificate).toBe("General AD-AWAs");
        expect(entry.type).toBe(ADType.GENERAL);
        expect(entry.description).toBeDefined();

        entry = result[2];
        expect(entry.documentReference).toBe("GFA AD 0017");
        expect(entry.issueNumber).toBe(2);
        expect(entry.active).toBe(true);
        expect(entry.issueDate).toBe("1998-09-17");
        expect(entry.typeCertificate).toBe("Standard Cirrus");
        expect(entry.type).toBe(ADType.GLIDER);
        expect(entry.description).toBeDefined();

        entry = result[3];
        expect(entry.documentReference).toBe("GFA AD 0017");
        expect(entry.issueNumber).toBe(2);
        expect(entry.active).toBe(true);
        expect(entry.issueDate).toBe("1998-09-17");
        expect(entry.typeCertificate).toBe("Standard Cirrus B");
        expect(entry.type).toBe(ADType.GLIDER);
        expect(entry.description).toBeDefined();
    });

    it("Skips rows that don't have proper data", () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_multi_row_ignore_inactive.xlsx", null, true);

        expect(result).toBeDefined();
        expect(result.length).toBe(2);

        // Only check the relevant data to make sure we got the right row
        let entry = result[0];
        expect(entry.documentReference).toBe("CASA AD/GEN/87");
        expect(entry.issueNumber).toBe(1);
        expect(entry.active).toBe(true);
        expect(entry.issueDate).toBe("2017-09-29");

        entry = result[1];
        expect(entry.documentReference).toBe("GFA AD 0017");
        expect(entry.issueNumber).toBe(2);
        expect(entry.active).toBe(true);
        expect(entry.typeCertificate).toBe("Standard Cirrus");
    });

    it("Matches only the requested type cert", () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_multi_row_type_cert_match.xlsx", "General AD-AWAs");

        expect(result).toBeDefined();
        expect(result.length).toBe(2);

        // Only check the relevant data to make sure we got the right row
        let entry = result[0];
        expect(entry.documentReference).toBe("CASA AD/GEN/87");
        expect(entry.issueNumber).toBeUndefined();
        expect(entry.active).toBe(false);

        entry = result[1];
        expect(entry.documentReference).toBe("CASA AD/GEN/87");
        expect(entry.issueNumber).toBe(1);
        expect(entry.active).toBe(true);
    });
});

describe('Edge case hanlding', () => {
    it("Type cert matches ignore zero length string", () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_multi_row_type_cert_match.xlsx", "");

        expect(result).toBeDefined();
        expect(result.length).toBe(4);

        // Skip the detail checks
    });

    it("Type cert matches ignore empty string with spaces", () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_multi_row_type_cert_match.xlsx", "   ");

        expect(result).toBeDefined();
        expect(result.length).toBe(4);

        // Skip the detail checks
    });

    it("Type cert matches ignore empty string with tabs", () => {
        let result = DirectivesLoader.listAllDirectives("tests/airworthiness/data/gfa_multi_row_type_cert_match.xlsx", "    ");

        expect(result).toBeDefined();
        expect(result.length).toBe(4);

        // Skip the detail checks
    });
});
