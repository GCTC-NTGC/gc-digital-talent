export function identity<T>(value: T): T {
  return value;
}

/**
 * Returns true if value is not null or undefined.
 * Can be used to filter nulls and undefined values out of an array.
 * @param item
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
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
