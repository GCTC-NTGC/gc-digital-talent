import { unpackMaybes } from "@gc-digital-talent/helpers";

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
