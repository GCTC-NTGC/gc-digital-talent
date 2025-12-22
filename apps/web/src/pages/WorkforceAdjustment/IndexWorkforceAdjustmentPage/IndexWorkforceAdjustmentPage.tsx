import { useIntl } from "react-intl";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { Container } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import WorkforceAdjustmentTable from "./components/WorkforceAdjustmentTable";

const IndexWorkforceAdjustmentPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage(pageTitles.workforceAdjustment);
  const description = intl.formatMessage({
    defaultMessage:
      "Find GC employees interested in workforce adjustment (WFA) mobility.",
    id: "pX9VsK",
    description:
      "Description of the list of employee workforce adjustment information",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.communityDashboard),
        url: paths.communityDashboard(),
      },
      {
        label: pageTitle,
        url: paths.workforceAdjustmentEmployees(),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} description={description} />
      <Hero title={pageTitle} subtitle={description} crumbs={crumbs} />
      <Container size="full" className="my-18">
        <WorkforceAdjustmentTable />
      </Container>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin, ROLE_NAME.CommunityRecruiter]}>
    <IndexWorkforceAdjustmentPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexPoolPage";

export default Component;
