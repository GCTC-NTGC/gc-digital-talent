import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import DepartmentTableApi from "./components/DepartmentTable";

const Component = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedPageTitle = intl.formatMessage(pageTitles.departments);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.departmentTable(),
      },
    ],
  });

  return (
    <RequireAuth
      rolesRequirements={[
        { name: ROLE_NAME.PlatformAdmin },
        { name: ROLE_NAME.DepartmentAdmin },
        { name: ROLE_NAME.DepartmentHRAdvisor },
      ]}
    >
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <DepartmentTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </RequireAuth>
  );
};

Component.displayName = "AdminIndexDepartmentPage";

export default Component;
