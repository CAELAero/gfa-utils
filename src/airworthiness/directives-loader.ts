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
    public static listAllDirectives(source: string): AircraftDirectiveData[] {
        if(!source) {
            throw new Error("No source given to parse");
        }

        // First sheet is the Help Sheet, 2nd is the real data, 3rd is Websites to find stuff at
        // Use excel dates to ensure that we don't have TZ issues in conversions later.
        let options = {
            cellDates: false
        };

        let workbook: WorkBook = readFile(source, options);
        let loaded_data = workbook.Sheets[workbook.SheetNames[1]];

        // Could we find the right sheet? undefined or null here if not. Throw error
        if(!loaded_data) {
            throw new Error("Unable to locate the required sheet in " + source);
        }

        let sheet_data: any[][] = utils.sheet_to_json(loaded_data, {
            header: 1,
            blankrows: false,
            range: 1
        });

        let retval: AircraftDirectiveData[] = [];

        // Need to skip the first 6 rows manually.
        for(let i = 5; i < sheet_data.length; i++) {
            let row = sheet_data[i];

            let isActive: boolean = (row[6] == null) || ("active" == row[6].toLowerCase());
            let base_date = row[2];
            let date_str = null;

            if(base_date) {
                let date_data = SSF.parse_date_code(base_date);
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
