import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { hasRole, ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { getFragment, graphql, Scalars } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import { getFullNameLabel } from "~/utils/nameUtils";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import tableMessages from "~/components/Table/tableMessages";

import {
  actionCell,
  emailLinkCell,
  groupRoleAssignmentsByUser,
  roleAccessor,
  roleCell,
} from "./components/helpers";
import { ManageAccessPageFragment, PoolTeamMember } from "./components/types";
import { ManageAccessPage_PoolFragment } from "./components/operations";
import AddPoolMembershipDialog from "./components/AddPoolMembershipDialog";

const pageTitle = defineMessage({
  defaultMessage: "Process members",
  id: "wYohzF",
  description: "Page title for the manage process members page",
});

const columnHelper = createColumnHelper<PoolTeamMember>();

interface ManageAccessPoolProps {
  poolQuery: ManageAccessPageFragment;
}

const ManageAccessPool = ({ poolQuery }: ManageAccessPoolProps) => {
  const intl = useIntl();
  const pool = getFragment(ManageAccessPage_PoolFragment, poolQuery);

  const { userAuthInfo } = useAuthorization();
  const roleAssignments = unpackMaybes(userAuthInfo?.roleAssignments);
  const canAddRemoveRoles = hasRole(
    [ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin],
    roleAssignments,
  );

  const members: PoolTeamMember[] = useMemo(
    () => groupRoleAssignmentsByUser(pool.roleAssignments ?? []),
    [pool.roleAssignments],
  );

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
  ] as ColumnDef<PoolTeamMember>[];

  if (canAddRemoveRoles) {
    columns = [
      columnHelper.display({
        id: "actions",
        header: intl.formatMessage(tableMessages.actions),
        cell: ({ row: { original: member } }) =>
          actionCell(member, pool, canAddRemoveRoles),
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
      <Table
        caption={intl.formatMessage(pageTitle)}
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
            defaultMessage: "Search process members",
            id: "vUtN1U",
            description:
              "Label for the process team members table search input",
          }),
        }}
        {...(canAddRemoveRoles && {
          add: {
            component: (
              <AddPoolMembershipDialog pool={pool} members={members} />
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

const ManageAccessPage_PoolQuery = graphql(/* GraphQL */ `
  query ManageAccessPagePool($poolId: UUID!) {
    pool(id: $poolId) {
      ...ManageAccessPagePool
    }
  }
`);

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["output"];
}

const ManageAccessPoolPage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data, fetching, error }] = useQuery({
    query: ManageAccessPage_PoolQuery,
    variables: { poolId },
  });

  const pool = data?.pool;

  return (
    <>
      <SEO title={intl.formatMessage(pageTitle)} />
      <AdminContentWrapper table>
        <Pending fetching={fetching} error={error}>
          {pool ? <ManageAccessPool poolQuery={pool} /> : <ThrowNotFound />}
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <ManageAccessPoolPage />
  </RequireAuth>
);

Component.displayName = "ManageAccessPoolPage";

export default Component;
