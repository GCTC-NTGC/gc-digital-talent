import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { Pill } from "@common/components";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { getLocale } from "@common/helpers/localize";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import { GetPoolsQuery, useGetPoolsQuery } from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import DashboardContentContainer from "../DashboardContentContainer";
import { tableEditButtonAccessor } from "../TableEditButton";

type Data = NonNullable<FromArray<GetPoolsQuery["pools"]>>;

export const PoolTable: React.FC<GetPoolsQuery & { editUrlRoot: string }> = ({
  pools,
  editUrlRoot,
}) => {
  const intl = useIntl();
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
          defaultMessage: "Key",
          description: "Title displayed for the Pool table key column.",
        }),
        accessor: "key",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Pool Name",
          description: "Title displayed for the Pool table pool name column.",
        }),
        accessor: (d) => (d.name ? d.name[getLocale(intl)] : ""),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Pool Description",
          description:
            "Title displayed for the Pool table pool description column.",
        }),
        accessor: (d) => (d.description ? d.description[getLocale(intl)] : ""),
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
          defaultMessage: "Edit",
          description: "Title displayed for the Pool table Edit column.",
        }),
        accessor: (d) => tableEditButtonAccessor(d.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl],
  );

  const data = useMemo(() => pools.filter(notEmpty), [pools]);

  return (
    <Table data={data} columns={columns} hiddenCols={["id", "description"]} />
  );
};

export const PoolTableApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useGetPoolsQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
        </p>
      </DashboardContentContainer>
    );

  return <PoolTable pools={data?.pools ?? []} editUrlRoot={pathname} />;
};
