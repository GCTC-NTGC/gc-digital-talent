import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";

import {
  Locales,
  commonMessages,
  getLocalizedName,
  getPoolStream,
} from "@gc-digital-talent/i18n";
import { Link, Chip } from "@gc-digital-talent/ui";
import {
  Classification,
  FragmentType,
  LocalizedString,
  Maybe,
  OrderByRelationWithColumnAggregateFunction,
  Pool,
  PoolBookmarksOrderByInput,
  PoolFilterInput,
  PoolTeamDisplayNameOrderByInput,
  QueryPoolsPaginatedOrderByClassificationColumn,
  QueryPoolsPaginatedOrderByRelationOrderByClause,
  QueryPoolsPaginatedOrderByUserColumn,
  SortOrder,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getFullNameHtml } from "~/utils/nameUtils";
import { SearchState } from "~/components/Table/ResponsiveTable/types";

import { FormValues } from "./PoolFilterDialog";
import PoolBookmark, { PoolBookmark_Fragment } from "./PoolBookmark";

export function poolNameAccessor(pool: Pool, intl: IntlShape) {
  const name = getLocalizedName(pool.name, intl);
  return `${name.toLowerCase()} ${
    pool.stream ? intl.formatMessage(getPoolStream(pool.stream)) : ""
  }`;
}

export function viewCell(url: string, pool: Pool, intl: IntlShape) {
  return (
    <Link color="black" href={url}>
      {getLocalizedName(pool.name, intl)}
    </Link>
  );
}

export function viewTeamLinkCell(
  url: Maybe<string> | undefined,
  displayName: Maybe<LocalizedString> | undefined,
  intl: IntlShape,
) {
  return url ? (
    <Link color="black" href={url}>
      {intl.formatMessage(
        {
          defaultMessage: "<hidden>View team: </hidden>{teamName}",
          id: "ActH9H",
          description: "Text for a link to the Team table",
        },
        {
          teamName: getLocalizedName(displayName, intl),
        },
      )}
    </Link>
  ) : null;
}

export function fullNameCell(pool: Pool, intl: IntlShape) {
  return (
    <span>
      {getFullNameHtml(pool.owner?.firstName, pool.owner?.lastName, intl)}
    </span>
  );
}

export function classificationAccessor(
  classification: Maybe<Classification> | undefined,
) {
  return classification
    ? `${classification.group}-0${classification.level}`
    : "";
}

export function classificationSortFn(rowA: Pool, rowB: Pool) {
  // passing in sortType to override default sort
  const rowAGroup =
    rowA.classification && rowA.classification ? rowA.classification.group : "";
  const rowBGroup =
    rowB.classification && rowB.classification ? rowB.classification.group : "";
  const rowALevel =
    rowA.classification && rowA.classification ? rowA.classification.level : 0;
  const rowBLevel =
    rowB.classification && rowB.classification ? rowB.classification.level : 0;

  if (rowAGroup.toLowerCase() > rowBGroup.toLowerCase()) {
    return 1;
  }
  if (rowAGroup.toLowerCase() < rowBGroup.toLowerCase()) {
    return -1;
  }
  // if groups identical then sort by level
  if (rowALevel > rowBLevel) {
    return 1;
  }
  if (rowALevel < rowBLevel) {
    return -1;
  }
  return 0;
}

export function classificationCell(
  classification: Maybe<Classification> | undefined,
) {
  if (!classification) return null;

  return (
    <Chip color="primary">
      {`${classification.group}-0${classification.level}`}
    </Chip>
  );
}

export function emailLinkAccessor(pool: Pool, intl: IntlShape) {
  if (pool.owner?.email) {
    return (
      <Link color="black" external href={`mailto:${pool.owner.email}`}>
        {pool.owner.email}
      </Link>
    );
  }
  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
}

export function ownerNameAccessor(pool: Pool) {
  const firstName =
    pool.owner && pool.owner.firstName
      ? pool.owner.firstName.toLowerCase()
      : "";
  const lastName =
    pool.owner && pool.owner.lastName ? pool.owner.lastName.toLowerCase() : "";
  return `${firstName} ${lastName}`;
}

export function ownerEmailAccessor(pool: Pool) {
  return pool.owner && pool.owner.email ? pool.owner.email.toLowerCase() : "";
}

type TransformPoolInputArgs = {
  search: SearchState;
  filters?: PoolFilterInput;
};

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

  return {
    ...filters,
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
    ["stream", "stream"],
    ["ownerName", "FIRST_NAME"],
    ["ownerEmail", "EMAIL"],
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

  return [
    {
      column: "created_at",
      order: SortOrder.Asc,
      user: undefined,
    },
  ];
}

export function getTeamDisplayNameSort(
  sortingRules?: SortingState,
  locale?: Locales,
): PoolTeamDisplayNameOrderByInput | undefined {
  const sortingRule = sortingRules?.find((rule) => rule.id === "team");

  if (!sortingRule) return undefined;

  return {
    locale: locale ?? "en",
    order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
  };
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
    streams: data.streams,
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
    streams: unpackMaybes(input?.streams),
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
    data-h2-width="base(x1)"
    aria-label={intl.formatMessage(commonMessages.bookmark)}
  />
);
