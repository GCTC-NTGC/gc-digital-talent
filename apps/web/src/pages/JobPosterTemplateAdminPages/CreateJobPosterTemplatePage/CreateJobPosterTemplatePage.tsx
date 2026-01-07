import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  CreateJobPosterTemplateInput,
  CreateJobPosterTemplateSkillInput,
  FragmentType,
  getFragment,
  graphql,
  PoolSkillType,
  SupervisoryStatus,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Button,
  Card,
  CardSeparator,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { Submit } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";

import JobDetailsFrontMatter from "../components/JobDetailsFrontMatter";
import KeyTasksFrontMatter from "../components/KeyTasksFrontMatter";
import TechnicalSkillsFrontMatter from "../components/TechnicalSkillsFrontMatter";
import BehaviouralSkillsFrontMatter from "../components/BehaviouralSkillsFrontMatter";
import JobDetailsForm, {
  FormValues as JobDetailsFormValues,
} from "../components/JobDetailsForm";
import KeyTasksForm, {
  FormValues as KeyTasksFormValues,
} from "../components/KeyTasksForm";
import EssentialTechnicalSkillsForm, {
  FormValues as EssentialTechnicalSkillsFormValues,
} from "../components/EssentialTechnicalSkillsForm";
import NonessentialTechnicalSkillsForm, {
  FormValues as NonessentialTechnicalSkillsFormValues,
} from "../components/NonessentialTechnicalSkillsForm";
import EssentialBehaviouralSkillsForm, {
  FormValues as EssentialBehaviouralSkillsFormValues,
} from "../components/EssentialBehaviouralSkillsForm";

const CreateJobPosterTemplateOptions_Fragment = graphql(/** GraphQL */ `
  fragment CreateJobPosterTemplateOptions on Query {
    ...JobPosterTemplateJobDetailsFormOptions
    ...JobPosterTemplateEssentialTechnicalSkillsFormOptions
    ...JobPosterTemplateNonessentialTechnicalSkillsFormOptions
    ...JobPosterTemplateEssentialBehaviouralSkillsFormOptions
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

interface FormValues
  extends
    JobDetailsFormValues,
    KeyTasksFormValues,
    EssentialTechnicalSkillsFormValues,
    NonessentialTechnicalSkillsFormValues,
    EssentialBehaviouralSkillsFormValues {}

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
  classification,
  referenceId,
  keyTasksEn,
  keyTasksFr,
  essentialTechnicalSkillProficiencies,
  essentialTechnicalSkillsNotesEn,
  essentialTechnicalSkillsNotesFr,
  nonessentialTechnicalSkillProficiencies,
  nonessentialTechnicalSkillsNotesEn,
  nonessentialTechnicalSkillsNotesFr,
  essentialBehaviouralSkillProficiencies,
  essentialBehaviouralSkillsNotesEn,
  essentialBehaviouralSkillsNotesFr,
}: FormValues): CreateJobPosterTemplateInput => {
  if (!referenceId) {
    throw new Error("Reference ID can't be empty");
  }

  const essentialTechnicalJobPosterTemplateSkills = unpackMaybes(
    essentialTechnicalSkillProficiencies,
  ).map<CreateJobPosterTemplateSkillInput>((p) => ({
    skillId: p.skillId,
    type: PoolSkillType.Essential,
    requiredLevel: p.skillLevel,
  }));
  const nonessentialTechnicalJobPosterTemplateSkills = unpackMaybes(
    nonessentialTechnicalSkillProficiencies,
  ).map<CreateJobPosterTemplateSkillInput>((p) => ({
    skillId: p.skillId,
    type: PoolSkillType.Nonessential,
    requiredLevel: p.skillLevel,
  }));
  const essentialBehaviouralJobPosterTemplateSkills = unpackMaybes(
    essentialBehaviouralSkillProficiencies,
  ).map<CreateJobPosterTemplateSkillInput>((p) => ({
    skillId: p.skillId,
    type: PoolSkillType.Essential,
    requiredLevel: p.skillLevel,
  }));

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
      connect: classification,
    },
    referenceId: referenceId,
    tasks: {
      en: keyTasksEn,
      fr: keyTasksFr,
    },
    jobPosterTemplateSkills: {
      create: [
        ...essentialTechnicalJobPosterTemplateSkills,
        ...nonessentialTechnicalJobPosterTemplateSkills,
        ...essentialBehaviouralJobPosterTemplateSkills,
      ],
    },
    essentialTechnicalSkillsNotes: {
      en: essentialTechnicalSkillsNotesEn,
      fr: essentialTechnicalSkillsNotesFr,
    },
    nonessentialTechnicalSkillsNotes: {
      en: nonessentialTechnicalSkillsNotesEn,
      fr: nonessentialTechnicalSkillsNotesFr,
    },
    essentialBehaviouralSkillsNotes: {
      en: essentialBehaviouralSkillsNotesEn,
      fr: essentialBehaviouralSkillsNotesFr,
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
  const optionsData = getFragment(
    CreateJobPosterTemplateOptions_Fragment,
    optionsQuery,
  );

  const [{ fetching }, executeMutation] = useMutation(
    CreateJobPosterTemplate_Mutation,
  );

  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed creating job advertisement template",
        id: "Hv8BFK",
        description:
          "Message displayed when a user fails to update the job poster template",
      }),
    );
  };

  const handleSave: SubmitHandler<FormValues> = async (formValues) => {
    const mutationInput = formValuesToMutationInput(formValues);

    return executeMutation({
      jobPosterTemplate: mutationInput,
    })
      .then(async (result) => {
        if (result.data?.createJobPosterTemplate?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Job advertisement template created successfully!",
              id: "9euxER",
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
      "Create a template including recommendations for the job title, common tasks, and skills.",
    id: "YVsrRv",
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
                <JobDetailsForm optionsQuery={optionsData} />
                <CardSeparator className="my-0" />
                <KeyTasksFrontMatter />
                <KeyTasksForm />
                <CardSeparator className="my-0" />
                <TechnicalSkillsFrontMatter />
                <EssentialTechnicalSkillsForm optionsQuery={optionsData} />
                <NonessentialTechnicalSkillsForm optionsQuery={optionsData} />
                <CardSeparator className="my-0" />
                <BehaviouralSkillsFrontMatter />
                <EssentialBehaviouralSkillsForm optionsQuery={optionsData} />
                <CardSeparator className="my-0" />
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <Submit
                    text={intl.formatMessage({
                      defaultMessage: "Publish template",
                      id: "QcPUyM",
                      description: "Button to publish a job poster template",
                    })}
                    color="primary"
                    mode="solid"
                    isSubmitting={fetching}
                  />
                  <Button
                    type="button"
                    mode="inline"
                    color="warning"
                    onClick={() => navigate(paths.jobPosterTemplateTable())}
                  >
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </div>
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

export default Component;
