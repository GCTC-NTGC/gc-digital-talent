import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Button } from "@common/components";
import { navigate, useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import { AllUsersQuery, useAllUsersQuery } from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import DashboardContentContainer from "../DashboardContentContainer";

const messages = defineMessages({
  columnFirstNameTitle: {
    id: "userTable.column.firstNameTitle",
    defaultMessage: "First Name",
    description: "Title displayed on the User table First Name column.",
  },
  columnLastNameTitle: {
    id: "userTable.column.lastNameTitle",
    defaultMessage: "Last Name",
    description: "Title displayed for the User table Last Name column.",
  },
  columnEmailTitle: {
    id: "userTable.column.emailTitle",
    defaultMessage: "Email",
    description: "Title displayed for the User table Email column.",
  },
  columnTelephoneTitle: {
    id: "userTable.column.telephoneTitle",
    defaultMessage: "Telephone",
    description: "Title displayed for the User table Telephone column.",
  },
  columnPreferredLanguageTitle: {
    id: "userTable.column.preferredLanguageTitle",
    defaultMessage: "Preferred Language",
    description:
      "Title displayed for the User table Preferred Language column.",
  },
  columnEditTitle: {
    id: "userTable.column.editTitle",
    defaultMessage: "Edit",
    description: "Title displayed for the User table Edit column.",
  },
});

type Data = NonNullable<FromArray<AllUsersQuery["users"]>>;

export const UserTable: React.FC<AllUsersQuery & { editUrlRoot: string }> = ({
  users,
  editUrlRoot,
}) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnFirstNameTitle),
        accessor: "firstName",
      },
      {
        Header: intl.formatMessage(messages.columnLastNameTitle),
        accessor: "lastName",
      },
      {
        Header: intl.formatMessage(messages.columnEmailTitle),
        accessor: "email",
      },
      {
        Header: intl.formatMessage(messages.columnTelephoneTitle),
        accessor: "telephone",
      },
      {
        Header: intl.formatMessage(messages.columnPreferredLanguageTitle),
        accessor: "preferredLang",
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
        id: "edit",
        accessor: ({ id }) => (
          <Button
            color="primary"
            mode="inline"
            onClick={(event) => {
              event.preventDefault();
              navigate(`${editUrlRoot}/${id}/edit`);
            }}
          >
            {intl.formatMessage(messages.columnEditTitle)}
          </Button>
        ),
      },
    ],
    [editUrlRoot, intl],
  );

  const data = useMemo(() => users.filter(notEmpty), [users]);

  return (
    <>
      <Table data={data} columns={columns} />
    </>
  );
};

export const UserTableApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useAllUsersQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)} {error.message}
        </p>
      </DashboardContentContainer>
    );

  return <UserTable users={data?.users ?? []} editUrlRoot={pathname} />;
};
