import { Maybe } from "../api/generated";
/**
 * Filters out empty data from data response.
 * @param data
 * @returns T[]
 */
export declare const unpackMaybes: {
    <T>(data: Maybe<Maybe<T>[]>): T[];
    parameters: any;
};
/**
 * Filters out empty data from data response, and returns list of ids.
 * @param data
 * @returns string[]
 */
export declare const unpackIds: {
    (data: Maybe<Array<Maybe<{
        id: string;
    }>>>): string[];
    parameters: any;
};
/**
 * Returns the current date in the format YYYY-MM-DD.
 * @returns string
 */
export declare const currentDate: {
    (): string;
    parameters: any;
};
/**
 * Converts enum to a list of options for select input.
 * @param list
 * @returns Option
 */
export declare const enumToOptions: {
    <T>(list: T): {
        value: string | number;
        label: string;
    }[];
    parameters: any;
};
/**
 * Creates a list of values from a list of options.
 * @param list
 * @returns array
 */
export declare const getValues: {
    <T>(list: {
        value: T;
        label: string;
    }[]): T[];
    parameters: any;
};
