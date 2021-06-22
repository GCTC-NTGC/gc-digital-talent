import React, { useMemo } from "react";
import { Column } from "react-table";
import {
  GetOperationalRequirementsQuery,
  useGetOperationalRequirementsQuery,
} from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

export const OperationalRequirementTable: React.FC<GetOperationalRequirementsQuery> =
  ({ operationalRequirements }) => {
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

    const memoizedData = useMemo(
      () => operationalRequirements.filter(notEmpty),
      [operationalRequirements],
    );

    return (
      <>
        <Table data={memoizedData} columns={columns} />
      </>
    );
  };

export const OperationalRequirementTableApi: React.FC = () => {
  const [result] = useGetOperationalRequirementsQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <OperationalRequirementTable
      operationalRequirements={data?.operationalRequirements ?? []}
    />
  );
};
