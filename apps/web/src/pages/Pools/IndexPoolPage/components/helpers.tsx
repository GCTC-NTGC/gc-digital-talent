import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";

import { Locales, getLocalizedName } from "@gc-digital-talent/i18n";
import { Link, Chip } from "@gc-digital-talent/ui";
import {
  Classification,
  FragmentType,
  LocalizedString,
  Maybe,
  NullsOption,
  OrderByColumnInput,
  OrderByRelationWithColumnAggregateFunction,
  Pool,
  PoolBookmarksOrderByInput,
  PoolFilterInput,
  PoolWorkStreamNameOrderByInput,
  QueryPoolsPaginatedOrderByClassificationColumn,
  QueryPoolsPaginatedOrderByRelationOrderByClause,
  QueryPoolsPaginatedOrderByUserColumn,
  SortOrder,
  User,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getFullNameHtml } from "~/utils/nameUtils";
import { SearchState } from "~/components/Table/ResponsiveTable/types";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";

import { FormValues } from "./PoolFilterDialog";
import PoolBookmark, { PoolBookmark_Fragment } from "./PoolBookmark";

export function poolNameAccessor(
  pool: Pick<Pool, "name" | "workStream">,
  intl: IntlShape,
) {
  const name = getLocalizedName(pool.name, intl);
  return `${name.toLowerCase()} ${getLocalizedName(pool?.workStream?.name, intl, true)}`;
}

export function viewCell(
  url: string,
  pool: Pick<Pool, "name">,
  intl: IntlShape,
) {
  return (
    <Link color="black" href={url}>
      {getLocalizedName(pool.name, intl)}
    </Link>
  );
}

export function fullNameCell(
  pool: { owner: Pick<User, "firstName" | "lastName"> },
  intl: IntlShape,
) {
  return (
    <span>
      {getFullNameHtml(pool.owner?.firstName, pool.owner?.lastName, intl)}
    </span>
  );
}

export function classificationAccessor(
  classification: Maybe<Pick<Classification, "group" | "level">> | undefined,
) {
  return classification
    ? `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`
    : "";
}

export function classificationCell(
  classification: Maybe<Pick<Classification, "group" | "level">> | undefined,
) {
  if (!classification) return null;

  return (
    <Chip color="primary">
      {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
      {`${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`}
    </Chip>
  );
}

export function emailLinkAccessor(
  pool: { owner: Pick<User, "email"> },
  intl: IntlShape,
) {
  if (pool.owner?.email) {
    return (
      <Link color="black" external href={`mailto:${pool.owner.email}`}>
        {pool.owner.email}
      </Link>
    );
  }
  return (
    <span className="italic">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
}

export function ownerNameAccessor(pool: Pool) {
  const firstName = pool.owner?.firstName
    ? pool.owner.firstName.toLowerCase()
    : "";
  const lastName = pool.owner?.lastName
    ? pool.owner.lastName.toLowerCase()
    : "";
  return `${firstName} ${lastName}`;
}

export function ownerEmailAccessor(pool: Pool) {
  return pool.owner?.email ? pool.owner.email.toLowerCase() : "";
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
  const columnMap = new Map<string, string>([
    ["id", "id"],
    ["name", "name"],
    ["publishingGroup", "publishing_group"],
    ["processNumber", "process_number"],
    ["ownerName", "FIRST_NAME"],
    ["ownerEmail", "EMAIL"],
    // ["publishedAt", "published_at"], // moved to getOrderByColumnSort to handle nulls
    ["createdDate", "created_at"],
    ["updatedDate", "updated_at"],
    ["classification", "classification"],
    ["team", "team"],
    ["poolBookmarks", "poolBookmarks"],
    // ["status", "status"],
  ]);

  const sortingRule = sortingRules?.find((rule) => {
    const columnName = columnMap.get(rule.id);
    return !!columnName;
  });

  // PoolBookmarks is handled by another arg
  if (sortingRule?.id === "poolBookmarks") return undefined;
  // Team is handled by another arg
  if (sortingRule?.id === "team") return undefined;

  if (sortingRule && sortingRule.id === "classification") {
    return [
      {
        column: undefined,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        classification: {
          aggregate: OrderByRelationWithColumnAggregateFunction.Max,
          column: "GROUP" as QueryPoolsPaginatedOrderByClassificationColumn,
        },
      },
      {
        column: undefined,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        classification: {
          aggregate: OrderByRelationWithColumnAggregateFunction.Max,
          column: "LEVEL" as QueryPoolsPaginatedOrderByClassificationColumn,
        },
      },
    ];
  }

  if (sortingRule && ["ownerName", "ownerEmail"].includes(sortingRule.id)) {
    const columnName = columnMap.get(sortingRule.id);
    return [
      {
        column: undefined,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        user: {
          aggregate: OrderByRelationWithColumnAggregateFunction.Max,
          column: columnName as QueryPoolsPaginatedOrderByUserColumn,
        },
      },
    ];
  }

  if (sortingRule) {
    const columnName = columnMap.get(sortingRule.id);
    return [
      {
        column: columnName,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        user: undefined,
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
    locale: locale ?? "en",
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
      column: "published_at",
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
    publishingGroups: data.publishingGroups,
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
    publishingGroups: unpackMaybes(input?.publishingGroups),
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
  poolName?: Maybe<LocalizedString>,
) => {
  return <PoolBookmark user={owner} poolId={poolId} poolName={poolName} />;
};

export const poolBookmarkHeader = (intl: IntlShape) => (
  <BookmarkIcon
    className="size-6"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
  />
);
