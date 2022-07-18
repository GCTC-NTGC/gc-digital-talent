import { InputMaybe } from "../api/generated";

export function identity<T>(value: T): T {
  return value;
}

/**
 * Returns true if value is not null or undefined.
 * Can be used to filter nulls and undefined values out of an array in a
 * typescript-compatible way.
 * @param item
 * @see https://stackoverflow.com/a/46700791
 */
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

/**
 * Returns true if value id null OR undefined.
 * @param item
 */
export function empty<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === null || value === undefined;
}

export function getId<T extends { id: string }>(item: T): string {
  return item.id;
}

/**
 * Checks if an object has an attribute with a particular key
 * @param object
 * @param key
 */
export function hasKey<T>(
  object: { [key: string]: T },
  key: string | number,
): boolean {
  return object[key] !== undefined;
}

/**
 * Returns the value at the specified key. If the key is not present, throws an error.
 * @param object
 * @param key
 * @param errorMessage
 */
export function getOrThrowError<T>(
  object: { [key: string]: T },
  key: string | number,
  errorMessage: string,
): T {
  if (!hasKey(object, key)) {
    throw new Error(errorMessage);
  }
  return object[key];
}

/** Return a copy of the object with specific property removed */
export function deleteProperty<T, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _, ...newObj } = obj;
  return newObj;
}

/**
 * Inserts a separator between each pair of adjacent items in an array.
 * Kind of like array.join, except it leaves you with an array rather than a string.
 */
export function insertBetween<T>(separator: T, arr: T[]): T[] {
  return arr.reduce<T[]>((prev, curr, i) => {
    // When i === 0, prev is []. We only want separator between our original items, not at the beginning.
    if (i > 0) {
      prev.push(separator);
    }
    prev.push(curr);
    return prev;
  }, []);
}

/**
 * Tests if a string is boolean true
 * https://stackoverflow.com/a/264037
 * https://stackoverflow.com/a/2140644
 */
export function isStringTrue(str: string | undefined): boolean {
  return str?.toLocaleUpperCase() === "TRUE";
}

/**
 * Accepts a input value and transforms empty strings to a null
 * @param s String value from an input
 * @returns The possibly-transformed-to-null input string
 */
export const emptyToNull = (s: InputMaybe<string>): string | null =>
  empty(s) || s === "" ? null : s;
