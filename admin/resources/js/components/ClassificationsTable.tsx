import React, { useMemo } from "react";
import { Column } from "react-table";
import { GetClassificationsQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

const ClassificationTable: React.FC<GetClassificationsQuery> = ({
  classifications,
}) => {
  const columns: Array<Column> = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name.en",
      },
      {
        Header: "Group",
        accessor: "group",
      },
      {
        Header: "Level",
        accessor: "level",
      },
      {
        Header: "Minimum Salary",
        accessor: "minSalary",
      },
      {
        Header: "Maximum Salary",
        accessor: "maxSalary",
      },
    ],
    [],
  );

  const memoizedData = useMemo(
    () => classifications.filter(notEmpty),
    [classifications],
  );

  return (
    <>
      <Table data={memoizedData} columns={columns} />
    </>
  );
};

export default ClassificationTable;
