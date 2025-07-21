import { useIntl } from "react-intl";
import { useQuery } from "urql";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import {
  Container,
  Heading,
  Pending,
  TableOfContents,
  ThrowNotFound,
  Ul,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import pageTitles from "~/messages/pageTitles";

import messages from "./messages";
import JobDetailsSection from "./components/JobDetailsSection/JobDetailsSection";
import KeyTasksSection from "./components/KeyTasksSection/KeyTasksSection";
import EssentialTechnicalSkillsSection from "./components/EssentialTechnicalSkillsSection/EssentialTechnicalSkillsSection";
import NonessentialTechnicalSkillsSection from "./components/NonessentialTechnicalSkillsSection/NonessentialTechnicalSkillsSection";
import EssentialBehaviouralSkillsSection from "./components/EssentialBehaviouralSkillsSection/EssentialBehaviouralSkillsSection";

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
    defaultMessage:
      "Update, archive, or delete this job advertisement template from the template library.",
    id: "F9a6fy",
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
                  {intl.formatMessage(messages.jobDetails)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.KEY_TASKS}>
                  {intl.formatMessage(messages.keyTasks)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.TECHNICAL_SKILLS}>
                  {intl.formatMessage(messages.technicalSkills)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={SECTION_ID.BEHAVIOURAL_SKILLS}>
                  {intl.formatMessage(messages.behaviouralSkills)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <div className="flex flex-col gap-x-0 gap-y-18">
              <TableOfContents.Section id={SECTION_ID.JOB_DETAILS}>
                <Heading
                  level="h2"
                  icon={PuzzlePieceIcon}
                  color="secondary"
                  className="mx-0 mt-0 mb-6 font-normal"
                >
                  {intl.formatMessage(messages.jobDetails)}
                </Heading>
                <p className="mb-7.5">
                  {intl.formatMessage({
                    defaultMessage:
                      "To get started, select the job's classification and level. Once that's set, you'll be prompted to fill out additional details about the job in both official languages.",
                    id: "IZojK4",
                    description:
                      "Lead-in text for job poster template career template section",
                  })}
                </p>
                <JobDetailsSection
                  initialDataQuery={initialData}
                  optionsQuery={options}
                />
              </TableOfContents.Section>
              <TableOfContents.Section id={SECTION_ID.KEY_TASKS}>
                <Heading
                  level="h2"
                  icon={ClipboardDocumentCheckIcon}
                  color="primary"
                  className="mx-0 mt-0 mb-6 font-normal"
                >
                  {intl.formatMessage(messages.keyTasks)}
                </Heading>
                <div className="mb-7.5 flex flex-col gap-3">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The key tasks serve to inspire and guide managers as they use this template to create their job advertisements. Aim to provide 4 to 8 examples and remember to end each sentence with a period.",
                      id: "iZpJ6T",
                      description:
                        "Lead-in text for job poster template key tasks section, paragraph 1",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "When writing example tasks, consider the following questions:",
                      id: "yMsBez",
                      description:
                        "Lead-in text for job poster template key tasks section, paragraph 2",
                    })}
                  </p>
                  <Ul space="md">
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "What will the day-to-day responsibilities of this position look like?",
                        id: "Lv2AK7",
                        description:
                          "list item for job poster template key tasks section, paragraph 2",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "What should the person in this role accomplish?",
                        id: "YADotx",
                        description:
                          "list item for job poster template key tasks section, paragraph 2",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "What contributions will the successful candidate be expected to make?",
                        id: "JSE20b",
                        description:
                          "list item for job poster template key tasks section, paragraph 2",
                      })}
                    </li>
                  </Ul>
                </div>
                <KeyTasksSection initialDataQuery={initialData} />
              </TableOfContents.Section>
              <TableOfContents.Section id={SECTION_ID.TECHNICAL_SKILLS}>
                <Heading
                  level="h2"
                  icon={BoltIcon}
                  color="error"
                  className="mx-0 mt-0 mb-6 font-normal"
                >
                  {intl.formatMessage(messages.technicalSkills)}
                </Heading>
                <div className="mb-7.5 flex flex-col gap-3">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Now consider what technical skills this role might need. Aim to include skills that are commonly requested for this type of role or are industry standard. In total, a template should aim to provide 8 to 12 skill examples for the manager to select from, but keep in mind that they will be free to add or remove skills as needed. As you add skills, the counter in each section will help you keep track of your total.",
                      id: "rcFCSd",
                      description:
                        "Lead-in text for job poster template technical skills section, paragraph 1",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You can add a special note if you need to add a generic skill that requires an instruction to guide the user of the template.",
                      id: "mob3ow",
                      description:
                        "Lead-in text for job poster template technical skills section, paragraph 2",
                    })}
                  </p>
                </div>
                <div className="mb-7.5">
                  <EssentialTechnicalSkillsSection
                    initialDataQuery={initialData}
                    optionsQuery={options}
                  />
                </div>
                <NonessentialTechnicalSkillsSection
                  initialDataQuery={initialData}
                  optionsQuery={options}
                />
              </TableOfContents.Section>
              <TableOfContents.Section id={SECTION_ID.BEHAVIOURAL_SKILLS}>
                <Heading
                  level="h2"
                  icon={BoltIcon}
                  color="warning"
                  className="mx-0 mt-0 mb-6 font-normal"
                >
                  {intl.formatMessage(messages.behaviouralSkills)}
                </Heading>
                <div className="mb-7.5 flex flex-col gap-3">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "With technical skills chosen, let’s look at behavioural skills. Select examples of behavioural skills based on what a potential candidate would need to succeed in the role. Don’t forget, in total, a template should aim to provide 8 to 12 skills for a manager to choose from. As you add skills, the counter will help you keep track of your total.",
                      id: "z7UQ5V",
                      description:
                        "Lead-in text for job poster template behavioural skills section, paragraph 1",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You can add a special note if you want to add a generic skill with additional instructions to guide the user of the template.",
                      id: "B6VbYI",
                      description:
                        "Lead-in text for job poster template behavioural skills section, paragraph 2",
                    })}
                  </p>
                </div>
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
