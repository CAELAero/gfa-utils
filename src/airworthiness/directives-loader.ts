/*
 * Copyright (c) 2020, Justin Couch
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Readable } from 'stream';

import { readFile, read, WorkBook, utils, SSF } from 'xlsx';
import { ADType } from '..';
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
    public static async listAllDirectives(
        source: string | Readable | ReadableStream | Blob,
        matchTypeCertName?: string,
        ignoreInactive?: boolean,
    ): Promise<AircraftDirectiveData[]> {
        if (!source) {
            throw new Error('No source given to parse');
        }

        // First sheet is the Help Sheet, 2nd is the real data, 3rd is Websites to find stuff at
        // Use excel dates to ensure that we don't have TZ issues in conversions later.

        const workbook: WorkBook = await DirectivesLoader.readInput(source);
        const loaded_data = workbook.Sheets[workbook.SheetNames[1]];

        // Could we find the right sheet? undefined or null here if not. Throw error
        if (!loaded_data) {
            throw new Error(`Unable to locate the required sheet in input data`);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sheet_data: any[][] = utils.sheet_to_json(loaded_data, {
            header: 1,
            blankrows: false,
            range: 1,
        });

        const retval: AircraftDirectiveData[] = [];

        const name_to_match =
            matchTypeCertName && matchTypeCertName.trim().length > 1 ? matchTypeCertName.trim() : null;

        // Need to skip the first 6 rows manually.
        for (let i = 5; i < sheet_data.length; i++) {
            const row = sheet_data[i];

            // Ignore rows that don't have the right number of
            // columns as they are comment rows. 7 columns in regular data, but if the
            // active field value is missing, then the reader will only tell us there are 6
            if (row.length < 6) {
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

            if (name_to_match && name_to_match !== row[3]) {
                continue;
            }

            const isActive: boolean = row[6] == null || 'active' === (row[6] as string).toLowerCase();

            if (ignoreInactive && !isActive) {
                continue;
            }

            const base_date: number = row[2] as number;
            let date_str = null;

            if (base_date) {
                const date_data = SSF.parse_date_code(base_date);
                // should be a Date object, now convert this to an ISO date string. Date object is in UTC
                // when printing a string, but excel date is in "local timezone". Since we know the spreadsheet
                // is generally produced in Sydney or Melbourne, we always force a local timezone of
                // australia/sydney to fetch the matching date.
                date_str =
                    date_data.y.toString().padStart(4, '0') +
                    '-' +
                    date_data.m.toString().padStart(2, '0') +
                    '-' +
                    date_data.d.toString().padStart(2, '0');
            }

            const directive_ref: string = row[0] as string;
            const directive_issue: number = row[1] as number;
            const description: string = row[5] as string;
            const ad_type: ADType = row[4] as ADType;
            const type_cert: string = row[3] as string;

            // eslint-disable-next-line prettier/prettier
            retval.push(
                AircraftDirectiveData.create(
                    directive_ref,
                    directive_issue,
                    isActive,
                    date_str,
                    type_cert,
                    ad_type,
                    description,
                ),
            );
        }

        return retval;
    }

    private static async readInput(source: string | Readable | ReadableStream | Blob): Promise<WorkBook> {
        const options = {
            cellDates: false,
        };

        if (typeof source === 'string') {
            return readFile(source, options);
        } else if (source instanceof Readable) {
            // ReadableStream is a derived type of Readable, so we're good here
            return DirectivesLoader.readStream(source);
        } else if (source instanceof ReadableStream) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const readable = new Readable().wrap(source as any);
            return DirectivesLoader.readStream(readable);
        } else if (source instanceof Blob) {
            const blob_stream = source.stream();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            const readable = new Readable().wrap(blob_stream as any);
            return DirectivesLoader.readStream(readable);
        } else {
            throw new Error('Unhandled type of input source');
        }
    }

    private static async readStream(stream: Readable): Promise<WorkBook> {
        const buffers: Uint8Array[] = [];

        const reader = new Promise<WorkBook>((resolve, reject) => {
            stream.on('data', (data) => {
                if (data instanceof Uint8Array) {
                    buffers.push(data);
                }
            });
            stream.on('end', () => resolve(read(Buffer.concat(buffers), { type: 'buffer' })));
            stream.on('error', reject);
        });

        return reader;
    }
}
