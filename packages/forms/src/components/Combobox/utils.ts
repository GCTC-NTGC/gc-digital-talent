import orderBy from "lodash/orderBy";
import { isArray } from "lodash";

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

export function getSingleDefaultValue<T extends Option>(
  options: T[],
  defaultValue?: string,
): Option | undefined {
  return defaultValue
    ? options.find((option) => option.value === defaultValue)
    : undefined;
}

export function getMultiDefaultValue<T extends Option>(
  options: T[],
  defaultValue?: string[] | string,
): Option[] {
  let value: Option[] = [];
  if (isArray(defaultValue)) {
    value = options.filter((option) =>
      defaultValue?.some((defaultItem) => defaultItem === option.value),
    );
  } else {
    const singleValue = getSingleDefaultValue(options, defaultValue);
    if (singleValue) {
      value = [singleValue];
    }
  }

  return value;
}
