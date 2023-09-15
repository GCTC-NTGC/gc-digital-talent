/* eslint-disable import/prefer-default-export */
import isArray from "lodash/isArray";
import orderBy from "lodash/orderBy";

import { DefaultValues, Option } from "./types";

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

type GetDefaultValueArgs = {
  defaultValues: DefaultValues;
  options: Option[];
  isMulti?: boolean;
  name: string;
};

export function getDefaultValue({
  defaultValues,
  isMulti,
  options,
  name,
}: GetDefaultValueArgs): Option | Option[] | null {
  let defaultValue = null;
  if (defaultValues && defaultValues[name]) {
    defaultValue =
      isArray(defaultValues[name]) && !isMulti
        ? options.find((option) => defaultValues[name].includes(option.value))
        : options.filter((option) =>
            defaultValues[name].includes(option.value),
          );
  }

  return defaultValue ?? null;
}
