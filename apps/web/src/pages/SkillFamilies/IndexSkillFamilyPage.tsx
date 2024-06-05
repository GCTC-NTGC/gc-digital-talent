import { useIntl } from "react-intl";
import CloudOutlineIcon from "@heroicons/react/24/outline/CloudIcon";
import CloudSolidIcon from "@heroicons/react/24/solid/CloudIcon";

import { IconType } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import AdminHero from "~/components/Hero/AdminHero";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";

import SkillFamilyTableApi from "./components/SkillFamilyTable";

export const pageOutlineIcon: IconType = CloudOutlineIcon;
export const pageSolidIcon: IconType = CloudSolidIcon;

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
    isAdmin: true,
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <SkillFamilyTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <IndexSkillFamilyPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexSkillFamilyPage";

export default IndexSkillFamilyPage;
