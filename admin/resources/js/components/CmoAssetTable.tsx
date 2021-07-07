import React, { useMemo } from "react";
import { GetCmoAssetsQuery, useGetCmoAssetsQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import { FromArray } from "../types/utilityTypes";
import Table, { ColumnsOf } from "./Table";

type Data = NonNullable<FromArray<GetCmoAssetsQuery["cmoAssets"]>>;

export const CmoAssetTable: React.FC<GetCmoAssetsQuery> = ({ cmoAssets }) => {
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
    ],
    [],
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

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return <CmoAssetTable cmoAssets={data?.cmoAssets ?? []} />;
};
