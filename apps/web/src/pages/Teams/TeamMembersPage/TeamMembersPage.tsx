import * as React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import { Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import {
  Role,
  Scalars,
  Team,
  useAllUsersNamesQuery,
  useGetTeamQuery,
  useListRolesQuery,
  UserPublicProfile,
} from "~/api/generated";
import { getFullNameLabel } from "~/utils/nameUtils";
import { groupRoleAssignmentsByUser, TeamMember } from "~/utils/teamUtils";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";

import AddTeamMemberDialog from "./components/AddTeamMemberDialog";
import { actionCell, emailLinkCell, roleAccessor, roleCell } from "./helpers";

const columnHelper = createColumnHelper<TeamMember>();

interface TeamMembersProps {
  members: Array<TeamMember>;
  availableUsers: Array<UserPublicProfile> | null;
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

  const columns = [
    columnHelper.display({
      id: "actions",
      header: intl.formatMessage({
        defaultMessage: "Actions",
        id: "OxeGLu",
        description: "Title displayed for the team table actions column",
      }),
      cell: ({ row: { original: member } }) => actionCell(member, team, roles),
    }),
    columnHelper.accessor(
      (member) => getFullNameLabel(member.firstName, member.lastName, intl),
      {
        id: "name",
        header: intl.formatMessage({
          defaultMessage: "Name",
          id: "AUOq9D",
          description:
            "Title displayed for the team members table Name column.",
        }),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor("email", {
      id: "email",
      header: intl.formatMessage({
        defaultMessage: "Email",
        id: "3/lHSy",
        description: "Title displayed for the team members table email column.",
      }),
      cell: ({ row: { original: member } }) =>
        emailLinkCell(member.email, intl),
    }),
    columnHelper.accessor((member) => roleAccessor(member.roles, intl), {
      id: "roles",
      header: intl.formatMessage({
        defaultMessage: "Membership roles",
        id: "4Washm",
        description: "Title displayed for the team members table roles column.",
      }),
      cell: ({ row: { original: member } }) => roleCell(member.roles, intl),
    }),
  ] as ColumnDef<TeamMember>[];

  const data = React.useMemo(() => members.filter(notEmpty), [members]);

  return (
    <>
      <SEO title={pageTitle} />
      <Heading level="h2">{pageTitle}</Heading>
      <Table
        caption={pageTitle}
        data={data}
        columns={columns}
        sort={{
          internal: true,
        }}
        pagination={{
          internal: true,
          total: data.length,
          pageSizes: [10, 20, 50],
        }}
        search={{
          internal: true,
          label: intl.formatMessage({
            defaultMessage: "Search team members",
            id: "Yy27PD",
            description: "Label for the team members table search input",
          }),
        }}
        add={{
          component: (
            <AddTeamMemberDialog
              team={team}
              availableRoles={roles}
              availableUsers={availableUsers}
            />
          ),
        }}
      />
    </>
  );
};

type RouteParams = {
  teamId: Scalars["ID"];
};

const TeamMembersPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { teamId } = useParams<RouteParams>();
  const [{ data, fetching, error }] = useGetTeamQuery({
    variables: { teamId: teamId || "" },
  });
  const [{ data: rolesData, fetching: rolesFetching, error: rolesError }] =
    useListRolesQuery();
  const [{ data: userData, fetching: userFetching, error: userError }] =
    useAllUsersNamesQuery();

  const team = data?.team;
  const roles = rolesData?.roles
    .filter(notEmpty)
    .filter((role) => role.isTeamBased);
  const users = groupRoleAssignmentsByUser(data?.team?.roleAssignments || []);
  const availableUsers = userData?.userPublicProfiles
    ?.filter(notEmpty)
    .filter((user) => !users.find((teamUser) => teamUser.id === user?.id));

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.teams),
      url: routes.teamTable(),
    },
    ...(teamId
      ? [
          {
            label: getLocalizedName(data?.team?.displayName, intl),
            url: routes.teamView(teamId),
          },
        ]
      : []),
    ...(teamId
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Members",
              id: "nfZQ89",
              description: "Breadcrumb title for the team members page link.",
            }),
            url: routes.teamMembers(teamId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending
        fetching={fetching || rolesFetching}
        error={error || rolesError || userError}
      >
        {team && users ? (
          <TeamMembers
            members={users}
            availableUsers={availableUsers || null}
            roles={roles || []}
            team={team}
          />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default TeamMembersPage;
