import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import SkillFamilyTableApi from "./components/SkillFamilyTable";

const IndexSkillFamilyPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.skillFamilies);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.skillFamilyTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-padding="base(x3, 0)">
          <SkillFamilyTableApi title={formattedPageTitle} />
        </div>
      </div>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants().managePlatformData}>
    <IndexSkillFamilyPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexSkillFamilyPage";

export default IndexSkillFamilyPage;
