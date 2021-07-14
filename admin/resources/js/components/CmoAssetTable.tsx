import React, { useMemo } from "react";
import { GetCmoAssetsQuery, useGetCmoAssetsQuery } from "../api/generated";
import { navigate, useLocation } from "../helpers/router";
import { notEmpty } from "../helpers/util";
import { FromArray } from "../types/utilityTypes";
import Button from "./H2Components/Button";
import Table, { ColumnsOf } from "./Table";

type Data = NonNullable<FromArray<GetCmoAssetsQuery["cmoAssets"]>>;

export const CmoAssetTable: React.FC<
  GetCmoAssetsQuery & { editUrlRoot: string }
> = ({ cmoAssets, editUrlRoot }) => {
  const columns = useMemo<ColumnsOf<Data>>(
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
        id: "name",
        accessor: (d) => d.name?.en,
      },
      {
        Header: "Description",
        id: "description",
        accessor: (d) => d.description?.en,
      },
      {
        Header: "Edit",
        id: "edit",
        accessor: ({ id }) => (
          <Button
            color="white"
            mode="solid"
            onClick={(event) => {
              event.preventDefault();
              navigate(`${editUrlRoot}/${id}/edit`);
            }}
          >
            Edit
          </Button>
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
