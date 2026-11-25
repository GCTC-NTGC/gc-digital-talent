import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";

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
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <IndexSkillPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexSkillPage";

export default Component;
