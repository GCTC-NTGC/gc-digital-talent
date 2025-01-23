import { useIntl } from "react-intl";

import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import permissionConstants from "~/constants/permissionConstants";

import TrainingOpportunitiesTable from "./components/TrainingOpportunitiesTable";

export const IndexTrainingOpportunitiesPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(
    pageTitles.trainingOpportunities,
  );

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.trainingOpportunitiesIndex(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <TrainingOpportunitiesTable title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants().managePlatformData}>
    <IndexTrainingOpportunitiesPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexTrainingOpportunitiesPage";

export default IndexTrainingOpportunitiesPage;
