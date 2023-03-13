import * as React from "react";
import { IntlShape, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import orderBy from "lodash/orderBy";

import { Heading, Pending, Pill, ThrowNotFound } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import {
  Maybe,
  Role,
  Scalars,
  Team,
  useAllUsersQuery,
  useGetTeamQuery,
  useListRolesQuery,
  User,
} from "~/api/generated";
import { getFullNameLabel } from "~/utils/nameUtils";
import { groupRoleAssignmentsByUser, TeamMember } from "~/utils/teamUtils";

import AddTeamMemberDialog from "./components/AddTeamMemberDialog";
import EditTeamMemberDialog from "./components/EditTeamMemberDialog";
import RemoveTeamMemberDialog from "./components/RemoveTeamMemberDialog";

const orderRoles = (roles: Array<Role>, intl: IntlShape) => {
  return orderBy(roles, ({ displayName }) => {
    const value = getLocalizedName(displayName, intl);

    return value
      ? value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase()
      : value;
  });
};

const actionCell = (user: TeamMember, team: Team, roles: Array<Role>) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-gap="base(x.25)"
  >
    <EditTeamMemberDialog user={user} team={team} availableRoles={roles} />
    <RemoveTeamMemberDialog user={user} team={team} />
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
  const nonEmptyRoles = roles?.filter(notEmpty);
  const rolePills = nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl).map((role) => (
        <Pill color="neutral" mode="solid" key={role.id}>
          {getLocalizedName(role.displayName, intl)}
        </Pill>
      ))
    : null;

  return rolePills ? (
    <span data-h2-display="base(flex)" data-h2-gap="base(x.25)">
      {rolePills}
    </span>
  ) : null;
};

const roleAccessor = (roles: Maybe<Maybe<Role>[]>, intl: IntlShape) => {
  const nonEmptyRoles = roles?.filter(notEmpty);

  return nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl)
        .map((role) => getLocalizedName(role.displayName, intl))
        .join(", ")
    : "";
};

type TeamMemberCell = Cell<TeamMember>;
interface TeamMembersProps {
  members: Array<TeamMember>;
  availableUsers: Array<User>;
  roles: Array<Role>;
  team: Team;
}

const TeamMembers = ({
  members,
  roles,
  team,
  availableUsers,
}: TeamMembersProps) => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Team members",
    id: "6rb9mg",
    description: "Page title for the view team members page",
  });

  const columns = React.useMemo<ColumnsOf<TeamMember>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "OxeGLu",
          description: "Title displayed for the team table actions column",
        }),
        accessor: (d) => `Actions ${d.id}`,
        Cell: ({ row: { original: member } }: TeamMemberCell) =>
          actionCell(member, team, roles),
        disableGlobalFilter: true,
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
        accessor: (d) => roleAccessor(d.roles, intl),
        Cell: ({ row: { original: member } }: TeamMemberCell) =>
          roleCell(member.roles, intl),
      },
    ],
    [intl, roles, team],
  );

  const data = React.useMemo(() => members.filter(notEmpty), [members]);

  return (
    <>
      <SEO title={pageTitle} />
      <Heading level="h2">{pageTitle}</Heading>
      <Table
        data={data}
        columns={columns}
        addDialog={
          <AddTeamMemberDialog
            team={team}
            availableRoles={roles}
            availableUsers={availableUsers}
          />
        }
      />
    </>
  );
};

type RouteParams = {
  teamId: Scalars["ID"];
};

const TeamMembersPage = () => {
  const { teamId } = useParams<RouteParams>();
  const [{ data, fetching, error }] = useGetTeamQuery({
    variables: { teamId: teamId || "" },
  });
  const [{ data: rolesData, fetching: rolesFetching, error: rolesError }] =
    useListRolesQuery();
  const [{ data: userData, fetching: userFetching, error: userError }] =
    useAllUsersQuery();

  const team = data?.team;
  const roles = rolesData?.roles
    .filter(notEmpty)
    .filter((role) => role.isTeamBased);
  const users = groupRoleAssignmentsByUser(data?.team?.roleAssignments || []);
  const availableUsers = userData?.users
    ?.filter(notEmpty)
    .filter((user) => !users.find((teamUser) => teamUser.id === user?.id));

  return (
    <Pending
      fetching={fetching || rolesFetching || userFetching}
      error={error || rolesError || userError}
    >
      {team && users ? (
        <TeamMembers
          members={users}
          availableUsers={availableUsers || []}
          roles={roles || []}
          team={team}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default TeamMembersPage;
