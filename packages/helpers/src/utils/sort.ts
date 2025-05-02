type Order = "asc" | "desc";

function compareStrings(
  a: string | undefined | null,
  b: string | undefined | null,
  order: Order,
): number {
  if (!a || !b) return 0;

  const aValue = order === "desc" ? b : a;
  const bValue = order === "desc" ? a : b;

  return aValue.localeCompare(bValue);
}

export function sortAlphaBy<T extends object>(
  accessor: (value: T) => string | undefined | null,
  order: Order = "asc",
): (a: T, b: T) => number {
  return (a, b) => compareStrings(accessor(a), accessor(b), order);
}
