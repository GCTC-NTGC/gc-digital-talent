import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Link, Pill } from "@common/components";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { getLocale } from "@common/helpers/localize";
import { FromArray } from "@common/types/utilityTypes";
import Pending from "@common/components/Pending";
import { GetPoolsQuery, useGetPoolsQuery } from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<FromArray<GetPoolsQuery["pools"]>>;

// callbacks extracted to separate function to stabilize memoized component
function poolCandidatesLinkAccessor(
  poolCandidatesTableUrl: string,
  intl: IntlShape,
) {
  return (
    <Link
      href={poolCandidatesTableUrl}
      type="button"
      mode="inline"
      color="primary"
      data-h2-padding="base(0)"
    >
      {intl.formatMessage({
        defaultMessage: "View Candidates",
        description: "Text for a link to the Pool Candidates table",
      })}
    </Link>
  );
}

function viewLinkAccessor(
  editUrlRoot: string,
  id: string,
  title: string | undefined | null,
) {
  return (
    <Link href={`${editUrlRoot}/${id}`} type="link">
      {title}
    </Link>
  );
}

export const PoolTable: React.FC<GetPoolsQuery & { editUrlRoot: string }> = ({
  pools,
  editUrlRoot,
}) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Id",
          description:
            "Title displayed on the Pool table Unique Identifier column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Candidates",
          description:
            "Header for the View Candidates column of the Pools table",
        }),
        accessor: (pool) =>
          poolCandidatesLinkAccessor(paths.poolCandidateTable(pool.id), intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Pool Name",
          description: "Title displayed for the Pool table pool name column.",
        }),
        accessor: (d) =>
          viewLinkAccessor(
            editUrlRoot,
            d.id,
            d.name ? d.name[getLocale(intl)] : "",
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Owner",
          description: "Title displayed for the Pool table owner email column.",
        }),
        accessor: ({ owner }) => owner?.email,
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Group and Level",
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
                {`${classification?.group}-${classification?.level}`}
              </Pill>
            );
          }),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Status",
          description: "Title displayed for the Pool table status column.",
        }),
        accessor: "status",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          description: "Title displayed for the Pool table Edit column.",
        }),
        accessor: (d) => tableEditButtonAccessor(d.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, paths],
  );

  const data = useMemo(() => pools.filter(notEmpty), [pools]);

  return (
    <div data-h2-padding="base(0, 0, x3, 0)">
      <div data-h2-container="base(center, large, x2)">
        <Table
          data={data}
          columns={columns}
          hiddenCols={["id", "description"]}
        />
      </div>
    </div>
  );
};

export const PoolTableApi: React.FunctionComponent = () => {
  const [result] = useGetPoolsQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  return (
    <Pending fetching={fetching} error={error}>
      <PoolTable pools={data?.pools ?? []} editUrlRoot={pathname} />
    </Pending>
  );
};
