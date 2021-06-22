import React, { useMemo } from "react";
import { Column } from "react-table";
import { GetClassificationsQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table, { FilterableColumn } from "./Table";

const ClassificationTable: React.FC<GetClassificationsQuery> = ({
  classifications,
}) => {
  const columns: Array<FilterableColumn> = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        showCol: true,
      },
      {
        Header: "Name",
        accessor: "name.en",
        showCol: true,
      },
      {
        Header: "Group",
        accessor: "group",
        showCol: true,
      },
      {
        Header: "Level",
        accessor: "level",
        showCol: true,
      },
      {
        Header: "Minimum Salary",
        accessor: "minSalary",
        showCol: false,
      },
      {
        Header: "Maximum Salary",
        accessor: "maxSalary",
        showCol: false,
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
