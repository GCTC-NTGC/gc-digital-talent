import * as React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { graphql, Scalars, Team } from "@gc-digital-talent/graphql";

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

import AddTeamMemberDialog from "./components/AddTeamMemberDialog";
import { actionCell, emailLinkCell, roleAccessor, roleCell } from "./helpers";

const columnHelper = createColumnHelper<TeamMember>();

interface TeamMembersProps {
  members: Array<TeamMember>;
  team: Team;
}

const TeamMembers = ({ members, team }: TeamMembersProps) => {
  const intl = useIntl();
  const { roleAssignments } = useAuthorization();
  const canModifyMembers = checkRole(
    [ROLE_NAME.CommunityManager, ROLE_NAME.PlatformAdmin],
    roleAssignments,
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
        header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "OxeGLu",
          description: "Title displayed for the team table actions column",
        }),
        cell: ({ row: { original: member } }) => actionCell(member, team),
      }),
      ...columns,
    ];
  }

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
        {...(canModifyMembers && {
          add: {
            component: <AddTeamMemberDialog team={team} members={members} />,
          },
        })}
      />
    </>
  );
};

const TeamMembersTeam_Query = graphql(/* GraphQL */ `
  query TeamMembersTeam($teamId: UUID!) {
    team(id: $teamId) {
      id
      name
      contactEmail
      displayName {
        en
        fr
      }
      departments {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      description {
        en
        fr
      }
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
          displayName {
            en
            fr
          }
        }
        user {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`);

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
  const users = React.useMemo(
    () => groupRoleAssignmentsByUser(data?.team?.roleAssignments || []),
    [data?.team?.roleAssignments],
  );

  return (
    <AdminContentWrapper>
      <Pending fetching={fetching} error={error}>
        {team && users ? (
          <TeamMembers members={users} team={team} />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default TeamMembersPage;
