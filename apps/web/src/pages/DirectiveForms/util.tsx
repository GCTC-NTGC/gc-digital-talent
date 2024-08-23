import { IntlShape } from "react-intl";
import { ReactElement, ReactNode } from "react";

import { Link } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";
import { assertUnreachable } from "@gc-digital-talent/helpers";

// build an external link to use with a formatjs message
export function buildExternalLink(
  href: string,
  chunks: ReactNode,
): ReactElement {
  return (
    <Link href={href} external newTab>
      {chunks}
    </Link>
  );
}

export function getDirectiveUrl(intl: IntlShape): string {
  const locale = getLocale(intl);
  switch (locale) {
    case "en":
      return "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32749";
    case "fr":
      return "https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=32749";
    default:
      return assertUnreachable(locale);
  }
}

// placeholder ID for fake option "other"
export const OTHER_ID = "OTHER";

// custom type guard for enum value
function isEnumValue<T extends object>(
  typeObject: T,
  value: unknown,
): value is T[keyof T] {
  return Object.values(typeObject).includes(value as T[keyof T]);
}

// typed helper function to validate enum value at runtime
export function stringToEnum<T extends object>(
  typeObject: T,
  value: string,
): T[keyof T] {
  if (isEnumValue(typeObject, value)) return value;
  throw new Error(
    `Unable to convert value "${value}" to enum of ${Object.values(
      typeObject,
    ).join(", ")}`,
  );
}

// typed helper function to turn an enum into an array of options
export function enumToOptions<T extends object>(
  typeObject: T,
  sortOrder?: Array<T[keyof T]>,
): { value: T[keyof T]; label: string }[] {
  const entries = Object.entries(typeObject) as [string, T[keyof T]][];
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
  const options: { value: T[keyof T]; label: string }[] = entries.reduce(
    (accumulator: { value: T[keyof T]; label: string }[], currentValue) => {
      return [
        ...accumulator,
        { value: currentValue[1], label: currentValue[0] },
      ];
    },
    [],
  );
  return options;
}
