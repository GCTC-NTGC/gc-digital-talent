import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Link, useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import { getLanguage } from "@common/constants/localizedConstants";
import { useAdminRoutes } from "../../adminRoutes";
import { AllUsersQuery, Language, useAllUsersQuery } from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../Table";
import DashboardContentContainer from "../DashboardContentContainer";

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

const profileLinkAccessor = (
  profileLink: string,
  email: string,
  intl: IntlShape,
) => {
  return (
    <Link
      href={profileLink}
      title={intl.formatMessage({
        defaultMessage: "Link to user profile",
        description: "Descriptive title for an anchor link",
      })}
    >
      {email}
    </Link>
  );
};

export const UserTable: React.FC<AllUsersQuery & { editUrlRoot: string }> = ({
  users,
  editUrlRoot,
}) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
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
        accessor: (user) =>
          profileLinkAccessor(
            paths.userProfile(user.id),
            user.email ?? "email",
            intl,
          ),
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
    [editUrlRoot, intl, paths],
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
