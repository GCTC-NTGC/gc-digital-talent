import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { getFragment, graphql, Scalars } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import { getFullNameLabel } from "~/utils/nameUtils";
import {
  checkRole,
  groupRoleAssignmentsByUser,
  TeamMember,
} from "~/utils/teamUtils";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import tableMessages from "~/components/Table/tableMessages";

import AddTeamMemberDialog from "./components/AddTeamMemberDialog";
import { actionCell, emailLinkCell, roleAccessor, roleCell } from "./helpers";
import { TeamMembersPageFragment } from "./components/types";
import { TeamMembersPage_TeamFragment } from "./components/operations";

const columnHelper = createColumnHelper<TeamMember>();

interface TeamMembersProps {
  teamQuery: TeamMembersPageFragment;
}

const TeamMembers = ({ teamQuery }: TeamMembersProps) => {
  const intl = useIntl();
  const team = getFragment(TeamMembersPage_TeamFragment, teamQuery);
  const { roleAssignments } = useAuthorization();
  const canModifyMembers = checkRole(
    [ROLE_NAME.CommunityManager, ROLE_NAME.PlatformAdmin],
    roleAssignments,
  );

  const members: TeamMember[] = useMemo(
    () => groupRoleAssignmentsByUser(team.roleAssignments ?? []),
    [team.roleAssignments],
  );

  const pageTitle = intl.formatMessage({
    defaultMessage: "Team members",
    id: "6rb9mg",
    description: "Page title for the view team members page",
  });

  let columns = [
    columnHelper.accessor(
      (member) => getFullNameLabel(member.firstName, member.lastName, intl),
      {
        id: "name",
        header: intl.formatMessage(commonMessages.name),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor("email", {
      id: "email",
      header: intl.formatMessage(commonMessages.email),
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

  if (canModifyMembers) {
    columns = [
      columnHelper.display({
        id: "actions",
        header: intl.formatMessage(tableMessages.actions),
        cell: ({ row: { original: member } }) => actionCell(member, team),
      }),
      ...columns,
    ];
  }

  const data = useMemo(() => members.filter(notEmpty), [members]);

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
        {...(canModifyMembers && {
          add: {
            component: <AddTeamMemberDialog team={team} members={members} />,
          },
          nullMessage: {
            description: intl.formatMessage({
              defaultMessage: 'Use the "Add new member" button to get started.',
              id: "SfbDLA",
              description: "Instructions for adding a member to a team.",
            }),
          },
        })}
      />
    </>
  );
};

const TeamMembersTeam_Query = graphql(/* GraphQL */ `
  query TeamMembersTeam($teamId: UUID!) {
    team(id: $teamId) {
      ...TeamMembersPage_Team
    }
  }
`);

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = {
  teamId: Scalars["ID"]["output"];
};

const TeamMembersPage = () => {
  const { teamId } = useRequiredParams<RouteParams>("teamId");
  const [{ data, fetching, error }] = useQuery({
    query: TeamMembersTeam_Query,
    variables: { teamId },
  });

  const team = data?.team;

  return (
    <AdminContentWrapper>
      <Pending fetching={fetching} error={error}>
        {team ? <TeamMembers teamQuery={team} /> : <ThrowNotFound />}
      </Pending>
    </AdminContentWrapper>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <TeamMembersPage />
  </RequireAuth>
);

Component.displayName = "AdminTeamMembersPage";

export default TeamMembersPage;
