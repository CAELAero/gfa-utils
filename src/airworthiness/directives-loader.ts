/*
 * Copyright (c) 2020, Justin Couch
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ParsingOptions, readFile, WorkBook, utils, SSF } from 'xlsx';
import { AircraftDirectiveData } from './aircraft-directive-data';

/**
 * Loads directives from a given source data. It is assumed to be an excel spreadsheet that
 * matches the GFA format found online.
 *
 * http://doc.glidingaustralia.org/index.php?option=com_docman&view=download&alias=2136-gfa-ad-an-awa-register
 */
export class DirectivesLoader {

    /**
     * Parse the provided input file and return the list of valid entries that are found
     * in it, that match the provided query parameters
     *
     * @param {string} source The absolute path to the source file that will be loaded
     * @param {string} matchTypeCertName [null] Optional cert name
     */
    public static listAllDirectives(source: string, matchTypeCertName?: string, ignoreInactive?: boolean): AircraftDirectiveData[] {
        if(!source) {
            throw new Error("No source given to parse");
        }

        // First sheet is the Help Sheet, 2nd is the real data, 3rd is Websites to find stuff at
        // Use excel dates to ensure that we don't have TZ issues in conversions later.
        const options = {
            cellDates: false
        };

        const workbook: WorkBook = readFile(source, options);
        const loaded_data = workbook.Sheets[workbook.SheetNames[1]];

        // Could we find the right sheet? undefined or null here if not. Throw error
        if(!loaded_data) {
            throw new Error("Unable to locate the required sheet in " + source);
        }

        const sheet_data: any[][] = utils.sheet_to_json(loaded_data, {
            header: 1,
            blankrows: false,
            range: 1
        });

        const retval: AircraftDirectiveData[] = [];

        const name_to_match = (matchTypeCertName && matchTypeCertName.trim().length > 1) ? matchTypeCertName.trim() : null;

        // Need to skip the first 6 rows manually.
        for(let i = 5; i < sheet_data.length; i++) {
            const row = sheet_data[i];

            // Ignore rows that don't have the right number of
            // columns as they are comment rows. 7 columns in regular data, but if the
            // active field value is missing, then the reader will only tell us there are 6
            if(row.length < 6) {
                continue;
            }

            // Column data is:
            // [0]: AD/AN Document AD/AN Ref
            // [1]: AD/AN Document Issue Nbr
            // [2]: AD/AN Document Date Issued
            // [3]: Type Certificate name
            // [4]: AD Type
            // [5]: AD Subject
            // [6]: AD/AN Document Status

            if(name_to_match && name_to_match !== row[3]) {
                continue;
            }

            const isActive: boolean = (row[6] == null) || ("active" === row[6].toLowerCase());

            if(ignoreInactive && !isActive) {
                continue;
            }

            const base_date = row[2];
            let date_str = null;

            if(base_date) {
                const date_data = SSF.parse_date_code(base_date);
                // should be a Date object, now convert this to an ISO date string. Date object is in UTC
                // when printing a string, but excel date is in "local timezone". Since we know the spreadsheet
                // is generally produced in Sydney or Melbourne, we always force a local timezone of
                // australia/sydney to fetch the matching date.
                date_str = date_data.y + '-' +
                           date_data.m.toString().padStart(2, "0") + '-' +
                           date_data.d.toString().padStart(2, "0");
            }

            retval.push(AircraftDirectiveData.create(row[0], row[1], isActive, date_str, row[3], row[4], row[5]));
        }

        return retval;
    }
}
