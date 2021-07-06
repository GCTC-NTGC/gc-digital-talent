import React, { useMemo } from "react";
import { Column } from "react-table";
import { GetCmoAssetsQuery, useGetCmoAssetsQuery } from "../api/generated";
import { Link, useLocation } from "../helpers/router";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

export const CmoAssetTable: React.FC<
  GetCmoAssetsQuery & { editUrlRoot: string }
> = ({ cmoAssets, editUrlRoot }) => {
  const columns: Array<Column<any>> = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Key",
        accessor: "key",
      },
      {
        Header: "Name",
        accessor: "name.en",
      },
      {
        Header: "Description",
        accessor: "description.en",
      },
      {
        Header: "Edit",
        id: "edit",
        accessor: ({ id }) => (
          <Link href={`${editUrlRoot}/${id}/edit`} title="">
            Edit
          </Link>
        ),
      },
    ],
    [editUrlRoot],
  );

  const memoizedData = useMemo(() => cmoAssets.filter(notEmpty), [cmoAssets]);

  return (
    <>
      <Table data={memoizedData} columns={columns} />
    </>
  );
};

export const CmoAssetTableApi: React.FC = () => {
  const [result] = useGetCmoAssetsQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <CmoAssetTable cmoAssets={data?.cmoAssets ?? []} editUrlRoot={pathname} />
  );
};
