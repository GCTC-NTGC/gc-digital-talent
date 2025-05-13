import { IntlShape } from "react-intl";
import { generateJSON } from "@tiptap/react";
import { Link } from "@tiptap/extension-link";
import { StarterKit } from "@tiptap/starter-kit";
import { FieldErrors, FieldValues } from "react-hook-form";

import {
  LocalizedEnumString,
  LocalizedString,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";
import {
  Locales,
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { getId, nodeToString, unpackMaybes } from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";

import { Node } from "./components/RichTextInput/types";
import { OptGroupOrOption } from "./types";

/**
 * Filters out empty data from data response, and returns list of ids.
 * @param data
 * @returns string[]
 */
export const unpackIds = (
  data?: Maybe<(Maybe<{ id: string }> | undefined)[]>,
): string[] => unpackMaybes<{ id: string }>(data).map(getId);

interface Option {
  value: string;
  label: string;
}

/**
 * Converts a string enum to a list of options for select input.
 * @param list - Then string enum to convert to options
 * @param sortOrder - An optional array to indicate desired sort order
 * @returns Option
 */
export function enumToOptions(
  list: Record<string, string>,
  sortOrder?: string[],
): Option[] {
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
 * Localized enum to options
 *
 * Converts a localized enum to a
 * field options array
 */
export function localizedEnumToOptions(
  list: Maybe<LocalizedEnumString>[] | undefined | null,
  intl: IntlShape,
  sortOrder?: LocalizedEnumString["value"][],
): Option[] {
  const localizedEnums = unpackMaybes(list);
  if (sortOrder) {
    localizedEnums.sort((a, b) => {
      const aPosition = sortOrder.indexOf(a.value);
      const bPosition = sortOrder.indexOf(b.value);
      if (aPosition >= 0 && bPosition >= 0)
        // both are in sort list => sort by by that order
        return sortOrder.indexOf(a.value) - sortOrder.indexOf(b.value);
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
  return localizedEnums.map(({ value, label }) => ({
    value,
    label: label.localized ?? getLocalizedName(label, intl),
  }));
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
export function escapeAString(unescapedString: string): string {
  const inputStringArray = unescapedString.split("");
  const outputStringArray = inputStringArray.map((character) => {
    if (/[+*()?[\]\\]/.exec(character)) {
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
): boolean {
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
 * Returns the total number of words in a string.
 * @param text String that you want to count the number of words.
 * @returns number
 */
export const countNumberOfWords = (text: string): number => {
  if (text?.trim()) {
    return text.replace(/\s+/g, " ").trim().split(" ").length;
  }
  return 0;
};

// Reference https://uibakery.io/regex-library/html
/**
 * Returns total number of words in a string after stripping out HTML tags
 * @param text String you want the word count for after removing HTML tags
 * @returns number
 */
export const countNumberOfWordsAfterReplacingHTML = (text: string): number => {
  if (text === "") {
    return 0; // otherwise this sometimes returns "<empty string>"
  }

  const replacedString = text
    .replace(/<(?:"[^"]*"|'[^']*'|[^'">])*>/g, " ")
    .trim();
  return replacedString.replace(/\s+/g, " ").trim().split(" ").length;
};

/**
 * Maps a list of objects to sorted options
 * @param objects An array of objects with an id and name property
 * @param intl The current intl of the page
 * @returns An array of sorted options
 */
export const objectsToSortedOptions = (
  objects: {
    id: Scalars["ID"]["input"];
    name?: LocalizedString;
  }[],
  intl: IntlShape,
): { value: string; label: string }[] => {
  const locale = getLocale(intl);
  return objects
    .sort((a, b) => {
      const aName = a.name?.[locale];
      const bName = b.name?.[locale];
      if (aName && bName) {
        return aName.localeCompare(bName, locale);
      }

      return 0;
    })
    .map(({ id, name }) => ({
      value: id,
      label: name?.[locale] ?? intl.formatMessage(commonMessages.notFound),
    }));
};

export function htmlToRichTextJSON(html: string): Node {
  return generateJSON(html, [StarterKit, Link]) as Node;
}

/**
 * Flatten Errors
 *
 * Recursively takes the the errors produced by `useFormState`
 * and flattens them to an array of the field names.
 *
 * @param {FieldErrors<FieldValues> } errors - from form state
 * @param {string} parent - The field name of an existing parent
 * @returns {string[]}
 */
export function flattenErrors(
  errors: FieldErrors<FieldValues>,
  parent?: string,
): string[] {
  let errorNames: string[] = [];
  const parentKey = parent ? `${parent}.` : "";
  if (errors) {
    Object.keys(errors).forEach((fieldName) => {
      const fieldError = errors[fieldName];
      if (fieldError) {
        // This is a root of a field array, so add it to the key so we are aware later
        if ("root" in fieldError) {
          errorNames = [...errorNames, `${fieldName}.root`];
        }
        // If it is a field array, loop through, hoisting up field names
        if (Array.isArray(fieldError)) {
          fieldError.forEach(
            (subFieldError: FieldErrors<FieldValues>, index) => {
              errorNames = [
                ...errorNames,
                ...flattenErrors(
                  subFieldError,
                  `${parentKey}${fieldName}.${index}`,
                ),
              ];
            },
          );
        }
        // We have an error message so add it to the array (we don't want errors with no message)
        if ("message" in fieldError) {
          errorNames = [...errorNames, `${parentKey}${fieldName}`];
        }
      }
    });
  }

  return errorNames;
}

export function alphaSortOptions(
  list?: OptGroupOrOption[],
  locale?: Locales,
): OptGroupOrOption[] {
  return list
    ? list.sort((a, b) =>
        Intl.Collator(locale).compare(
          nodeToString(a.label),
          nodeToString(b.label),
        ),
      )
    : [];
}
