import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import {
  Container,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import pageTitles from "~/messages/pageTitles";
import jobPosterTemplateMessages from "~/messages/jobPosterTemplateMessages";

import JobDetailsSection from "./components/JobDetailsSection/JobDetailsSection";
import KeyTasksSection from "./components/KeyTasksSection/KeyTasksSection";
import EssentialTechnicalSkillsSection from "./components/EssentialTechnicalSkillsSection/EssentialTechnicalSkillsSection";
import NonessentialTechnicalSkillsSection from "./components/NonessentialTechnicalSkillsSection/NonessentialTechnicalSkillsSection";
import EssentialBehaviouralSkillsSection from "./components/EssentialBehaviouralSkillsSection/EssentialBehaviouralSkillsSection";
import JobDetailsFrontMatter from "../components/JobDetailsFrontMatter";
import KeyTasksFrontMatter from "../components/KeyTasksFrontMatter";
import TechnicalSkillsFrontMatter from "../components/TechnicalSkillsFrontMatter";
import BehaviouralSkillsFrontMatter from "../components/BehaviouralSkillsFrontMatter";

const SECTION_ID = {
  JOB_DETAILS: "job-details-section",
  KEY_TASKS: "key-tasks-section",
  TECHNICAL_SKILLS: "technical-skills-section",
  BEHAVIOURAL_SKILLS: "behavioural-skills-section",
};

const UpdateJobPosterTemplateOptions_Fragment = graphql(/** GraphQL */ `
  fragment UpdateJobPosterTemplateOptions on Query {
    ...UpdateJobPosterTemplateJobDetailsOptions
    ...UpdateJobPosterTemplateEssentialTechnicalSkillsOptions
    ...UpdateJobPosterTemplateNonessentialTechnicalSkillsOptions
    ...UpdateJobPosterTemplateEssentialBehaviouralSkillsOptions
  }
`);

const UpdateJobPosterTemplate_Fragment = graphql(/** GraphQL */ `
  fragment UpdateJobPosterTemplate on JobPosterTemplate {
    ...UpdateJobPosterTemplateJobDetails
    ...UpdateJobPosterTemplateKeyTasks
    ...UpdateJobPosterTemplateEssentialTechnicalSkills
    ...UpdateJobPosterTemplateNonessentialTechnicalSkills
    ...UpdateJobPosterTemplateEssentialBehaviouralSkills
    id
    name {
      en
      fr
    }
  }
`);

interface UpdateJobPosterTemplateProps {
  initialDataQuery: FragmentType<typeof UpdateJobPosterTemplate_Fragment>;
  optionsQuery: FragmentType<typeof UpdateJobPosterTemplateOptions_Fragment>;
}

const UpdateJobPosterTemplate = ({
  initialDataQuery: initialDataQuery,
  optionsQuery,
}: UpdateJobPosterTemplateProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const initialData = getFragment(
    UpdateJobPosterTemplate_Fragment,
    initialDataQuery,
  );
  const options = getFragment(
    UpdateJobPosterTemplateOptions_Fragment,
    optionsQuery,
  );

  const pageTitle = getLocalizedName(initialData.name, intl);

  const subtitle = intl.formatMessage({
    defaultMessage: "View or update this job advertisement template.",
    id: "eOrKX2",
    description: "Subtitle for the update job poster template page",
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
        label: pageTitle,
        url: paths.jobPosterTemplateUpdate(initialData.id),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} description={subtitle} />
      <Hero title={pageTitle} subtitle={subtitle} crumbs={crumbs} />
      <Container>
        <TableOfContents.Wrapper className="pt-18">
          <TableOfContents.Navigation>
            <TableOfContents.List className="list-none pl-3">
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.JOB_DETAILS}>
                  {intl.formatMessage(jobPosterTemplateMessages.jobDetails)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.KEY_TASKS}>
                  {intl.formatMessage(jobPosterTemplateMessages.keyTasks)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.TECHNICAL_SKILLS}>
                  {intl.formatMessage(
                    jobPosterTemplateMessages.technicalSkills,
                  )}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.BEHAVIOURAL_SKILLS}>
                  {intl.formatMessage(
                    jobPosterTemplateMessages.behaviouralSkills,
                  )}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <div className="flex flex-col gap-x-0 gap-y-18">
              <TableOfContents.Section
                id={SECTION_ID.JOB_DETAILS}
                className="flex flex-col gap-7.5"
              >
                <JobDetailsFrontMatter />
                <JobDetailsSection
                  initialDataQuery={initialData}
                  optionsQuery={options}
                />
              </TableOfContents.Section>
              <TableOfContents.Section
                id={SECTION_ID.KEY_TASKS}
                className="flex flex-col gap-7.5"
              >
                <KeyTasksFrontMatter />
                <KeyTasksSection initialDataQuery={initialData} />
              </TableOfContents.Section>
              <TableOfContents.Section
                id={SECTION_ID.TECHNICAL_SKILLS}
                className="flex flex-col gap-7.5"
              >
                <TechnicalSkillsFrontMatter />
                <EssentialTechnicalSkillsSection
                  initialDataQuery={initialData}
                  optionsQuery={options}
                />
                <NonessentialTechnicalSkillsSection
                  initialDataQuery={initialData}
                  optionsQuery={options}
                />
              </TableOfContents.Section>
              <TableOfContents.Section
                id={SECTION_ID.BEHAVIOURAL_SKILLS}
                className="flex flex-col gap-7.5"
              >
                <BehaviouralSkillsFrontMatter />
                <EssentialBehaviouralSkillsSection
                  initialDataQuery={initialData}
                  optionsQuery={options}
                />
              </TableOfContents.Section>
            </div>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
  );
};

const UpdateJobPosterTemplatePage_Query = graphql(/** GraphQL */ `
  query UpdateJobPosterTemplatePage($id: UUID!) {
    jobPosterTemplate(id: $id) {
      ...UpdateJobPosterTemplate
    }
    ...UpdateJobPosterTemplateOptions
  }
`);

interface RouteParams extends Record<string, string> {
  jobPosterTemplateId: Scalars["ID"]["output"];
}

const UpdateJobPosterTemplatePage = () => {
  const intl = useIntl();
  const { jobPosterTemplateId } = useRequiredParams<RouteParams>(
    "jobPosterTemplateId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: UpdateJobPosterTemplatePage_Query,
    variables: { id: jobPosterTemplateId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.jobPosterTemplate ? (
        <UpdateJobPosterTemplate
          initialDataQuery={data.jobPosterTemplate}
          optionsQuery={data}
        />
      ) : (
        <ThrowNotFound message={intl.formatMessage(commonMessages.notFound)} />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateJobPosterTemplatePage />
  </RequireAuth>
);

Component.displayName = "UpdateJobPosterTemplatePage";

export default Component;
