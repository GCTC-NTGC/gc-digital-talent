import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import Pending from "@common/components/Pending";
import { GetCmoAssetsQuery, useGetCmoAssetsQuery } from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<FromArray<GetCmoAssetsQuery["cmoAssets"]>>;

export const CmoAssetTable: React.FC<
  GetCmoAssetsQuery & { editUrlRoot: string }
> = ({ cmoAssets, editUrlRoot }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "ID",
          id: "FvnSwn",
          description: "Title displayed on the CMO Asset table ID column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Key",
          id: "CcOlo0",
          description: "Title displayed for the CMO Asset table Key column.",
        }),
        accessor: "key",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          id: "4XF9kF",
          description: "Title displayed for the CMO Asset table Name column.",
        }),
        accessor: (d) => d.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Description",
          id: "ZZaEho",
          description:
            "Title displayed for the CMO Asset table Description column.",
        }),
        accessor: (d) => d.description?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "z2m2Gp",
          description: "Title displayed for the CMO Asset table Edit column.",
        }),
        accessor: (d) =>
          tableEditButtonAccessor(d.id, editUrlRoot, d.name?.[locale]), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, locale],
  );

  const memoizedData = useMemo(() => cmoAssets.filter(notEmpty), [cmoAssets]);

  return (
    <Table
      data={memoizedData}
      columns={columns}
      addBtn={{
        path: paths.cmoAssetCreate(),
        label: intl.formatMessage({
          defaultMessage: "Create CMO Asset",
          id: "7iglPJ",
          description: "Heading displayed above the Create CMO Asset form.",
        }),
      }}
    />
  );
};

export const CmoAssetTableApi: React.FC = () => {
  const [result] = useGetCmoAssetsQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  return (
    <Pending fetching={fetching} error={error}>
      <CmoAssetTable cmoAssets={data?.cmoAssets ?? []} editUrlRoot={pathname} />
    </Pending>
  );
};
