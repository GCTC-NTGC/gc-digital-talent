import React, { useMemo } from "react";
import { Column } from "react-table";
import { AllUsersQuery, useAllUsersQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

export const UserTable: React.FC<AllUsersQuery> = ({ users }) => {
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

export const UserTableNetworked: React.FunctionComponent = () => {
  const [result, _reexecuteQuery] = useAllUsersQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  return <UserTable users={data?.users ?? []} />;
};

export default UserTableNetworked;
