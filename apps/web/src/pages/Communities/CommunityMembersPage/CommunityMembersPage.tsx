import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";
import { useOutletContext } from "react-router";

import { Container, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import { getFullNameLabel } from "~/utils/nameUtils";
import type { CommunityMember } from "~/utils/communityUtils";
import { groupRoleAssignmentsByUser, checkRole } from "~/utils/communityUtils";
import useRequiredParams from "~/hooks/useRequiredParams";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import tableMessages from "~/components/Table/tableMessages";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import AddCommunityMemberDialog from "./components/AddCommunityMemberDialog";
import { actionCell, emailLinkCell, roleAccessor, roleCell } from "./helpers";
import type {
  CommunityMembersPageFragment,
  ContextType,
} from "./components/types";
import { CommunityMembersPage_CommunityFragment } from "./components/operations";

const pageTitle = defineMessage({
  defaultMessage: "Community members",
  id: "mEh+iY",
  description: "Page title for the view community members page",
});

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
  const { canAdminManageAccessAndEditCommunity } =
    useOutletContext<ContextType>();

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

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const columns = [
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
    columnHelper.accessor("workEmail", {
      id: "workEmail",
      header: intl.formatMessage(commonMessages.workEmail),
      cell: ({ row: { original: member } }) =>
        emailLinkCell(member.workEmail, intl),
    }),
    columnHelper.accessor((member) => roleAccessor(member.roles, intl), {
      id: "roles",
      header: intl.formatMessage({
        defaultMessage: "Community roles",
        id: "6UiKYE",
        description: "Label for the input to select role of a community role",
      }),
      cell: ({ row: { original: member } }) => roleCell(member.roles, intl),
    }),
  ] as ColumnDef<CommunityMember>[];

  if (canAdminManageAccessAndEditCommunity) {
    columns.splice(
      1,
      0,
      columnHelper.display({
        id: "actions",
        header: intl.formatMessage(tableMessages.actions),
        cell: ({ row: { original: member } }) =>
          actionCell(member, community, hasPlatformAdmin, intl),

        meta: {
          hideMobileHeader: true,
          shrink: true,
        },
      }),
    );
  }

  const data = useMemo(() => members.filter(notEmpty), [members]);

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Table
        caption={formattedPageTitle}
        data={data}
        columns={columns}
        sort={{
          internal: true,
        }}
        pagination={{
          internal: true,
          total: data.length,
          pageSizes: [10, 20, 50, 100, 500],
        }}
        search={{
          internal: true,
          label: intl.formatMessage(adminMessages.searchByKeyword),
        }}
        {...(canAdminManageAccessAndEditCommunity && {
          add: {
            component: <AddCommunityMemberDialog community={community} />,
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
  communityId: string;
}

const CommunityMembersPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const { communityId } = useRequiredParams<RouteParams>("communityId");

  const [{ data, fetching, error }] = useQuery({
    query: CommunityMembersTeam_Query,
    variables: { communityId },
  });

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const {
    communityName,
    navigationCrumbs: baseCrumbs,
    navTabs,
  } = useOutletContext<ContextType>();

  const crumbs = [
    ...(baseCrumbs ?? []),
    {
      label: intl.formatMessage({
        defaultMessage: "Manage access",
        id: "J0i4xY",
        description: "Title for members page",
      }),
      url: paths.communityManageAccess(communityId),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={communityName} crumbs={crumbs} navTabs={navTabs} />
      <Container className="my-12">
        <Pending fetching={fetching} error={error}>
          {data?.community ? (
            <CommunityMembers communityQuery={data.community} />
          ) : (
            <ThrowNotFound />
          )}
        </Pending>
      </Container>
    </>
  );
};

export const Component = () => {
  const { teamId } = useOutletContext<ContextType>();

  // wait for outlet to load
  if (teamId === undefined) {
    return null;
  }

  return (
    <RequireAuth
      rolesRequirements={[
        { name: ROLE_NAME.PlatformAdmin },
        { name: ROLE_NAME.CommunityAdmin, teamId },
        { name: ROLE_NAME.CommunityRecruiter, teamId },
        { name: ROLE_NAME.CommunityTalentCoordinator, teamId },
      ]}
      strict
    >
      <CommunityMembersPage />
    </RequireAuth>
  );
};

Component.displayName = "AdminCommunityMembersPage";

export default Component;
