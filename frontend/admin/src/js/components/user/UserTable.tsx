import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Link, useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLanguage } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { useAdminRoutes } from "../../adminRoutes";
import {
  AllUsersQuery,
  Language,
  Maybe,
  useGetUsersPaginatedQuery,
  User,
  UserFilterAndOrderInput,
} from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../Table";
import { SearchBy } from "../Table/SearchForm";

type Data = NonNullable<FromArray<AllUsersQuery["users"]>>;

interface FilterInput {
  search: Maybe<SearchBy>;
}

const filtersToQueryArgs = (
  input: FilterInput,
): UserFilterAndOrderInput | undefined => {
  if (!input || typeof input === "undefined") {
    return undefined;
  }

  const { search } = input;

  return {
    generalSearch: search?.term && !search?.column ? search.term : undefined,
    email: search?.column === "email" ? search.term : undefined,
    name: search?.column === "name" ? search.term : undefined,
    telephone: search?.column === "phone" ? search.term : undefined,
  };
};

const queryArgsToSearchTerm = (
  input: UserFilterAndOrderInput | undefined,
): Maybe<SearchBy> => {
  if (input?.generalSearch) {
    return {
      column: undefined,
      term: input.generalSearch,
    };
  }
  if (input?.email) {
    return {
      column: "email",
      term: input.email,
    };
  }
  if (input?.name) {
    return {
      column: "name",
      term: input.name,
    };
  }
  if (input?.telephone) {
    return {
      column: "phone",
      term: input.telephone,
    };
  }

  return {
    column: undefined,
    term: undefined,
  };
};

const fullName = (u: User): string => `${u.firstName} ${u.lastName}`;

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

interface UserTableProps {
  users: Array<User | null>;
  editUrlRoot: string;
  onSearch: (by: FilterInput) => void;
  search: Maybe<SearchBy>;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  editUrlRoot,
  onSearch,
  search,
}) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Candidate Name",
          description:
            "Title displayed on the User table Candidate Name column.",
        }),
        accessor: (user) => fullName(user),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Email",
          description: "Title displayed for the User table Email column.",
        }),
        accessor: (user) =>
          profileLinkAccessor(
            paths.userView(user.id),
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
        accessor: (d) =>
          tableEditButtonAccessor(d.id, editUrlRoot, fullName(d)), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, paths],
  );

  const data = useMemo(() => users.filter(notEmpty), [users]);

  const handleSearch = (by: Maybe<SearchBy>) => {
    if (onSearch) {
      onSearch({
        search: by,
      });
    }
  };

  return (
    <Table
      data={data}
      columns={columns}
      title={intl.formatMessage({
        defaultMessage: "All users",
        description: "Title for the admin users table",
      })}
      onSearch={handleSearch}
      initialFilters={{ searchTerm: search }}
      searchBy={[
        {
          value: "name",
          label: intl.formatMessage({
            defaultMessage: "Name",
            description:
              "Text displayed in user table search form dropdown for name column",
          }),
        },
        {
          value: "email",
          label: intl.formatMessage({
            defaultMessage: "Email",
            description:
              "Text displayed in user table search form dropdown for email column",
          }),
        },
        {
          value: "phone",
          label: intl.formatMessage({
            defaultMessage: "Phone number",
            description:
              "Text displayed in user table search form dropdown for phone number column",
          }),
        },
      ]}
      addBtn={{
        label: intl.formatMessage({
          defaultMessage: "New user",
          description: "Text label for link to create new user on admin table",
        }),
        path: paths.userCreate(),
      }}
    />
  );
};

export const UserTableApi: React.FunctionComponent = () => {
  const { pathname } = useLocation();
  const [filters, setFilters] = React.useState<
    UserFilterAndOrderInput | undefined
  >(undefined);

  const [{ data, fetching, error }] = useGetUsersPaginatedQuery({
    variables: {
      where: filters,
    },
  });

  const handleSearch = (input: FilterInput) => {
    const newFilters = filtersToQueryArgs(input);
    setFilters(newFilters);
  };

  return (
    <Pending fetching={fetching} error={error}>
      <UserTable
        users={data?.usersPaginated?.data ?? []}
        editUrlRoot={pathname}
        onSearch={handleSearch}
        search={queryArgsToSearchTerm(filters)}
      />
    </Pending>
  );
};
