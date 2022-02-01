export declare const identity: {
    <T>(value: T): T;
    parameters: any;
};
/**
 * Returns true if value is not null or undefined.
 * Can be used to filter nulls and undefined values out of an array.
 * @param item
 */
export declare const notEmpty: {
    <T>(value: T | null | undefined): value is T;
    parameters: any;
};
/**
 * Returns true if value id null OR undefined.
 * @param item
 */
export declare const empty: {
    <T>(value: T | null | undefined): value is null | undefined;
    parameters: any;
};
export declare const getId: {
    <T extends {
        id: string;
    }>(item: T): string;
    parameters: any;
};
/**
 * Checks if an object has an attribute with a particular key
 * @param object
 * @param key
 */
export declare const hasKey: {
    <T>(object: {
        [key: string]: T;
    }, key: string | number): boolean;
    parameters: any;
};
/**
 * Returns the value at the specified key. If the key is not present, throws an error.
 * @param object
 * @param key
 * @param errorMessage
 */
export declare const getOrThrowError: {
    <T>(object: {
        [key: string]: T;
    }, key: string | number, errorMessage: string): T;
    parameters: any;
};
/** Return a copy of the object with specific property removed */
export declare const deleteProperty: {
    <T, K extends keyof T>(obj: T, key: K): Omit<T, K>;
    parameters: any;
};
