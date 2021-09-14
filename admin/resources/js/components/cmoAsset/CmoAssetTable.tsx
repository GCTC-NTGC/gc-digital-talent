import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Button } from "@common/components";
import {
  navigate,
  useLocation,
  notEmpty,
} from "@common/helpers";
import { commonMessages } from "@common/messages";
import { GetCmoAssetsQuery, useGetCmoAssetsQuery } from "../../api/generated";
import { FromArray } from "../../types/utilityTypes";
import DashboardContentContainer from "../DashboardContentContainer";
import Table, { ColumnsOf } from "../Table";

const messages = defineMessages({
  columnIdTitle: {
    id: "cmoAssetTable.column.idTitle",
    defaultMessage: "ID",
    description: "Title displayed on the CMO Asset table ID column.",
  },
  columnKeyTitle: {
    id: "cmoAssetTable.column.keyTitle",
    defaultMessage: "Key",
    description: "Title displayed for the CMO Asset table Key column.",
  },
  columnNameTitle: {
    id: "cmoAssetTable.column.nameTitle",
    defaultMessage: "Name",
    description: "Title displayed for the CMO Asset table Name column.",
  },
  columnDescriptionTitle: {
    id: "cmoAssetTable.column.descriptionTitle",
    defaultMessage: "Level",
    description: "Title displayed for the CMO Asset table Description column.",
  },
  columnEditTitle: {
    id: "cmoAssetTable.column.editTitle",
    defaultMessage: "Edit",
    description: "Title displayed for the CMO Asset table Edit column.",
  },
});

type Data = NonNullable<FromArray<GetCmoAssetsQuery["cmoAssets"]>>;

export const CmoAssetTable: React.FC<
  GetCmoAssetsQuery & { editUrlRoot: string }
> = ({ cmoAssets, editUrlRoot }) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnIdTitle),
        accessor: "id",
      },
      {
        Header: intl.formatMessage(messages.columnKeyTitle),
        accessor: "key",
      },
      {
        Header: intl.formatMessage(messages.columnNameTitle),
        id: "name",
        accessor: (d) => d.name?.en,
      },
      {
        Header: intl.formatMessage(messages.columnDescriptionTitle),
        id: "description",
        accessor: (d) => d.description?.en,
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
        id: "edit",
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

  const memoizedData = useMemo(() => cmoAssets.filter(notEmpty), [cmoAssets]);

  return (
    <>
      <Table data={memoizedData} columns={columns} />
    </>
  );
};

export const CmoAssetTableApi: React.FC = () => {
  const intl = useIntl();
  const [result] = useGetCmoAssetsQuery();
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

  return (
    <CmoAssetTable cmoAssets={data?.cmoAssets ?? []} editUrlRoot={pathname} />
  );
};
