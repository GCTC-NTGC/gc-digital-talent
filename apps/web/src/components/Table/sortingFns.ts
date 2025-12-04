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

export const normalizedText: SortingFn<unknown> = (rowA, rowB, columnId) => {
  const unknownValueA = rowA.getValue<unknown>(columnId);
  const strValueA = typeof unknownValueA === "string" ? unknownValueA : "";
  const unknownValueB = rowB.getValue<unknown>(columnId);
  const strValueB = typeof unknownValueB === "string" ? unknownValueB : "";

  return compareNormalized(strValueA, strValueB);
};

/**
 * Numeric sort
 *
 * Basic sorting by numeric value
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const compareNumeric = (a: number, b: number): number => {
  if (a === b) return 0;

  return a > b ? 1 : -1;
};

export const numeric: SortingFn<unknown> = (rowA, rowB, columnId) => {
  const unknownValueA = rowA.getValue<unknown>(columnId);
  const numericValueA = Number(unknownValueA);
  const unknownValueB = rowB.getValue<unknown>(columnId);
  const numericValueB = Number(unknownValueB);
  return compareNumeric(numericValueA, numericValueB);
};
