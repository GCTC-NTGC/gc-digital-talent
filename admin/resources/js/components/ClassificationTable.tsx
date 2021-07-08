import React, { useMemo } from "react";
import {
  GetClassificationsQuery,
  useGetClassificationsQuery,
} from "../api/generated";
import { notEmpty } from "../helpers/util";
import { FromArray } from "../types/utilityTypes";
import Table, { ColumnsOf } from "./Table";

type Data = NonNullable<FromArray<GetClassificationsQuery["classifications"]>>;

export const ClassificationTable: React.FC<GetClassificationsQuery> = ({
  classifications,
}) => {
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        id: "name",
        accessor: (d) => d.name?.en,
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
      <Table
        data={memoizedData}
        columns={columns}
        hiddenCols={["minSalary", "maxSalary"]}
      />
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
