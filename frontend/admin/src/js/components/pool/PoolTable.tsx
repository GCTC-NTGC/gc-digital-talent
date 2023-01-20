import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import { Link, Pill } from "@common/components";
import { notEmpty } from "@common/helpers/util";
import { getLocale } from "@common/helpers/localize";
import { FromArray } from "@common/types/utilityTypes";
import Pending from "@common/components/Pending";
import { getAdvertisementStatus } from "@common/constants/localizedConstants";
import { commonMessages } from "@common/messages";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import { formatDate, parseDateTimeUtc } from "@common/helpers/dateUtils";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import {
  GetPoolsQuery,
  Maybe,
  Pool,
  useGetPoolsQuery,
} from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

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
        { label: getFullPoolAdvertisementTitle(intl, pool) },
      )}
    </Link>
  );
}

function viewLinkAccessor(url: string, pool: Pool, intl: IntlShape) {
  return (
    <Link href={url} type="link">
      {getFullPoolAdvertisementTitle(intl, pool)}
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

export const PoolTable = ({ pools }: PoolTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
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
        accessor: (d) => viewLinkAccessor(paths.poolView(d.id), d, intl),
        sortType: (rowA, rowB, id, desc) => {
          // passing in sortType to override react-table sorting by jsx elements
          let rowAName;
          let rowBName;

          if (locale === "en") {
            rowAName = rowA.original.name?.en ?? "";
            rowBName = rowB.original.name?.en ?? "";
          } else {
            rowAName = rowA.original.name?.fr ?? "";
            rowBName = rowB.original.name?.fr ?? "";
          }
          const rowALevel =
            rowA.original.classifications && rowA.original.classifications[0]
              ? rowA.original.classifications[0].level
              : 0;
          const rowBLevel =
            rowB.original.classifications && rowB.original.classifications[0]
              ? rowB.original.classifications[0].level
              : 0;

          if (rowAName > rowBName) {
            return 1;
          }
          if (rowAName < rowBName) {
            return -1;
          }
          // if names identical then sort by level
          // level sorting adjusted to always be ascending regardless of whether name sort is A-Z or Z-A
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
          defaultMessage: "Candidates",
          id: "EdUZaX",
          description:
            "Header for the View Candidates column of the Pools table",
        }),
        accessor: (pool) =>
          poolCandidatesLinkAccessor(
            paths.poolCandidateTable(pool.id),
            intl,
            pool,
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Status",
          id: "ioqFVF",
          description: "Title displayed for the Pool table status column.",
        }),
        accessor: ({ advertisementStatus }) =>
          intl.formatMessage(
            advertisementStatus
              ? getAdvertisementStatus(advertisementStatus)
              : commonMessages.notFound,
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Group and Level",
          id: "FGUGtr",
          description:
            "Title displayed for the Pool table Group and Level column.",
        }),
        accessor: ({ classifications }) =>
          classifications?.map((classification) => {
            return (
              <Pill
                key={`${classification?.group}-${classification?.level}`}
                color="primary"
                mode="outline"
              >
                {classification?.group}&#8209;{classification?.level}
              </Pill>
            );
          }),
        sortType: (rowA, rowB, id, desc) => {
          // passing in sortType to override react-table sorting by jsx elements
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

          if (rowAGroup > rowBGroup) {
            return 1;
          }
          if (rowAGroup < rowBGroup) {
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
        accessor: ({ owner }) =>
          getFullNameHtml(
            owner && owner.firstName ? owner.firstName : "",
            owner && owner.lastName ? owner.lastName : "",
            intl,
          ),
        sortType: (rowA, rowB) => {
          const a = rowA.original.owner?.firstName
            ? rowA.original.owner.firstName.toLowerCase()
            : "";
          const b = rowB.original.owner?.firstName
            ? rowB.original.owner.firstName.toLowerCase()
            : "";
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        },
        id: "ownerName",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Owner Email",
          id: "pe5WkF",
          description: "Title displayed for the Pool table Owner Email column",
        }),
        accessor: ({ owner }) =>
          emailLinkAccessor(owner && owner.email ? owner.email : "", intl),
        sortType: (rowA, rowB) => {
          const a = rowA.original.owner?.email ?? "";
          const b = rowB.original.owner?.email ?? "";
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        },
        id: "ownerEmail",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "tpzt/B",
          description: "Title displayed for the Pool table Edit column.",
        }),
        accessor: (d) =>
          tableEditButtonAccessor(
            d.id,
            paths.poolTable(),
            d.name ? d.name[locale] : "",
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
      search={false}
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

export const PoolTableApi: React.FunctionComponent = () => {
  const [result] = useGetPoolsQuery();
  const { data, fetching, error } = result;

  return (
    <Pending fetching={fetching} error={error}>
      <PoolTable pools={data?.pools ?? []} />
    </Pending>
  );
};
