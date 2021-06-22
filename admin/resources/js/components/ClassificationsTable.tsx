import React, { useMemo } from "react";
import { Column } from "react-table";
import { GetClassificationsQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

const ClassificationTable: React.FC<GetClassificationsQuery> = ({
  classifications,
}) => {
  type FilterableColumn = Column & { isVisible: boolean };

  const columns: Array<FilterableColumn> = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        isVisible: true,
      },
      {
        Header: "Name",
        accessor: "name.en",
        isVisible: true,
      },
      {
        Header: "Group",
        accessor: "group",
        isVisible: true,
      },
      {
        Header: "Level",
        accessor: "level",
        isVisible: true,
      },
      {
        Header: "Minimum Salary",
        accessor: "minSalary",
        isVisible: false,
      },
      {
        Header: "Maximum Salary",
        accessor: "maxSalary",
        isVisible: false,
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
