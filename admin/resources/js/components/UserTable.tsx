import React, { useMemo } from "react";
import { useTable, useGlobalFilter, useSortBy, Column } from "react-table";
import { AllUsersQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

const UserTable: React.FC<AllUsersQuery> = ({ users }) => {
  const columns: Array<Column> = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Telephone",
        accessor: "telephone",
      },
      {
        Header: "Preferred Language",
        accessor: "preferredLang",
      },
    ],
    [],
  );

  const data = useMemo(() => users.filter(notEmpty), [users]);

  return (
    <>
      <Table data={data} columns={columns} />
    </>
  );
};

export default UserTable;
