import { SortingFn } from "@tanstack/react-table";

import { normalizeString } from "@gc-digital-talent/helpers";

/**
 * Diacritic sort
 *
 * Basic sorting function that first normalizes the string
 *
 * @param {string} strA
 * @param {string} strB
 * @returns {number}
 */
const compareNormalized = (strA: string, strB: string): number => {
  const a = normalizeString(strA);
  const b = normalizeString(strB);

  if (a === b) return 0;

  return a > b ? 1 : -1;
};

// Note: any required for react-table
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizedText: SortingFn<any> = (rowA, rowB, columnId) => {
  return compareNormalized(rowA.getValue(columnId), rowB.getValue(columnId));
};
