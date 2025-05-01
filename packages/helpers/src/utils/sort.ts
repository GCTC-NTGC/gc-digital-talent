type Order = "asc" | "desc";

function compareStrings(
  a: string | undefined | null,
  b: string | undefined | null,
  order: Order,
): number {
  let aValue = a;
  let bValue = b;
  if (order === "desc") {
    aValue = b;
    bValue = a;
  }

  if (!aValue || !bValue) return 0;

  return aValue.localeCompare(bValue);
}

export function sortAlphaBy<T extends object>(
  accessor: (value: T) => string | undefined | null,
  order: Order = "asc",
): (a: T, b: T) => number {
  return (a, b) => compareStrings(accessor(a), accessor(b), order);
}
