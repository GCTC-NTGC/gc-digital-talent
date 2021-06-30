import React, { useMemo } from "react";
import { Column } from "react-table";
import {
  GetOperationalRequirementsQuery,
  useGetOperationalRequirementsQuery,
} from "../api/generated";
import { Link, useLocation } from "../helpers/router";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

export const OperationalRequirementTable: React.FC<
  GetOperationalRequirementsQuery & { editUrlRoot: string }
> = ({ operationalRequirements, editUrlRoot }) => {
  const columns: Array<Column<any>> = useMemo(
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

      {
        Header: "Edit",
        id: "edit",
        accessor: ({ id }) => (
          <Link href={`${editUrlRoot}/${id}/edit`} title="">
            Edit
          </Link>
        ),
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
  const { pathname } = useLocation();

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <OperationalRequirementTable
      operationalRequirements={data?.operationalRequirements ?? []}
      editUrlRoot={pathname}
    />
  );
};
