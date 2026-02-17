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
  getFragment,
  graphql,
  Scalars,
  DepartmentMembersTeamQuery,
} from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import { getFullNameLabel } from "~/utils/nameUtils";
import useRequiredParams from "~/hooks/useRequiredParams";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import tableMessages from "~/components/Table/tableMessages";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import {
  checkRoleDepartments,
  DepartmentMember,
  groupRoleAssignmentsByUserDepartments,
} from "~/utils/departmentUtils";

import AddDepartmentMembershipDialog from "./components/AddDepartmentMembership";
import { actionCell, emailLinkCell, roleAccessor, roleCell } from "./helpers";
import {
  ContextType,
  DepartmentManageAccessPageFragment,
} from "./components/types";
import { DepartmentManageAccessPage_DepartmentFragment } from "./components/operations";

const pageTitle = defineMessage({
  defaultMessage: "Department members",
  id: "sBU6QB",
  description: "Page title for the department manage access page",
});

const columnHelper = createColumnHelper<DepartmentMember>();

interface DepartmentMembersTableProps {
  departmentQuery: DepartmentManageAccessPageFragment;
}

const DepartmentMembersTable = ({
  departmentQuery,
}: DepartmentMembersTableProps) => {
  const intl = useIntl();
  const department = getFragment(
    DepartmentManageAccessPage_DepartmentFragment,
    departmentQuery,
  );
  const { canViewManageAccess, canEditAdmin, canEditAdvisor } =
    useOutletContext<ContextType>();

  const { userAuthInfo } = useAuthorization();
  const roleAssignments = unpackMaybes(userAuthInfo?.roleAssignments);
  const hasPlatformAdmin = checkRoleDepartments(
    [ROLE_NAME.PlatformAdmin],
    roleAssignments,
  );

  const members: DepartmentMember[] = useMemo(
    () =>
      groupRoleAssignmentsByUserDepartments(department.roleAssignments ?? []),
    [department.roleAssignments],
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
        defaultMessage: "Department roles",
        id: "kc8chj",
        description: "Label for the input to select role of a Department role",
      }),
      cell: ({ row: { original: member } }) => roleCell(member.roles, intl),
    }),
  ] as ColumnDef<DepartmentMember>[];

  if (canEditAdmin || canEditAdvisor) {
    columns.splice(
      1,
      0,
      columnHelper.display({
        id: "actions",
        header: intl.formatMessage(tableMessages.actions),
        cell: ({ row: { original: member } }) =>
          actionCell(member, department, hasPlatformAdmin, intl),

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
        {...((canEditAdmin || canEditAdvisor) && {
          add: {
            component: (
              <AddDepartmentMembershipDialog
                department={department}
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

const DepartmentMembersTeam_Query = graphql(/* GraphQL */ `
  query DepartmentMembersTeam($departmentId: UUID!) {
    department(id: $departmentId) {
      ...DepartmentManageAccessPage_Department
    }
  }
`);

interface RouteParams extends Record<string, string> {
  departmentId: Scalars["ID"]["output"];
}

interface DepartmentManageAccessPageProps {
  department: NonNullable<DepartmentMembersTeamQuery["department"]>;
}

const DepartmentManageAccessPage = ({
  department,
}: DepartmentManageAccessPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const { departmentId } = useRequiredParams<RouteParams>("departmentId");

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const {
    departmentName,
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
      url: paths.departmentManageAccess(departmentId),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={departmentName} crumbs={crumbs} navTabs={navTabs} />
      <Container className="my-12">
        <DepartmentMembersTable departmentQuery={department} />
      </Container>
    </>
  );
};

// Since the SEO and Hero need API-loaded data, we wrap the entire page in a Pending
const DepartmentManageAccessPageApiWrapper = () => {
  const { departmentId } = useRequiredParams<RouteParams>("departmentId");
  const [{ data, fetching, error }] = useQuery({
    query: DepartmentMembersTeam_Query,
    variables: { departmentId },
  });
  return (
    <Pending fetching={fetching} error={error}>
      {data?.department ? (
        <DepartmentManageAccessPage department={data.department} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.DepartmentAdmin,
      ROLE_NAME.DepartmentHRAdvisor,
    ]}
  >
    <DepartmentManageAccessPageApiWrapper />
  </RequireAuth>
);

Component.displayName = "ManageAccessDepartmentPage";

export default Component;
