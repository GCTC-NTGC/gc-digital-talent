import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { Container } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";

import PoolTableApi from "./components/PoolTable";

export const PoolPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.processes);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.poolTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <Container size="full" className="my-18">
        <PoolTableApi title={formattedPageTitle} />
      </Container>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
      ROLE_NAME.DepartmentAdmin,
      ROLE_NAME.DepartmentHRAdvisor,
    ]}
  >
    <PoolPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexPoolPage";

export default Component;
