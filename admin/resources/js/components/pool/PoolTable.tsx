import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Button, Pill } from "@common/components";
import { navigate, useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { getLocale } from "@common/helpers/localize";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import { GetPoolsQuery, useGetPoolsQuery } from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import DashboardContentContainer from "../DashboardContentContainer";

const messages = defineMessages({
  columnUniqueIdentifier: {
    defaultMessage: "Id",
    description: "Title displayed on the Pool table Unique Identifier column.",
  },
  columnPoolName: {
    defaultMessage: "Pool Name",
    description: "Title displayed for the Pool table pool name column.",
  },
  columnPoolKey: {
    defaultMessage: "Key",
    description: "Title displayed for the Pool table key column.",
  },
  columnPoolDescription: {
    defaultMessage: "Pool Description",
    description: "Title displayed for the Pool table pool description column.",
  },
  columnOwnerEmail: {
    defaultMessage: "Owner",
    description: "Title displayed for the Pool table owner email column.",
  },
  columnGroupAndLevel: {
    defaultMessage: "Group and Level",
    description: "Title displayed for the Pool table Group and Level column.",
  },
  columnEditTitle: {
    defaultMessage: "Edit",
    description: "Title displayed for the Pool table Edit column.",
  },
});

type Data = NonNullable<FromArray<GetPoolsQuery["pools"]>>;

export const PoolTable: React.FC<GetPoolsQuery & { editUrlRoot: string }> = ({
  pools,
  editUrlRoot,
}) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnUniqueIdentifier),
        accessor: "id",
      },
      {
        Header: intl.formatMessage(messages.columnPoolKey),
        accessor: "key",
      },
      {
        Header: intl.formatMessage(messages.columnPoolName),
        accessor: (d) => (d.name ? d.name[getLocale(intl)] : ""),
      },
      {
        Header: intl.formatMessage(messages.columnPoolDescription),
        accessor: (d) => (d.description ? d.description[getLocale(intl)] : ""),
      },
      {
        Header: intl.formatMessage(messages.columnOwnerEmail),
        accessor: ({ owner }) => owner?.email,
      },
      {
        Header: intl.formatMessage(messages.columnGroupAndLevel),
        accessor: ({ classifications }) =>
          classifications?.map((classification) => {
            return (
              <Pill
                key={`${classification?.group}-${classification?.level}`}
                content={`${classification?.group}-${classification?.level}`}
              />
            );
          }),
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
        accessor: ({ id }) => (
          <Button
            color="primary"
            mode="inline"
            onClick={(event) => {
              event.preventDefault();
              navigate(`${editUrlRoot}/${id}/edit`);
            }}
          >
            {intl.formatMessage(messages.columnEditTitle)}
          </Button>
        ),
      },
    ],
    [editUrlRoot, intl],
  );

  const data = useMemo(() => pools.filter(notEmpty), [pools]);

  return (
    <>
      <Table data={data} columns={columns} hiddenCols={["id", "description"]} />
    </>
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
          {intl.formatMessage(commonMessages.loadingError)} {error.message}
        </p>
      </DashboardContentContainer>
    );

  return <PoolTable pools={data?.pools ?? []} editUrlRoot={pathname} />;
};
