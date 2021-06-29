import React, { useMemo } from "react";
import {
  GetClassificationsQuery,
  useGetClassificationsQuery,
} from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table, { FilterableColumn } from "./Table";

export const ClassificationTable: React.FC<GetClassificationsQuery> = ({
  classifications,
}) => {
  const columns: Array<FilterableColumn<any>> = useMemo(
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

  const hiddenCols: string[] = [];
  columns.forEach((column) => {
    if (column.showCol === false && column.accessor) {
      hiddenCols.push(column.accessor.toString());
    }
  });

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

export const ClassificationTableApi: React.FunctionComponent = () => {
  const [result] = useGetClassificationsQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return <ClassificationTable classifications={data?.classifications ?? []} />;
};
