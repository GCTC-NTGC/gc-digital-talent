import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";

import TrainingEventsTable from "./components/TrainingEventsTable";

export const IndexTrainingEventsPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.trainingEvents);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.trainingEventsIndex(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <div
        data-h2-margin="base(x3 0)"
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <TrainingEventsTable title={formattedPageTitle} />
      </div>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <IndexTrainingEventsPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexTrainingEventsPage";

export default IndexTrainingEventsPage;
