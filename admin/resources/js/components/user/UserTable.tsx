import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import { getLanguage } from "@common/constants/localizedConstants";
import { AllUsersQuery, Language, useAllUsersQuery } from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import DashboardContentContainer from "../DashboardContentContainer";
import { tableEditButtonAccessor } from "../TableEditButton";

type Data = NonNullable<FromArray<AllUsersQuery["users"]>>;

// callbacks extracted to separate function to stabilize memoized component
const languageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {language ? intl.formatMessage(getLanguage(language as string)) : ""}
  </span>
);

export const UserTable: React.FC<AllUsersQuery & { editUrlRoot: string }> = ({
  users,
  editUrlRoot,
}) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "First Name",
          description: "Title displayed on the User table First Name column.",
        }),
        accessor: "firstName",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Last Name",
          description: "Title displayed for the User table Last Name column.",
        }),
        accessor: "lastName",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Email",
          description: "Title displayed for the User table Email column.",
        }),
        accessor: "email",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Telephone",
          description: "Title displayed for the User table Telephone column.",
        }),
        accessor: "telephone",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Preferred Language",
          description:
            "Title displayed for the User table Preferred Language column.",
        }),
        accessor: (user) => languageAccessor(user.preferredLang, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          description: "Title displayed for the User table Edit column.",
        }),
        accessor: (d) => tableEditButtonAccessor(d.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl],
  );

  const data = useMemo(() => users.filter(notEmpty), [users]);

  return <Table data={data} columns={columns} />;
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
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
        </p>
      </DashboardContentContainer>
    );

  return <UserTable users={data?.users ?? []} editUrlRoot={pathname} />;
};
