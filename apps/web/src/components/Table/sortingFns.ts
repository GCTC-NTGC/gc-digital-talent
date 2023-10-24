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
export const diacriticSort = (strA: string, strB: string): number => {
  const a = normalizeString(strA);
  const b = normalizeString(strB);

  if (a === b) return 0;

  return a > b ? 1 : -1;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const diacritic: SortingFn<any> = (rowA, rowB, columnId) => {
  return diacriticSort(rowA.getValue(columnId), rowB.getValue(columnId));
};
