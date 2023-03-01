import * as React from "react";
import { IntlShape, useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import { Heading, Pending, Pill, ThrowNotFound } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import { Maybe, Role, Scalars, Team, User } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";

import EditTeamMemberDialog from "./components/EditTeamMemberDialog";
import RemoveTeamMemberDialog from "./components/RemoveTeamMemberDialog";

const actionCell = (user: User, team: Team, roles: Array<Role>) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-gap="base(x.25)"
  >
    <EditTeamMemberDialog user={user} team={team} availableRoles={roles} />
    <RemoveTeamMemberDialog user={user} team={team} roles={roles} />
  </div>
);

const emailLinkCell = (email: Maybe<string>, intl: IntlShape) => {
  if (email) {
    return <a href={`mailto:${email}`}>{email}</a>;
  }

  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
};

const roleCell = (roles: Maybe<Maybe<Role>[]>, intl: IntlShape) => {
  const rolePills = roles
    ?.filter(notEmpty)
    .filter((r) => r.isTeamBased)
    .map((role) => (
      <Pill color="neutral" mode="solid" key={role.id}>
        {getLocalizedName(role.displayName, intl)}
      </Pill>
    ));

  return rolePills ? <span>{rolePills}</span> : null;
};

type TeamMemberCell = Cell<User>;
interface TeamMembersProps {
  members: Array<User>;
  roles: Array<Role>;
  team: Team;
}

const TeamMembers = ({ members, roles, team }: TeamMembersProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Team members",
    id: "6rb9mg",
    description: "Page title for the view team members page",
  });

  const columns = React.useMemo<ColumnsOf<User>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "OxeGLu",
          description: "Title displayed for the team table actions column",
        }),
        accessor: (d) => `Actions ${d.id}`,
        Cell: ({ row: { original: user } }: TeamMemberCell) =>
          actionCell(user, team, roles),
        disableGlobalFilter: true,
        disableSortBy: true,
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          id: "AUOq9D",
          description:
            "Title displayed for the team members table Name column.",
        }),
        accessor: (d) => getFullNameLabel(d.firstName, d.lastName, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Email",
          id: "3/lHSy",
          description:
            "Title displayed for the team members table email column.",
        }),
        accessor: (d) => d.email,
        Cell: ({ value }: TeamMemberCell) => emailLinkCell(value, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Membership roles",
          id: "4Washm",
          description:
            "Title displayed for the team members table roles column.",
        }),
        accessor: (d) => d.id, // TO DO: Update with real role shape
        Cell: ({ row: { original: user } }: TeamMemberCell) =>
          roleCell([], intl),
      },
    ],
    [intl, roles, team],
  );

  const data = React.useMemo(() => members.filter(notEmpty), [members]);

  return (
    <>
      <SEO title={pageTitle} />
      <Heading level="h2">{pageTitle}</Heading>
      <Table data={data} columns={columns} />
    </>
  );
};

type RouteParams = {
  teamId: Scalars["ID"];
};

const TeamMembersPage = () => {
  const { teamId } = useParams<RouteParams>();
  // const [{ data, fetching, error }] = useListMembersQuery({
  //   variables: { id: teamId || "" },
  // });
  const [{ data, fetching, error }] = [
    {
      fetching: false,
      error: undefined,
      data: {
        team: {
          users: [
            {
              id: "id",
              firstName: "John",
              lastName: "Doe",
              email: "john@doe.com",
              roles: [
                {
                  name: "team_admin",
                  displayName: {
                    en: "Team Administrator (EN)",
                    fr: "Team Administrator (EN)",
                  },
                },
              ],
            },
          ],
        },
      },
    },
  ];

  const team = {
    id: "ID",
    name: "team",
    displayName: {
      en: "Team (EN)",
      fr: "Team (FR)",
    },
  };

  const users = data?.team?.users;

  return (
    <Pending fetching={fetching} error={error}>
      {users ? (
        <TeamMembers members={users} roles={[]} team={team} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default TeamMembersPage;
