import { unpackMaybes } from "@gc-digital-talent/helpers";
import type { Locales } from "@gc-digital-talent/i18n";

export function categoryAccessor(categoryLabel: string | null | undefined) {
  return categoryLabel ?? "";
}

export function skillFamiliesCell(
  familyNames: (string | null | undefined)[] | null | undefined,
) {
  const sortedNames = unpackMaybes(familyNames).sort((a, b) =>
    a.localeCompare(b),
  );

  const familyItems = sortedNames.map((familyName) => (
    <li key={familyName}>{familyName}</li>
  ));

  return familyItems.length ? <ul>{familyItems}</ul> : null;
}

export function familiesAccessor(
  familyNames: (string | null | undefined)[] | null | undefined,
) {
  return unpackMaybes(familyNames).sort().join(", ");
}

export function langCell(
  value: string | null | undefined,
  valueLocale: Locales,
  currentLocale: Locales,
) {
  if (!value) return null;

  return (
    <span {...(valueLocale !== currentLocale ? { lang: valueLocale } : {})}>
      {value}
    </span>
  );
}
