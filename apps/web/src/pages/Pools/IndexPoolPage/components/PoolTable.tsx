import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import { Link, Pill } from "@common/components";
import { notEmpty } from "@common/helpers/util";
import { getLocale } from "@common/helpers/localize";
import { FromArray } from "@common/types/utilityTypes";
import Pending from "@common/components/Pending";
import {
  getAdvertisementStatus,
  getPoolStream,
} from "@common/constants/localizedConstants";
import { commonMessages } from "@common/messages";
import { getFullPoolAdvertisementTitleHtml } from "@common/helpers/poolUtils";
import { formatDate, parseDateTimeUtc } from "@common/helpers/dateUtils";
import { getFullNameHtml, wrapAbbr } from "@common/helpers/nameUtils";

import useRoutes from "~/hooks/useRoutes";
import {
  Classification,
  GetPoolsQuery,
  Maybe,
  Pool,
  useGetPoolsQuery,
} from "~/api/generated";
import Table, {
  ColumnsOf,
  tableEditButtonAccessor,
} from "~/components/Table/ClientManagedTable";

type Data = NonNullable<FromArray<GetPoolsQuery["pools"]>>;

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

function dateAccessor(value: Maybe<string>, intl: IntlShape) {
  return value ? (
    <span>
      {formatDate({
        date: parseDateTimeUtc(value),
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

interface PoolTableProps {
  pools: GetPoolsQuery["pools"];
}

interface IndividualCell {
  row: {
    original: Pool;
  };
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
        Cell: ({ row }: IndividualCell) =>
          viewLinkAccessor(paths.poolView(row.original.id), row.original, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Candidates",
          id: "EdUZaX",
          description:
            "Header for the View Candidates column of the Pools table",
        }),
        accessor: (d) => {
          return d.id;
        },
        disableGlobalFilter: true,
        Cell: ({ row }: IndividualCell) =>
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
        Cell: ({ row }: IndividualCell) => {
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
        Cell: ({ row }: IndividualCell) => fullNameCell(row.original, intl),
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
        Cell: ({ row }: IndividualCell) =>
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
        accessor: () => {
          return "Edit";
        },
        disableGlobalFilter: true,
        Cell: ({ row }: IndividualCell) =>
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
        accessor: "createdDate",
        Cell: ({ value }) => dateAccessor(value, intl),
      },
    ],
    [intl, paths, locale],
  );

  const data = useMemo(() => pools.filter(notEmpty), [pools]);
  const { hiddenCols, initialSortBy } = useMemo(() => {
    return {
      hiddenCols: ["id", "description", "createdDate", "ownerEmail"],
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

const PoolTableApi = () => {
  const [result] = useGetPoolsQuery();
  const { data, fetching, error } = result;

  return (
    <Pending fetching={fetching} error={error}>
      <PoolTable pools={data?.pools ?? []} />
    </Pending>
  );
};

export default PoolTableApi;
