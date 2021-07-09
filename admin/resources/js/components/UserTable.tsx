import React, { useMemo } from "react";
import { AllUsersQuery, useAllUsersQuery } from "../api/generated";
import { Link, useLocation } from "../helpers/router";
import { notEmpty } from "../helpers/util";
import { FromArray } from "../types/utilityTypes";
import Table, { ColumnsOf } from "./Table";

type Data = NonNullable<FromArray<AllUsersQuery["users"]>>;

export const UserTable: React.FC<AllUsersQuery & { editUrlRoot: string }> = ({
  users,
  editUrlRoot,
}) => {
  const columns = useMemo<ColumnsOf<Data>>(
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
        Header: "Edit",
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

export const UserTableApi: React.FunctionComponent = () => {
  const [result] = useAllUsersQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  return <UserTable users={data?.users ?? []} editUrlRoot={pathname} />;
};
