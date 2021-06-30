import { Maybe } from "../../api/generated";
import { getId, notEmpty } from "../../helpers/util";

/**
 * Filters out empty data from data response.
 * @param data
 * @returns T[]
 */
export function unpackMaybes<T>(data: Maybe<Array<Maybe<T>>> | undefined): T[] {
  return data?.filter(notEmpty) ?? [];
}

/**
 * Filters out empty data from data response, and returns list of ids.
 * @param data
 * @returns string[]
 */
export const unpackIds = (
  data: Maybe<Array<Maybe<{ id: string }>>> | undefined,
): string[] => unpackMaybes<{ id: string }>(data).map(getId);
