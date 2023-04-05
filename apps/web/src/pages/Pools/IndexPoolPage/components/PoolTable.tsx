import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import uniqBy from "lodash/uniqBy";

import { Link, Pill, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  getAdvertisementStatus,
  getPoolStream,
  getLocale,
  commonMessages,
  getLocalizedName,
  getPublishingGroup,
} from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/forms";

import { getFullNameHtml, wrapAbbr } from "~/utils/nameUtils";
import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";
import {
  Classification,
  Maybe,
  Pool,
  Scalars,
  useGetMePoolsQuery,
  RoleAssignment,
  LocalizedString,
  useAllPoolsQuery,
  Team,
} from "~/api/generated";
import Table, {
  ColumnsOf,
  tableEditButtonAccessor,
  Cell,
} from "~/components/Table/ClientManagedTable";

type Data = Pool;
type PoolCell = Cell<Pool>;

// callbacks extracted to separate function to stabilize memoized component
function poolCandidatesLinkAccessor(
  poolCandidatesTableUrl: string,
  intl: IntlShape,
  pool: Maybe<Pick<Pool, "name" | "classifications" | "stream">>,
) {
  return (
    <Link
      href={poolCandidatesTableUrl}
      type="button"
      mode="inline"
      color="black"
      data-h2-padding="base(0)"
    >
      {intl.formatMessage(
        {
          defaultMessage: "View Candidates<hidden> for {label}</hidden>",
          id: "6R9N+h",
          description: "Text for a link to the Pool Candidates table",
        },
        { label: getFullPoolAdvertisementTitleHtml(intl, pool) },
      )}
    </Link>
  );
}

function viewLinkAccessor(url: string, pool: Pool, intl: IntlShape) {
  return (
    <Link href={url} type="link">
      {getFullPoolAdvertisementTitleHtml(intl, pool)}
    </Link>
  );
}

function viewTeamLinkAccessor(
  url: Maybe<string>,
  displayName: Maybe<LocalizedString>,
  intl: IntlShape,
) {
  return url ? (
    <Link href={url} type="link">
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

function dateCell(date: Maybe<Scalars["DateTime"]>, intl: IntlShape) {
  return date ? (
    <span>
      {formatDate({
        date: parseDateTimeUtc(date),
        formatString: "PPP p",
        intl,
      })}
    </span>
  ) : null;
}

const fullNameCell = (pool: Pool, intl: IntlShape) => {
  return (
    <span>
      {getFullNameHtml(pool.owner?.firstName, pool.owner?.lastName, intl)}
    </span>
  );
};

const classificationsCell = (
  classifications: Maybe<Maybe<Classification>[]>,
): JSX.Element | null => {
  const filteredClassifications = classifications
    ? classifications.filter((classification) => !!classification)
    : null;
  const pillsArray = filteredClassifications
    ? filteredClassifications.map((classification) => {
        return (
          <Pill
            key={`${classification?.group}-${classification?.level}`}
            color="primary"
            mode="outline"
          >
            {classification?.group}&#8209;{classification?.level}
          </Pill>
        );
      })
    : null;
  if (pillsArray) {
    return <span>{pillsArray}</span>;
  }
  return null;
};

const emailLinkAccessor = (value: Maybe<string>, intl: IntlShape) => {
  if (value) {
    return <a href={`mailto:${value}`}>{value}</a>;
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
};

interface PoolWithTeam extends Pool {
  team: NonNullable<Pool["team"]>;
}

// roles assignments to teams to pools array
const roleAssignmentsToPools = (
  roleAssignmentArray: Maybe<RoleAssignment[]>,
): Pool[] => {
  const flattenedTeams = roleAssignmentArray?.flatMap(
    (roleAssign) => roleAssign.team,
  );
  const filteredFlattenedTeams = unpackMaybes(flattenedTeams);

  const addTeamToPool =
    (team: Team) =>
    (pool: Pool): PoolWithTeam => ({ ...pool, team });

  const flattenedPools = filteredFlattenedTeams.flatMap((team) => {
    return unpackMaybes(team.pools).map(addTeamToPool(team));
  });
  const poolsArray = uniqBy(flattenedPools, "id");
  return poolsArray;
};

interface PoolTableProps {
  pools: Pool[];
}

export const PoolTable = ({ pools }: PoolTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Id",
          id: "kt5dPm",
          description:
            "Title displayed on the Pool table Unique Identifier column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Pool Name",
          id: "HocLRh",
          description: "Title displayed for the Pool table pool name column.",
        }),
        accessor: (d) => {
          if (d.name && d.name.en && locale === "en") {
            return `${d.name.en.toLowerCase()} ${
              d.stream ? intl.formatMessage(getPoolStream(d.stream)) : ""
            }`;
          }
          if (d.name && d.name.fr && locale === "fr") {
            return `${d.name.fr.toLowerCase()} ${
              d.stream ? intl.formatMessage(getPoolStream(d.stream)) : ""
            }`;
          }
          return "";
        },
        Cell: ({ row }: PoolCell) =>
          viewLinkAccessor(paths.poolView(row.original.id), row.original, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Publishing group",
          id: "rYgaTA",
          description:
            "Title displayed for the Pool table publishing group column.",
        }),
        accessor: (d) => {
          return intl.formatMessage(
            d.publishingGroup
              ? getPublishingGroup(d.publishingGroup)
              : commonMessages.notFound,
          );
        },
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Candidates",
          id: "EdUZaX",
          description:
            "Header for the View Candidates column of the Pools table",
        }),
        id: "candidates",
        accessor: (d) => `Candidates ${d.id}`,
        disableGlobalFilter: true,
        Cell: ({ row }: PoolCell) =>
          poolCandidatesLinkAccessor(
            paths.poolCandidateTable(row.original.id),
            intl,
            row.original,
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Status",
          id: "ioqFVF",
          description: "Title displayed for the Pool table status column.",
        }),
        accessor: (d) => {
          return intl.formatMessage(
            d.advertisementStatus
              ? getAdvertisementStatus(d.advertisementStatus)
              : commonMessages.notFound,
          );
        },
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Group and Level",
          id: "FGUGtr",
          description:
            "Title displayed for the Pool table Group and Level column.",
        }),
        accessor: (d) => {
          let classificationsString = "";
          if (d.classifications && d.classifications.length > 0) {
            d.classifications.forEach((classification) => {
              if (classification) {
                const groupLevelString = wrapAbbr(
                  `${classification?.group}-0${classification?.level}`,
                  intl,
                );
                classificationsString += groupLevelString;
              }
            });
          }
          return classificationsString;
        },
        Cell: ({ row }: PoolCell) => {
          return classificationsCell(row.original.classifications);
        },
        sortType: (rowA, rowB, id, desc) => {
          // passing in sortType to override default sort
          const rowAGroup =
            rowA.original.classifications && rowA.original.classifications[0]
              ? rowA.original.classifications[0].group
              : "";
          const rowBGroup =
            rowB.original.classifications && rowB.original.classifications[0]
              ? rowB.original.classifications[0].group
              : "";
          const rowALevel =
            rowA.original.classifications && rowA.original.classifications[0]
              ? rowA.original.classifications[0].level
              : 0;
          const rowBLevel =
            rowB.original.classifications && rowB.original.classifications[0]
              ? rowB.original.classifications[0].level
              : 0;

          if (rowAGroup.toLowerCase() > rowBGroup.toLowerCase()) {
            return 1;
          }
          if (rowAGroup.toLowerCase() < rowBGroup.toLowerCase()) {
            return -1;
          }
          // if groups identical then sort by level
          // level sorting adjusted to always be ascending regardless of whether group sort is A-Z or Z-A
          if (rowALevel > rowBLevel) {
            return desc ? -1 : 1;
          }
          if (rowALevel < rowBLevel) {
            return desc ? 1 : -1;
          }
          return 0;
        },
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Team",
          id: "fCXZ4R",
          description: "Title displayed for the Pool table Team column",
        }),
        accessor: (d) => `Team ${d.team?.id ? d.team.id : ""}`,
        Cell: ({ row }: PoolCell) =>
          viewTeamLinkAccessor(
            paths.teamView(row.original.team?.id ? row.original.team?.id : ""),
            row.original.team?.displayName,
            intl,
          ),
        id: "team",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Owner Name",
          id: "AWk4BX",
          description: "Title displayed for the Pool table Owner Name column",
        }),
        accessor: (d) => {
          const firstName =
            d.owner && d.owner.firstName ? d.owner.firstName.toLowerCase() : "";
          const lastName =
            d.owner && d.owner.lastName ? d.owner.lastName.toLowerCase() : "";
          return `${firstName} ${lastName}`;
        },
        Cell: ({ row }: PoolCell) => fullNameCell(row.original, intl),
        id: "ownerName",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Owner Email",
          id: "pe5WkF",
          description: "Title displayed for the Pool table Owner Email column",
        }),
        accessor: (d) => {
          return d.owner && d.owner.email ? d.owner.email.toLowerCase() : "";
        },
        Cell: ({ row }: PoolCell) =>
          emailLinkAccessor(
            row.original.owner && row.original.owner.email
              ? row.original.owner.email
              : "",
            intl,
          ),
        id: "ownerEmail",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "tpzt/B",
          description: "Title displayed for the Pool table Edit column.",
        }),
        id: "edit",
        accessor: (d) => `Edit ${d.id}`,
        disableGlobalFilter: true,
        Cell: ({ row }: PoolCell) =>
          tableEditButtonAccessor(
            row.original.id,
            paths.poolTable(),
            row.original.name ? row.original.name[locale] : "",
          ), // callback extracted to separate function to stabilize memoized component
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Created",
          id: "zAqJMe",
          description: "Title displayed on the Pool table Date Created column",
        }),
        accessor: ({ createdDate }) =>
          createdDate ? parseDateTimeUtc(createdDate).valueOf() : null,
        Cell: ({ row: { original: searchRequest } }: PoolCell) =>
          dateCell(searchRequest.createdDate, intl),
      },
    ],
    [intl, paths, locale],
  );

  const data = useMemo(() => pools.filter(notEmpty), [pools]);
  const { hiddenCols, initialSortBy } = useMemo(() => {
    return {
      hiddenCols: [
        "id",
        "description",
        "createdDate",
        "ownerEmail",
        "ownerName",
      ],
      initialSortBy: [
        {
          id: "createdDate",
          desc: true,
        },
      ],
    };
  }, []);

  return (
    <Table
      data={data}
      columns={columns}
      hiddenCols={hiddenCols}
      search
      addBtn={{
        path: paths.poolCreate(),
        label: intl.formatMessage({
          defaultMessage: "Create Pool",
          id: "/Y7x+s",
          description: "Heading displayed above the Create Pool form.",
        }),
      }}
      initialSortBy={initialSortBy}
    />
  );
};

export const PoolOperatorTableApi = () => {
  const [result] = useGetMePoolsQuery();
  const { data, fetching, error } = result;
  const poolsArray = roleAssignmentsToPools(data?.me?.roleAssignments);

  return (
    <Pending fetching={fetching} error={error}>
      <PoolTable pools={poolsArray ?? []} />
    </Pending>
  );
};

export const PoolAdminTableApi = () => {
  const [result] = useAllPoolsQuery();
  const { data, fetching, error } = result;
  const pools = unpackMaybes(data?.pools);

  return (
    <Pending fetching={fetching} error={error}>
      <PoolTable pools={pools} />
    </Pending>
  );
};
