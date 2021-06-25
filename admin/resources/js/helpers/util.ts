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

/**
 * Converts enum to a list of options for select input.
 * @param list
 * @returns Option
 */
export function enumToOptions<T>(
  list: T,
): { value: string | number; label: string }[] {
  const entries = Object.entries(list);
  const options: { value: string | number; label: string }[] = entries.reduce(
    (
      accumulator: { value: string | number; label: string }[],
      currentValue,
    ) => {
      return [
        ...accumulator,
        { value: currentValue[1], label: currentValue[0] },
      ];
    },
    [],
  );
  return options;
}

/**
 * Creates a list of values from a list of options.
 * @param list
 * @returns array
 */
export function getValues<T>(list: { value: T; label: string }[]): T[] {
  return list.map((x) => x.value);
}

export function getId<T extends { id: string }>(item: T): string {
  return item.id;
}
