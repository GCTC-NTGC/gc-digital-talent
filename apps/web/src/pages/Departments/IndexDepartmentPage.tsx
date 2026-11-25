import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";

import DepartmentTableApi from "./components/DepartmentTable";

const IndexDepartmentPage = () => {
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
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <DepartmentTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

const Component = () => (
  <RequireAuth
    rolesRequirements={[
      { name: ROLE_NAME.PlatformAdmin },
      { name: ROLE_NAME.DepartmentAdmin },
      { name: ROLE_NAME.DepartmentHRAdvisor },
    ]}
  >
    <IndexDepartmentPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexDepartmentPage";

export default Component;
