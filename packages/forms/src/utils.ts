import { IntlShape } from "react-intl";

import {
  LocalizedString,
  Maybe,
  Scalars,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
import { getId, notEmpty } from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";

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
 * Converts a string enum to a list of options for select input.
 * @param list - Then string enum to convert to options
 * @param sortOrder - An optional array to indicate desired sort order
 * @returns Option
 */
export function enumToOptions(
  list: Record<string, string>,
  sortOrder?: string[],
): { value: string; label: string }[] {
  const entries = Object.entries(list);
  if (sortOrder) {
    entries.sort((a, b) => {
      const aPosition = sortOrder.indexOf(a[1]);
      const bPosition = sortOrder.indexOf(b[1]);
      if (aPosition >= 0 && bPosition >= 0)
        // both are in sort list => sort by by that order
        return sortOrder.indexOf(a[1]) - sortOrder.indexOf(b[1]);
      if (aPosition >= 0 && bPosition < 0)
        // only a is in sort list => sort a before b
        return -1;
      if (aPosition < 0 && bPosition >= 0)
        // only b is in sort list => sort b before a
        return 1;
      // neither is in sort list => keep original order
      return 0;
    });
  }
  const options: { value: string; label: string }[] = entries.reduce(
    (accumulator: { value: string; label: string }[], currentValue) => {
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

/**
 * Returns a string with certain characters escaped, for Regex purposes
 * @param unescapedString String that you want escaped characters in
 * @returns { string } String with certain characters escaped
 */
export function escapeAString(unescapedString: string) {
  const inputStringArray = unescapedString.split("");
  const outputStringArray = inputStringArray.map((character) => {
    if (character.match(/[+*()?[\]\\]/)) {
      // looks a little funny due to needing to escape "\" and "]" characters themselves for matching
      return `\\${character}`;
    }
    return character;
  });
  const escapedString = outputStringArray.join("");
  return escapedString;
}

/**
 * Returns a boolean indicating if the compare string matches the word being searched for (needle).
 * @param needle String that you want to search for.
 * @param compareString A single string to check.
 * @returns { boolean } True if the needle matches the compare string
 */
export function matchStringCaseDiacriticInsensitive(
  needle: string,
  compareString: string,
) {
  if (needle.length > 1000) {
    // short-circuit for very long needle cases, prevents RegExp crashing
    defaultLogger.warning(
      "Short-circuit function matchStringCaseDiacriticInsensitive",
    );
    return false;
  }
  const escapedNeedle = escapeAString(needle); // escape certain characters for Regex purposes
  return (
    compareString
      .normalize("NFD") // Normalizing to NFD Unicode normal form decomposes combined graphemes into the combination of simple ones.
      .replace(/[\u0300-\u036f]/g, "") // Using a regex character class to match the U+0300 → U+036F range, it is now trivial to globally get rid of the diacritics, which the Unicode standard conveniently groups as the Combining Diacritical Marks Unicode block.
      .search(new RegExp(escapedNeedle, "i")) !== -1 ||
    compareString.search(new RegExp(escapedNeedle, "i")) !== -1 // This simple comparison is needed to match a string with diacritics to itself.  Refer to the "it matches strings with diacritics to the same string" test.
  );
}

/**
 * Returns a list of strings (haystack) that match the word being searched for (needle).
 * @param needle String that you want to search for.
 * @param haystack List of strings to check against.
 * @returns { string[] } List of string from the haystack matching the needle
 */
export function matchStringsCaseDiacriticInsensitive(
  needle: string,
  haystack: string[],
): string[] {
  return haystack.filter((name) =>
    matchStringCaseDiacriticInsensitive(needle, name),
  );
}

/**
 * Returns the total number of words in a string.
 * @param text String that you want to count the number of words.
 * @returns number
 */
export const countNumberOfWords = (text: string): number => {
  if (text && text.trim()) {
    return text.replace(/\s+/g, " ").trim().split(" ").length;
  }
  return 0;
};

/**
 * Maps a list of objects to sorted options
 * @param objects An array of objects with an id and name property
 * @param intl The current intl of the page
 * @returns An array of sorted options
 */
export const objectsToSortedOptions = (
  objects: {
    id: Scalars["ID"];
    name: LocalizedString;
  }[],
  intl: IntlShape,
): { value: string; label: string }[] => {
  const locale = getLocale(intl);
  return objects
    .sort((a, b) => {
      const aName: Maybe<string> = a.name[locale];
      const bName: Maybe<string> = b.name[locale];
      if (aName && bName) {
        return aName.localeCompare(bName, locale);
      }

      return 0;
    })
    .map(({ id, name }) => ({
      value: id,
      label: name[locale] ?? intl.formatMessage(commonMessages.notFound),
    }));
};

// Special Cases

// enumToOptions special case, sort by specific WorkRegion by default, reusable function
export function enumToOptionsWorkRegionSorted(
  list: Record<string, string>,
): { value: string; label: string }[] {
  return enumToOptions(list, [
    WorkRegion.Telework,
    WorkRegion.NationalCapital,
    WorkRegion.Atlantic,
    WorkRegion.Quebec,
    WorkRegion.Ontario,
    WorkRegion.North,
    WorkRegion.Prairie,
    WorkRegion.BritishColumbia,
  ]);
}
