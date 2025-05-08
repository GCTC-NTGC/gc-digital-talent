import { ValidationRule } from "react-hook-form";
import orderBy from "lodash/orderBy";

import { nodeToString } from "@gc-digital-talent/helpers";

import { ComboboxValue, Option } from "./types";

const orderItems = (options: Option[]): Option[] => {
  return orderBy(options, (o) => nodeToString(o?.label).toLowerCase(), "asc");
};

const optionQueryMatcher = (option: Option, query: string): boolean =>
  !!nodeToString(option.label).toLowerCase().includes(query.toLowerCase());

interface GetFilteredItemsArgs {
  options: Option[];
  query?: string;
}

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

  // Only filter if we have a query and it does not
  // match the currently selected item
  if (
    query &&
    !(
      selected &&
      nodeToString(selected.label).toLowerCase() === query.toLowerCase()
    )
  ) {
    available = options.filter((option) => {
      return (
        option.value === selected?.value || optionQueryMatcher(option, query)
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
      return optionQueryMatcher(option, query);
    });
  }

  return orderItems(available);
}

export function itemToString<T extends Option>(item: T | null): string {
  return item?.label ?? "";
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
  currentValue?: string,
): Option | undefined {
  const searchValue: string | undefined = currentValue ?? defaultValue;
  return searchValue
    ? options.find((option) => option.value === searchValue)
    : undefined;
}

export function getMultiDefaultValue<T extends Option>(
  options: T[],
  defaultValue?: ComboboxValue,
  currentValue?: ComboboxValue,
): Option[] {
  let value: Option[] = [];
  const searchValue: ComboboxValue = currentValue ?? defaultValue;
  if (Array.isArray(searchValue)) {
    value = options.filter((option) =>
      searchValue?.some((defaultItem) => defaultItem === option.value),
    );
  } else {
    const singleValue = getSingleDefaultValue(options, searchValue);
    if (singleValue) {
      value = [singleValue];
    }
  }

  return value;
}

export function getMinMaxValue(rule: ValidationRule<string | number>): number {
  if (typeof rule === "number") {
    return rule;
  }

  let value = rule instanceof Object ? rule.value : rule;

  if (typeof value === "string") {
    value = parseInt(value, 10);
  }

  return value;
}

export function getErrorMessage(
  rule: ValidationRule<string | number>,
): string | boolean {
  if (rule instanceof Object) {
    return rule.message;
  }

  return false;
}
