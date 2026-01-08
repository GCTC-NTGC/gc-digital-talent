import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import WorkStreamTableApi from "./WorkStreamTable";

export const IndexWorkStreamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.workStreams);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.workStreamTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <WorkStreamTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <IndexWorkStreamPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexWorkStreamPage";

export default Component;
