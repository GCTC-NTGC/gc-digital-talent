import { format } from "date-fns/format";

import { ProcessActivityFilterInput } from "@gc-digital-talent/graphql";
import {
  DATETIME_FORMAT_STRING,
  getUtcStartOfDayForLocalDate,
  parseDateTimeUtc,
  getUserTimeZone,
  getUtcEndOfDayForLocalDate,
} from "@gc-digital-talent/date-helpers";

import { SEARCH_PARAM_KEY } from "~/components/Table/ResponsiveTable/constants";

import { FormValues } from "./components/PoolActivityFilterDialog";

export function safeGetPageState(
  key: string,
  params: URLSearchParams,
  defaultVal: number,
) {
  if (!params.has(key)) return defaultVal;

  const param = params.get(key);
  if (isNaN(Number(param))) return defaultVal;

  return Number(param);
}

export function getTotalPages(total: number, pageSize: number) {
  return Math.ceil(total / pageSize);
}

export function safeGetFilters(params: URLSearchParams) {
  const filtersEncoded = params.get(SEARCH_PARAM_KEY.FILTERS);
  let filters: FormValues | undefined;

  if (filtersEncoded) {
    try {
      filters = JSON.parse(decodeURIComponent(filtersEncoded)) as FormValues;
    } catch {
      filters = undefined;
    }
  }

  return filters;
}

export function transformWhereClause(
  searchTerm?: string,
  filters?: FormValues,
): ProcessActivityFilterInput {
  const { from, to, ...restFilters } = filters ?? {};
  const tz = getUserTimeZone();

  return {
    ...(searchTerm ? { generalSearch: searchTerm } : {}),
    ...restFilters,
    ...(from || to
      ? {
          createdAt: {
            ...(from && { from: getUtcStartOfDayForLocalDate(from, tz) }),
            ...(to && { to: getUtcEndOfDayForLocalDate(to, tz) }),
          },
        }
      : {}),
  };
}
