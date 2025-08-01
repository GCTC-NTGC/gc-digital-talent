import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";

import { Button, CardSeparator, ToggleSection } from "@gc-digital-talent/ui";
import { Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  UpdateJobPosterTemplateJobDetailsFragment,
  UpdateJobPosterTemplateInput,
  SupervisoryStatus,
  Scalars,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import Trigger from "~/components/ToggleForm/Trigger";

import JobDetailsForm, { FormValues } from "../../../components/JobDetailsForm";
import Display from "./Display";
import { hasAllEmptyFields, hasEmptyRequiredFields } from "./validators";

export const InitialData_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateJobDetails on JobPosterTemplate {
    id
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    supervisoryStatus {
      value
      label {
        en
        fr
      }
    }
    workDescription {
      en
      fr
    }
    keywords {
      en
      fr
    }
    classification {
      id
      group
      level
    }
    workStream {
      id
      name {
        en
        fr
      }
      community {
        name {
          en
          fr
        }
      }
    }
    referenceId
  }
`);

const Options_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateJobDetailsOptions on Query {
    ...JobPosterTemplateJobDetailsFormOptions
  }
`);

const UpdateJobPosterTemplateJobDetails_Mutation = graphql(/* GraphQL */ `
  mutation UpdateJobPosterTemplateJobDetails(
    $jobPosterTemplate: UpdateJobPosterTemplateInput!
  ) {
    updateJobPosterTemplate(jobPosterTemplate: $jobPosterTemplate) {
      id
    }
  }
`);

const initialDataToFormValues = ({
  name,
  description,
  supervisoryStatus,
  workStream,
  workDescription,
  keywords,
  classification,
  referenceId,
}: UpdateJobPosterTemplateJobDetailsFragment): FormValues => ({
  jobTitleEn: name?.en ?? null,
  jobTitleFr: name?.fr ?? null,
  descriptionEn: description?.en ?? null,
  descriptionFr: description?.fr ?? null,
  supervisoryStatus: supervisoryStatus?.value ?? null,
  workStreamId: workStream?.id ?? null,
  workDescriptionEn: workDescription?.en ?? null,
  workDescriptionFr: workDescription?.fr ?? null,
  keywordsEn: (keywords?.en ?? []).join(", "),
  keywordsFr: (keywords?.fr ?? []).join(", "),
  classification: classification?.id ?? null,
  classificationGroup: classification?.group ?? null,
  classificationLevel: classification?.level ?? null,
  referenceId: referenceId ?? null,
});

const formValuesToMutationInput = (
  id: Scalars["UUID"]["input"],
  {
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
  }: FormValues,
): UpdateJobPosterTemplateInput => ({
  id: id,
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
});

interface JobDetailsSectionProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
  optionsQuery: FragmentType<typeof Options_Fragment>;
}

const JobDetailsSection = ({
  initialDataQuery,
  optionsQuery,
}: JobDetailsSectionProps) => {
  const intl = useIntl();

  const [{ fetching }, executeMutation] = useMutation(
    UpdateJobPosterTemplateJobDetails_Mutation,
  );

  const initialData = getFragment(InitialData_Fragment, initialDataQuery);

  const optionsData = getFragment(Options_Fragment, optionsQuery);

  const isNull = hasAllEmptyFields(initialData);
  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull,
    emptyRequired: hasEmptyRequiredFields(initialData),
    fallbackIcon: QuestionMarkCircleIcon,
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed updating job details",
        id: "0XtxFu",
        description:
          "Message displayed when a user fails to update the job details",
      }),
    );
  };

  const initialFormValues = initialDataToFormValues(initialData);
  const methods = useForm<FormValues>({
    defaultValues: initialFormValues,
  });
  const { handleSubmit, reset: resetForm } = methods;

  const handleOpenChange = (open: boolean) => {
    resetForm(initialFormValues);
    setIsEditing(open);
  };

  const handleSave: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    const mutationInput = formValuesToMutationInput(initialData.id, formValues);

    return executeMutation({
      jobPosterTemplate: mutationInput,
    })
      .then((result) => {
        if (result.data?.updateJobPosterTemplate) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Job details updated successfully!",
              id: "qDYel8",
              description:
                "Message displayed when a user successfully updates the job details",
            }),
          );
          setIsEditing(false);
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  return (
    <ToggleSection.Root open={isEditing} onOpenChange={handleOpenChange}>
      <Trigger className="flex flex-row justify-end">
        {intl.formatMessage({
          defaultMessage: "Edit job details",
          id: "iZZMzR",
          description: "Trigger to edit the job details",
        })}
      </Trigger>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              displayMode={["content"]}
              content={intl.formatMessage({
                defaultMessage: `This section hasn't been completed yet. Use the "Edit job details" button to get started.`,
                id: "5DZSz/",
                description: "Null message for job details form",
              })}
            />
          ) : (
            <Display initialDataQuery={initialDataQuery} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <JobDetailsForm optionsQuery={optionsData} />
              <CardSeparator decorative orientation="horizontal" />
              <div className="flex flex-wrap items-center gap-6">
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  color="primary"
                  mode="solid"
                  isSubmitting={fetching}
                />
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </div>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default JobDetailsSection;
