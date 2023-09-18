import orderBy from "lodash/orderBy";

import { Option } from "./types";

const orderItems = (options: Option[]): Option[] => {
  return orderBy(
    options,
    (o) => o?.label?.toLocaleString().toLowerCase(),
    "asc",
  );
};

type GetFilteredItemsArgs = {
  options: Option[];
  query?: string;
};

type GetSingleFilteredItems = GetFilteredItemsArgs & {
  selected?: Option | null;
};
/**
 * Get filtered items
 */
export function getSingleFilteredItems({
  options,
  selected,
  query,
}: GetSingleFilteredItems): Option[] {
  let available = options;

  if (query) {
    available = options.filter((option) => {
      return (
        option.value === selected?.value ||
        option.label
          ?.toLocaleString()
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    });
  }

  return orderItems(available);
}

type GetMultiFilteredItems = GetFilteredItemsArgs & {
  selected?: Option[];
};
/**
 * Get filtered items
 */
export function getMultiFilteredItems({
  options,
  selected,
  query,
}: GetMultiFilteredItems): Option[] {
  let available = options;

  if (selected) {
    available = available.filter((option) => {
      return selected?.some(({ value }) => value === option.value);
    });
  }

  if (query) {
    available = options.filter((option) => {
      return option.label
        ?.toLocaleString()
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }

  return orderItems(available);
}

export function itemToString<T extends Option>(item: T | null): string {
  return item?.label?.toString() ?? "";
}

export function isItemSelected<T extends Option>(
  item: T | null,
  selectedItems: T[],
): boolean {
  return !!selectedItems.find(
    (selectedItem) => selectedItem.value === item?.value,
  );
}
