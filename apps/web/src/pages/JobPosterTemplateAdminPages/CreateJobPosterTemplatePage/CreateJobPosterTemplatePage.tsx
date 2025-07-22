import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  CreateJobPosterTemplateInput,
  FragmentType,
  getFragment,
  graphql,
  SupervisoryStatus,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Card,
  CardSeparator,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { Submit } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";

import JobDetailsFrontMatter from "../components/JobDetailsFrontMatter";
import KeyTasksFrontMatter from "../components/KeyTasksFrontMatter";
import TechnicalSkillFrontMatter from "../components/TechnicalSkillFrontMatter";
import BehaviouralSkillsFrontMatter from "../components/BehaviouralSkillsFrontMatter";
import JobDetailsForm, {
  FormValues as JobDetailsFormValues,
} from "../components/JobDetailsForm";

const CreateJobPosterTemplateOptions_Fragment = graphql(/** GraphQL */ `
  fragment CreateJobPosterTemplateOptions on Query {
    ...JobPosterTemplateJobDetailsFormOptions
  }
`);

const CreateJobPosterTemplate_Mutation = graphql(/* GraphQL */ `
  mutation CreateJobPosterTemplate(
    $jobPosterTemplate: CreateJobPosterTemplateInput!
  ) {
    createJobPosterTemplate(jobPosterTemplate: $jobPosterTemplate) {
      id
    }
  }
`);

interface CombinedFormsValues extends JobDetailsFormValues {}

const formValuesToMutationInput = ({
  jobTitleEn,
  jobTitleFr,
  descriptionEn,
  descriptionFr,
  supervisoryStatus,
  workStreamId,
  workDescriptionEn,
  workDescriptionFr,
  keywordsEn,
  keywordsFr,
  classificationLevel,
}: CombinedFormsValues): CreateJobPosterTemplateInput => {
  return {
    name: {
      en: jobTitleEn,
      fr: jobTitleFr,
    },
    description: {
      en: descriptionEn,
      fr: descriptionFr,
    },
    supervisoryStatus: supervisoryStatus as SupervisoryStatus,
    workStream: {
      connect: workStreamId,
    },
    workDescription: {
      en: workDescriptionEn,
      fr: workDescriptionFr,
    },
    keywords: {
      en: keywordsEn?.split(",").map((s) => s.trim()),
      fr: keywordsFr?.split(",").map((s) => s.trim()),
    },
    classification: {
      connect: classificationLevel, // the ID for the group-level is in the level input
    },
    // todo
    referenceId: "",
    tasks: {
      en: "",
      fr: "",
    },
  };
};

interface CreateJobPosterTemplateProps {
  optionsQuery: FragmentType<typeof CreateJobPosterTemplateOptions_Fragment>;
}

const CreateJobPosterTemplate = ({
  optionsQuery,
}: CreateJobPosterTemplateProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const options = getFragment(
    CreateJobPosterTemplateOptions_Fragment,
    optionsQuery,
  );

  const [{ fetching }, executeMutation] = useMutation(
    CreateJobPosterTemplate_Mutation,
  );

  const methods = useForm<CombinedFormsValues>();
  const { handleSubmit } = methods;

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed creating job poster template",
        id: "4k82V+",
        description:
          "Message displayed when a user fails to update the job poster template",
      }),
    );
  };

  const handleSave: SubmitHandler<CombinedFormsValues> = async (
    formValues: CombinedFormsValues,
  ) => {
    const mutationInput = formValuesToMutationInput(formValues);

    return executeMutation({
      jobPosterTemplate: mutationInput,
    })
      .then(async (result) => {
        if (result.data?.createJobPosterTemplate?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Job poster template created successfully!",
              id: "GETrdQ",
              description:
                "Message displayed when a user successfully creates the job poster template",
            }),
          );
          await navigate(
            paths.jobPosterTemplateUpdate(
              result.data.createJobPosterTemplate.id,
            ),
          );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

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
      <Hero
        title={pageTitle}
        subtitle={subtitle}
        crumbs={crumbs}
        centered
        overlap
      >
        <Card className="mb-18">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="flex flex-col gap-x-0 gap-y-9">
                <JobDetailsFrontMatter />
                <JobDetailsForm optionsQuery={options} />
                <CardSeparator />
                <KeyTasksFrontMatter />
                <TechnicalSkillFrontMatter />
                <BehaviouralSkillsFrontMatter />
                <Submit
                  text={intl.formatMessage({
                    defaultMessage: "Publish template",
                    id: "QcPUyM",
                    description: "Button to publish a job poster template",
                  })}
                  aria-label={intl.formatMessage({
                    defaultMessage: "Save job details",
                    id: "/1JrDR",
                    description: "Text on a button to save th job details form",
                  })}
                  color="primary"
                  mode="solid"
                  isSubmitting={fetching}
                />
              </div>
            </form>
          </FormProvider>
        </Card>
      </Hero>
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
