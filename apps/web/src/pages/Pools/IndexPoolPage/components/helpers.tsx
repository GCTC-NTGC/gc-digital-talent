import type { IntlShape } from "react-intl";
import type { SortingState } from "@tanstack/react-table";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";

import type { Locales } from "@gc-digital-talent/i18n";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Link, Chip } from "@gc-digital-talent/ui";
import type {
  FragmentType,
  LocalizedString,
  OrderByColumnInput,
  PoolBookmarksOrderByInput,
  PoolFilterInput,
  PoolWorkStreamNameOrderByInput,
  QueryPoolsPaginatedOrderByRelationOrderByClause,
} from "@gc-digital-talent/graphql";
import {
  Language,
  NullsOption,
  OrderByRelationWithColumnAggregateFunction,
  PoolsOrderByColumn,
  QueryPoolsPaginatedOrderByClassificationColumn,
  SortOrder,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import type { SearchState } from "~/components/Table/ResponsiveTable/types";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";

import type { FormValues } from "./PoolFilterDialog";
import type { PoolBookmark_Fragment } from "./PoolBookmark";
import PoolBookmark from "./PoolBookmark";

export function poolNameAccessor(
  name: LocalizedString | null | undefined,
  workStreamName: LocalizedString | null | undefined,
  intl: IntlShape,
) {
  const localizedName = getLocalizedName(name, intl);
  return `${localizedName.toLowerCase()} ${getLocalizedName(workStreamName, intl, true)}`;
}

export function viewCell(
  url: string,
  name: LocalizedString | null | undefined,
  intl: IntlShape,
) {
  return (
    <Link color="black" href={url}>
      {getLocalizedName(name, intl)}
    </Link>
  );
}

export function classificationCell(groupAndLevel: string | undefined) {
  if (!groupAndLevel) return null;

  return <Chip color="primary">{groupAndLevel}</Chip>;
}

interface TransformPoolInputArgs {
  search: SearchState;
  filters?: PoolFilterInput;
}

export function transformPoolInput({
  search,
  filters,
}: TransformPoolInputArgs) {
  if (
    typeof filters === "undefined" &&
    typeof search.term === "undefined" &&
    typeof search.type === "undefined"
  ) {
    return undefined;
  }

  const filtersWithCanAdmin: PoolFilterInput = { ...filters, canAdmin: true }; // only show pools that the use is able to admin

  return {
    ...filtersWithCanAdmin,
    generalSearch: !!search.term && !search.type ? search.term : undefined,
    name: search.type === "name" ? search.term : undefined,
    team: search.type === "type" ? search.term : undefined,
  };
}

export function getOrderByClause(
  sortingRules?: SortingState,
): QueryPoolsPaginatedOrderByRelationOrderByClause[] | undefined {
  const columnMap = new Map<string, PoolsOrderByColumn>([
    ["id", PoolsOrderByColumn.Id],
    ["name", PoolsOrderByColumn.Name],
    ["processNumber", PoolsOrderByColumn.ProcessNumber],
    // ["publishedAt", "published_at"], // moved to getOrderByColumnSort to handle nulls
    ["createdDate", PoolsOrderByColumn.CreatedAt],
    ["updatedDate", PoolsOrderByColumn.UpdatedAt],
    // ["status", "status"],
  ]);
  // sorted by a relation or another arg, not a column
  const otherSortIds = ["classification", "team", "poolBookmarks"];

  const sortingRule = sortingRules?.find(
    (rule) => columnMap.has(rule.id) || otherSortIds.includes(rule.id),
  );

  // PoolBookmarks is handled by another arg
  if (sortingRule?.id === "poolBookmarks") return undefined;
  // Team is handled by another arg
  if (sortingRule?.id === "team") return undefined;

  if (sortingRule?.id === "classification") {
    return [
      {
        column: undefined,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        classification: {
          aggregate: OrderByRelationWithColumnAggregateFunction.Max,
          column: QueryPoolsPaginatedOrderByClassificationColumn.Group,
        },
      },
      {
        column: undefined,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        classification: {
          aggregate: OrderByRelationWithColumnAggregateFunction.Max,
          column: QueryPoolsPaginatedOrderByClassificationColumn.Level,
        },
      },
    ];
  }

  if (sortingRule) {
    return [
      {
        column: columnMap.get(sortingRule.id),
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      },
    ];
  }

  // nothing matched
  return undefined;
}

export function getWorkStreamNameSort(
  sortingRules?: SortingState,
  locale?: Locales,
): PoolWorkStreamNameOrderByInput | undefined {
  const sortingRule = sortingRules?.find((rule) => rule.id === "workStream");

  if (!sortingRule) return undefined;

  return {
    locale: locale === "fr" ? Language.Fr : Language.En,
    order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
  };
}

export function getOrderByColumnSort(
  sortingRules?: SortingState,
): OrderByColumnInput | undefined {
  // few columns use this ordering clause
  const columnMap = new Map<string, string>([["publishedAt", "published_at"]]);

  const sortingRule = sortingRules?.find((rule) => {
    const columnName = columnMap.get(rule.id);
    return !!columnName;
  });

  if (sortingRule?.id === "publishedAt") {
    return {
      column: PoolsOrderByColumn.PublishedAt,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      nulls: NullsOption.OrderLast,
    };
  }

  // nothing matched
  return undefined;
}

export function getPoolBookmarkSort(): PoolBookmarksOrderByInput | undefined {
  return {
    column: "poolBookmarks",
    order: SortOrder.Asc,
  };
}

export function transformFormValuesToFilterInput(
  data: FormValues,
): PoolFilterInput {
  return {
    statuses: data.statuses,
    workStreams: data.workStreams,
    classifications: data.classifications.map((classification) => {
      const [group, level] = classification.split("-");
      return { group, level: Number(level) };
    }),
  };
}

export function transformPoolFilterInputToFormValues(
  input: PoolFilterInput | undefined,
): FormValues {
  return {
    statuses: unpackMaybes(input?.statuses),
    workStreams: unpackMaybes(input?.workStreams),
    classifications: unpackMaybes(input?.classifications).map(
      (c) => `${c.group}-${c.level}`,
    ),
  };
}

export const poolBookmarkCell = (
  owner: FragmentType<typeof PoolBookmark_Fragment>,
  poolId: string,
  poolName?: LocalizedString | null,
) => {
  return <PoolBookmark user={owner} poolId={poolId} poolName={poolName} />;
};

export const poolBookmarkHeader = (intl: IntlShape) => (
  <BookmarkIcon
    className="size-6"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
    aria-hidden="false"
  />
);
