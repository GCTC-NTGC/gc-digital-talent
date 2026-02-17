import { useIntl } from "react-intl";
import { Outlet } from "react-router";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import { useQuery } from "urql";

import { commonMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import { PageNavInfo } from "~/types/pages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import messages from "~/messages/adminMessages";
import { checkRoleDepartments } from "~/utils/departmentUtils";

import { ContextType } from "./ManageAccessPage/components/types";

type PageNavKeys = "view" | "manage-access" | "advanced-tools";

const DepartmentLayoutDepartmentName_Query = graphql(/* GraphQL */ `
  query DepartmentName($id: UUID!) {
    department(id: $id) {
      name {
        localized
      }
      teamIdForRoleAssignment
    }
    myAuth {
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
        }
        team {
          id
          name
        }
        teamable {
          id
        }
      }
    }
  }
`);

interface RouteParams extends Record<string, string> {
  departmentId: string;
}

const DepartmentLayout = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { departmentId } = useRequiredParams<RouteParams>("departmentId");
  const [{ data }] = useQuery({
    query: DepartmentLayoutDepartmentName_Query,
    variables: {
      id: departmentId,
    },
  });

  const roleAssignmentsFiltered =
    data?.myAuth?.roleAssignments?.filter(notEmpty) ?? [];

  const canEditAdmin = checkRoleDepartments(
    [ROLE_NAME.PlatformAdmin],
    roleAssignmentsFiltered,
  );
  const canEditAdvisor = checkRoleDepartments(
    [ROLE_NAME.PlatformAdmin, ROLE_NAME.DepartmentAdmin],
    roleAssignmentsFiltered,
    departmentId,
  );
  const canViewManageAccess =
    canEditAdmin ||
    canEditAdvisor ||
    checkRoleDepartments(
      [ROLE_NAME.DepartmentHRAdvisor],
      roleAssignmentsFiltered,
      departmentId,
    );

  const pages = new Map<PageNavKeys, PageNavInfo>([
    [
      "view",
      {
        icon: ClipboardDocumentListIcon,
        title: intl.formatMessage({
          defaultMessage: "Department information",
          id: "5DwxBX",
          description: "Title for Department information",
        }),
        link: {
          url: paths.departmentView(departmentId),
        },
      },
    ],
  ]);

  if (canViewManageAccess) {
    pages.set("manage-access", {
      icon: ClipboardDocumentListIcon,
      title: intl.formatMessage({
        defaultMessage: "Manage access",
        id: "J0i4xY",
        description: "Title for members page",
      }),
      link: {
        url: paths.departmentManageAccess(departmentId),
      },
    });
  }

  if (canEditAdmin) {
    pages.set("advanced-tools", {
      icon: ClipboardDocumentListIcon,
      title: intl.formatMessage(messages.advancedTools),
      link: {
        url: paths.departmentAdvancedTools(departmentId),
      },
    });
  }

  const departmentName =
    data?.department?.name?.localized ??
    intl.formatMessage(commonMessages.notFound);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.departments),
        url: paths.departmentTable(),
      },
      {
        label: departmentName,
        url: paths.departmentView(departmentId),
      },
    ],
  });

  const outletContext: ContextType = {
    departmentName: departmentName,
    teamId: data?.department?.teamIdForRoleAssignment,
    navTabs: Array.from(pages.values()).map((page) => ({
      label: page.title,
      url: page.link.url,
    })),
    navigationCrumbs: navigationCrumbs,
    roleAssignmentsFiltered,
    canEditAdmin,
    canEditAdvisor,
    canViewManageAccess,
  };

  // No actual shared UI - this is just used as a context provider
  return <Outlet context={outletContext} />;
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.DepartmentAdmin,
      ROLE_NAME.DepartmentHRAdvisor,
    ]}
  >
    <DepartmentLayout />
  </RequireAuth>
);

Component.displayName = "DepartmentLayout";

export default Component;
