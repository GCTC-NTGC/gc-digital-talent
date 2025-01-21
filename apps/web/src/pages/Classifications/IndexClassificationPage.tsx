import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import permissionConstants from "~/constants/permissionConstants";

import ClassificationTableApi from "./components/ClassificationTable";

export const IndexClassificationPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.classifications);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.classificationTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <ClassificationTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants().managePlatformData}>
    <IndexClassificationPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexClassificationPage";

export default IndexClassificationPage;
