import React, { useMemo } from "react";
import { Column } from "react-table";
import { AllUsersQuery, useAllUsersQuery, User } from "../api/generated";
import { Link, useLocation } from "../helpers/router";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

export const UserTable: React.FC<AllUsersQuery & { editUrlRoot: string }> = ({
  users,
  editUrlRoot,
}) => {
  const columns: Array<Column<User>> = useMemo(
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
      {
        Header: "",
        id: "edit",
        accessor: ({ id }) => (
          <Link href={`${editUrlRoot}/${id}/edit`} title="">
            Edit
          </Link>
        ),
      },
    ],
    [editUrlRoot],
  );

  const data = useMemo(() => users.filter(notEmpty), [users]);

  return (
    <>
      <Table data={data} columns={columns} />
    </>
  );
};

export const ApiUserTable: React.FunctionComponent = () => {
  const [result] = useAllUsersQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  return <UserTable users={data?.users ?? []} editUrlRoot={pathname} />;
};
