import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { useOutletContext } from "react-router-dom";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { getFragment, graphql, Scalars } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import { getFullNameLabel } from "~/utils/nameUtils";
import {
  groupRoleAssignmentsByUser,
  CommunityMember,
  checkRole,
} from "~/utils/communityUtils";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import tableMessages from "~/components/Table/tableMessages";

import AddCommunityMemberDialog from "./components/AddCommunityMemberDialog";
import { actionCell, emailLinkCell, roleAccessor, roleCell } from "./helpers";
import { CommunityMembersPageFragment, ContextType } from "./components/types";
import { CommunityMembersPage_CommunityFragment } from "./components/operations";

const columnHelper = createColumnHelper<CommunityMember>();

interface CommunityMembersProps {
  communityQuery: CommunityMembersPageFragment;
}

const CommunityMembers = ({ communityQuery }: CommunityMembersProps) => {
  const intl = useIntl();
  const community = getFragment(
    CommunityMembersPage_CommunityFragment,
    communityQuery,
  );
  const { canAdmin } = useOutletContext<ContextType>();

  const { userAuthInfo } = useAuthorization();
  const roleAssignments = unpackMaybes(userAuthInfo?.roleAssignments);
  const hasPlatformAdmin = checkRole(
    [ROLE_NAME.PlatformAdmin],
    roleAssignments,
  );

  const members: CommunityMember[] = useMemo(
    () => groupRoleAssignmentsByUser(community.roleAssignments ?? []),
    [community.roleAssignments],
  );

  const pageTitle = intl.formatMessage({
    defaultMessage: "Community members",
    id: "mEh+iY",
    description: "Page title for the view community members page",
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
        id: "9s7Ctc",
        description:
          "Title displayed for the community members table roles column.",
      }),
      cell: ({ row: { original: member } }) => roleCell(member.roles, intl),
    }),
  ] as ColumnDef<CommunityMember>[];

  if (canAdmin) {
    columns = [
      columnHelper.display({
        id: "actions",
        header: intl.formatMessage(tableMessages.actions),
        cell: ({ row: { original: member } }) =>
          actionCell(member, community, hasPlatformAdmin),
        meta: {
          hideMobileHeader: true,
          shrink: true,
        },
      }),
      ...columns,
    ];
  }

  const data = useMemo(() => members.filter(notEmpty), [members]);

  return (
    <>
      <SEO title={pageTitle} />
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
            defaultMessage: "Search community members",
            id: "33oume",
            description: "Label for the community members table search input",
          }),
        }}
        {...(canAdmin && {
          add: {
            component: (
              <AddCommunityMemberDialog
                community={community}
                members={members}
              />
            ),
          },
          nullMessage: {
            description: intl.formatMessage({
              defaultMessage: 'Use the "Add member" button to get started.',
              id: "DrR/rp",
              description: "Instructions for adding a member to a community.",
            }),
          },
        })}
      />
    </>
  );
};

const CommunityMembersTeam_Query = graphql(/* GraphQL */ `
  query CommunityMembersTeam($communityId: UUID!) {
    community(id: $communityId) {
      ...CommunityMembersPage_Community
    }
  }
`);

interface RouteParams extends Record<string, string> {
  communityId: Scalars["ID"]["output"];
}

const CommunityMembersPage = () => {
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: CommunityMembersTeam_Query,
    variables: { communityId },
  });

  const community = data?.community;

  return (
    <AdminContentWrapper>
      <Pending fetching={fetching} error={error}>
        {community ? (
          <CommunityMembers communityQuery={community} />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <CommunityMembersPage />
  </RequireAuth>
);

Component.displayName = "AdminCommunityMembersPage";

export default CommunityMembersPage;
