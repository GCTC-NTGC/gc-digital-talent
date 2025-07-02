import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";

import { Button, CardSeparator, ToggleSection } from "@gc-digital-talent/ui";
import { RichTextInput, Submit } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
  Locales,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  UpdateJobPosterTemplateInput,
  UpdateJobPosterTemplateKeyTasksFragment,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import Trigger from "~/components/ToggleForm/Trigger";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import Display from "./Display";
import { labels } from "./labels";
import { hasAllEmptyFields, hasEmptyRequiredFields } from "./validators";

const TEXT_AREA_MAX_WORDS_EN = 120;

const keyTasksWordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

export const InitialData_Fragment = graphql(/* GraphQL */ `
  fragment UpdateJobPosterTemplateKeyTasks on JobPosterTemplate {
    id
    tasks {
      en
      fr
    }
  }
`);

const UpdateJobPosterTemplateKeyTasks_Mutation = graphql(/* GraphQL */ `
  mutation UpdateJobPosterTemplateKeyTasks(
    $jobPosterTemplate: UpdateJobPosterTemplateInput!
  ) {
    updateJobPosterTemplate(jobPosterTemplate: $jobPosterTemplate) {
      id
    }
  }
`);

export interface FormValues {
  id: string | null;
  keyTasksEn: string | null;
  keyTasksFr: string | null;
}

const initialDataToFormValues = ({
  id,
  tasks,
}: UpdateJobPosterTemplateKeyTasksFragment): FormValues => ({
  id: id,
  keyTasksEn: tasks?.en ?? null,
  keyTasksFr: tasks?.fr ?? null,
});

const formValuesToMutationInput = ({
  id,
  keyTasksEn,
  keyTasksFr,
}: FormValues): UpdateJobPosterTemplateInput => {
  if (!id) {
    throw new Error("Can not submit without an ID"); // should not be possible
  }
  return {
    id: id,
    tasks: {
      en: keyTasksEn,
      fr: keyTasksFr,
    },
  };
};

interface JobDetailsSectionProps {
  initialDataQuery: FragmentType<typeof InitialData_Fragment>;
}

const JobDetailsSection = ({ initialDataQuery }: JobDetailsSectionProps) => {
  const intl = useIntl();

  const [{ fetching }, executeMutation] = useMutation(
    UpdateJobPosterTemplateKeyTasks_Mutation,
  );

  const initialData = getFragment(InitialData_Fragment, initialDataQuery);

  const isNull = hasAllEmptyFields(initialData);
  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull,
    emptyRequired: hasEmptyRequiredFields(initialData),
    fallbackIcon: QuestionMarkCircleIcon,
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed updating key tasks",
        id: "evtd9n",
        description:
          "Message displayed when a user fails to update the key tasks",
      }),
    );
  };

  const methods = useForm<FormValues>({
    defaultValues: initialDataToFormValues(initialData),
  });
  const { handleSubmit, reset: resetForm } = methods;

  const handleSave: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    const mutationInput = formValuesToMutationInput(formValues);

    return executeMutation({
      jobPosterTemplate: mutationInput,
    })
      .then((result) => {
        if (result.data?.updateJobPosterTemplate) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Key tasks updated successfully!",
              id: "Rg8rht",
              description:
                "Message displayed when a user successfully updates the key tasks",
            }),
          );
          setIsEditing(false);
          resetForm();
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  return (
    <ToggleSection.Root open={isEditing} onOpenChange={setIsEditing}>
      <Trigger className="flex flex-row justify-end">
        {intl.formatMessage({
          defaultMessage: "Edit key tasks",
          id: "1HddlD",
          description: "Trigger to edit the key tasks",
        })}
      </Trigger>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              displayMode={["content"]}
              content={intl.formatMessage({
                defaultMessage: `This section hasn't been completed yet. Use the "Edit key tasks" button to get started.`,
                id: "SiMZMx",
                description: "Null message for key tasks form",
              })}
            />
          ) : (
            <Display initialDataQuery={initialDataQuery} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="flex flex-col gap-6">
                <div>
                  <RichTextInput
                    id="keyTasksEn"
                    name="keyTasksEn"
                    wordLimit={keyTasksWordCountLimits.en}
                    label={intl.formatMessage(labels.keyTasksEn)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
                <div>
                  <RichTextInput
                    id="keyTasksFr"
                    name="keyTasksFr"
                    wordLimit={keyTasksWordCountLimits.fr}
                    label={intl.formatMessage(labels.keyTasksFr)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
              </div>
              <CardSeparator decorative orientation="horizontal" />
              <div className="flex flex-wrap items-center gap-6">
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  aria-label={intl.formatMessage({
                    defaultMessage: "Save job details",
                    id: "/1JrDR",
                    description: "Text on a button to save th job details form",
                  })}
                  color="primary"
                  mode="solid"
                  isSubmitting={fetching}
                />
                <ToggleSection.Close>
                  <Button
                    mode="inline"
                    type="button"
                    color="warning"
                    onClick={() => resetForm()}
                  >
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
