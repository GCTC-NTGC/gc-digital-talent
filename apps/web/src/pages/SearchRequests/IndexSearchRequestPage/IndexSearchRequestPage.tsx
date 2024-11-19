import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import SearchRequestTable from "~/components/SearchRequestTable/SearchRequestTable";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/HeroDeprecated/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import permissionConstants from "~/constants/permissionConstants";

export const IndexSearchRequestPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.talentRequests);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.searchRequestTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <SearchRequestTable title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants().viewRequests}>
    <IndexSearchRequestPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexSearchRequestPage";

export default IndexSearchRequestPage;
