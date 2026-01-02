import { useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { Container, Heading } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import JobPosterTemplateTableApi from "./JobPosterTemplateTable";

export const IndexJobPosterTemplatePage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedLongPageTitle = intl.formatMessage(
    pageTitles.indexJobPosterTemplatePageLong,
  );
  const formattedPageSubtitle = intl.formatMessage({
    defaultMessage: "View, create, or edit job advertisement templates.",
    id: "xKvQtM",
    description: "Subtitle for the index job poster template page",
  });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.adminDashboard),
        url: routes.adminDashboard(),
      },
      {
        label: intl.formatMessage(pageTitles.indexJobPosterTemplatePageShort),
        url: routes.jobPosterTemplateTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedLongPageTitle} />
      <Hero
        title={formattedLongPageTitle}
        subtitle={formattedPageSubtitle}
        crumbs={navigationCrumbs}
      />
      <Container className="my-18" size="full">
        <div className="flex flex-col gap-6">
          <div>
            <Heading
              icon={Cog8ToothIcon}
              color="secondary"
              level="h2"
              className="m-0 font-normal"
            >
              {intl.formatMessage({
                defaultMessage: "Create or view job advertisement templates",
                id: "7ghPv3",
                description:
                  "Heading for the create or view section on the job templates index page",
              })}
            </Heading>
          </div>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "This page allows you to manage all existing job templates on the platform. From here, you can create drafts, publish new templates to the public, or archive templates that should no longer be available.",
              id: "NIaXPz",
              description:
                "Description for the create or view section on the job templates index page",
            })}
          </p>
          <JobPosterTemplateTableApi title={formattedLongPageTitle} />
        </div>
      </Container>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <IndexJobPosterTemplatePage />
  </RequireAuth>
);

Component.displayName = "IndexJobPosterTemplatePage";

export default Component;
