type Order = "asc" | "desc";

function compareStrings(a: string, b: string, order: Order): number {
  let aValue = a;
  let bValue = b;
  if (order === "desc") {
    aValue = b;
    bValue = a;
  }

  return aValue.localeCompare(bValue);
}

export function sortAlphaBy<T extends object>(
  accessor: (value: T) => string,
  order: Order = "asc",
): (a: T, b: T) => number {
  return (a, b) => compareStrings(accessor(a), accessor(b), order);
}
