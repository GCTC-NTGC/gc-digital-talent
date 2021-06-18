import React, { useMemo } from "react";
import { Column } from "react-table";
import { GetPoolCandidatesQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

const ClassificationTable: React.FC<GetPoolCandidatesQuery> = ({
  poolCandidates,
}) => {
  const columns: Array<Column> = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "cmoIdentifier",
      },
      {
        Header: "Pool",
        accessor: "pool.name.en",
      },
      {
        Header: "user",
        accessor: "user.email",
      },
      {
        Header: "Expiry",
        accessor: "expiryDate",
      },
      {
        Header: "Woman",
        accessor: "isWoman",
      },
      {
        Header: "Disability",
        accessor: "hasDisability",
      },
      {
        Header: "Indigenous",
        accessor: "isIndigenous",
      },
      {
        Header: "Visible Minority",
        accessor: "isVisibleMinority",
      },
      {
        Header: "Diploma",
        accessor: "hasDiploma",
      },
      {
        Header: "Language",
        accessor: "languageAbility",
      },
    ],
    [],
  );

  const memoizedData = useMemo(
    () => poolCandidates.filter(notEmpty),
    [poolCandidates],
  );

  return (
    <>
      <Table data={memoizedData} columns={columns} />
    </>
  );
};

export default ClassificationTable;
