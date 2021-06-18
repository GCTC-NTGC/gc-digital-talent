import React, { useMemo } from "react";
import { Column } from "react-table";
import { GetCmoAssetsQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

const CmoAssetTable: React.FC<GetCmoAssetsQuery> = ({ cmoAssets }) => {
  const columns: Array<Column> = useMemo(
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

export default CmoAssetTable;
