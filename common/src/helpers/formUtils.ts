import { Maybe } from "../api/generated";
import { getId, notEmpty } from "./util";

/**
 * Filters out empty data from data response.
 * @param data
 * @returns T[]
 */
export function unpackMaybes<T>(data: Maybe<Array<Maybe<T>>>): T[] {
  return data?.filter(notEmpty) ?? [];
}

/**
 * Filters out empty data from data response, and returns list of ids.
 * @param data
 * @returns string[]
 */
export const unpackIds = (
  data: Maybe<Array<Maybe<{ id: string }>>>,
): string[] => unpackMaybes<{ id: string }>(data).map(getId);

/**
 * Returns the current date in the format YYYY-MM-DD.
 * @returns string
 */
export const currentDate = (): string => new Date().toISOString().slice(0, 10);

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
