import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import permissionConstants from "~/constants/permissionConstants";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import SkillTableApi from "./components/SkillTable";

export const IndexSkillPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.skillsEditor);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.skillTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <SkillTableApi title={formattedPageTitle} addButton />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants().managePlatformData}>
    <IndexSkillPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexSkillPage";

export default IndexSkillPage;
