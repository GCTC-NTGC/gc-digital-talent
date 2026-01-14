import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";
import { useOutletContext } from "react-router";

import { Container, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  CommunityMembersTeamQuery,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import { getFullNameLabel } from "~/utils/nameUtils";
import {
  groupRoleAssignmentsByUser,
  CommunityMember,
  checkRole,
} from "~/utils/communityUtils";
import useRequiredParams from "~/hooks/useRequiredParams";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import tableMessages from "~/components/Table/tableMessages";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";

import AddCommunityMemberDialog from "./components/AddCommunityMemberDialog";
import { actionCell, emailLinkCell, roleAccessor, roleCell } from "./helpers";
import { CommunityMembersPageFragment, ContextType } from "./components/types";
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
  const { canAdminManageAccess } = useOutletContext<ContextType>();

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
    columnHelper.accessor("email", {
      id: "email",
      header: intl.formatMessage(commonMessages.email),
      cell: ({ row: { original: member } }) =>
        emailLinkCell(member.email, intl),
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

  if (canAdminManageAccess) {
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
          pageSizes: [10, 20, 50],
        }}
        search={{
          internal: true,
          label: intl.formatMessage(adminMessages.searchByKeyword),
        }}
        {...(canAdminManageAccess && {
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

interface CommunityMembersPageProps {
  community: NonNullable<CommunityMembersTeamQuery["community"]>;
}

const CommunityMembersPage = ({ community }: CommunityMembersPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const { communityId } = useRequiredParams<RouteParams>("communityId");

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
        <CommunityMembers communityQuery={community} />
      </Container>
    </>
  );
};

// Since the SEO and Hero need API-loaded data, we wrap the entire page in a Pending
const CommunityMembersPageApiWrapper = () => {
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: CommunityMembersTeam_Query,
    variables: { communityId },
  });
  return (
    <Pending fetching={fetching} error={error}>
      {data?.community ? (
        <CommunityMembersPage community={data.community} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <CommunityMembersPageApiWrapper />
  </RequireAuth>
);

Component.displayName = "AdminCommunityMembersPage";

export default Component;
