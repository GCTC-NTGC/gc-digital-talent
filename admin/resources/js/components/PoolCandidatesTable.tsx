import React, { useMemo } from "react";
import { GetPoolCandidatesQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table, { FilterableColumn } from "./Table";

const ClassificationTable: React.FC<GetPoolCandidatesQuery> = ({
  poolCandidates,
}) => {
  const columns: Array<FilterableColumn> = useMemo(
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
        Header: "User",
        accessor: "user.email",
      },
      {
        Header: "Expiry",
        accessor: "expiryDate",
      },
      {
        Header: "Woman",
        accessor: (d) => (d ? "Y" : "N"),
      },
      {
        Header: "Disability",
        accessor: (d) => (d ? "Y" : "N"),
      },
      {
        Header: "Indigenous",
        accessor: (d) => (d ? "Y" : "N"),
      },
      {
        Header: "Visible Minority",
        accessor: (d) => (d ? "Y" : "N"),
      },
      {
        Header: "Diploma",
        accessor: (d) => (d ? "Y" : "N"),
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
