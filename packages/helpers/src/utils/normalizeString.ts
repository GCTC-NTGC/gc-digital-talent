/**
 * Normalize string
 *
 * Removes diacritics, converts to lower case
 *
 * @param {string} str - The string to be normalized
 * @return {string}
 *
 * @example `const normalized = normalizeString("numériques");`
 *
 */
const normalizeString = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export default normalizeString;
