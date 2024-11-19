import { defineMessage, useIntl } from "react-intl";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/HeroDeprecated/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import permissionConstants from "~/constants/permissionConstants";

import TeamTableApi from "./components/TeamTable/TeamTable";

const subTitle = defineMessage({
  defaultMessage:
    "The following is a table of teams along with their details. You can also create a new team or edit existing ones.",
  id: "i4TGiO",
  description: "Descriptive text about the list of teams in the admin portal.",
});

const IndexTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.teams);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.teamTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <AdminHero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <TeamTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants().viewTeams}>
    <IndexTeamPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexTeamPage";

export default IndexTeamPage;
