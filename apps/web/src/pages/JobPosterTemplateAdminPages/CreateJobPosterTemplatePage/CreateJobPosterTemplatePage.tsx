import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Container, Pending, ThrowNotFound } from "@gc-digital-talent/ui";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";

const CreateJobPosterTemplateOptions_Fragment = graphql(/** GraphQL */ `
  fragment CreateJobPosterTemplateOptions on Query {
    __typename
    #...CreateJobPosterTemplateJobDetailsOptions
    #...CreateJobPosterTemplateEssentialTechnicalSkillsOptions
    #...CreateJobPosterTemplateNonessentialTechnicalSkillsOptions
    #...CreateJobPosterTemplateEssentialBehaviouralSkillsOptions
  }
`);

interface CreateJobPosterTemplateProps {
  optionsQuery: FragmentType<typeof CreateJobPosterTemplateOptions_Fragment>;
}

const CreateJobPosterTemplate = ({
  optionsQuery,
}: CreateJobPosterTemplateProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const options = getFragment(
    CreateJobPosterTemplateOptions_Fragment,
    optionsQuery,
  );

  const pageTitle = intl.formatMessage(pageTitles.createJobPosterTemplateLong);

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Draft or publish a job advertisement template to the template library.",
    id: "bC7MK4",
    description: "Subtitle for the create job poster template page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.adminDashboard),
        url: paths.adminDashboard(),
      },
      {
        label: intl.formatMessage(pageTitles.indexJobPosterTemplatePageShort),
        url: paths.jobPosterTemplateTable(),
      },
      {
        label: intl.formatMessage(pageTitles.createJobPosterTemplateShort),
        url: paths.jobPosterTemplateCreate(),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} description={subtitle} />
      <Hero title={pageTitle} subtitle={subtitle} crumbs={crumbs} centered />
      <Container>
        <div className="flex flex-col gap-x-0 gap-y-18"></div>
      </Container>
    </>
  );
};

const CreateJobPosterTemplatePage_Query = graphql(/** GraphQL */ `
  query CreateJobPosterTemplatePage {
    ...CreateJobPosterTemplateOptions
  }
`);

const CreateJobPosterTemplatePage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: CreateJobPosterTemplatePage_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data ? (
        <CreateJobPosterTemplate optionsQuery={data} />
      ) : (
        <ThrowNotFound message={intl.formatMessage(commonMessages.notFound)} />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateJobPosterTemplatePage />
  </RequireAuth>
);

Component.displayName = "CreateJobPosterTemplatePage";
