import React, { useMemo } from "react";
import {
  GetOperationalRequirementsQuery,
  useGetOperationalRequirementsQuery,
} from "../api/generated";
import { notEmpty } from "../helpers/util";
import { FromArray } from "../types/utilityTypes";
import Table, { ColumnsOf } from "./Table";

type Data = NonNullable<
  FromArray<GetOperationalRequirementsQuery["operationalRequirements"]>
>;

export const OperationalRequirementTable: React.FC<GetOperationalRequirementsQuery> =
  ({ operationalRequirements }) => {
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
