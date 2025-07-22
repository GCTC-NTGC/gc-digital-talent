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
  UpdateJobPosterTemplateInput,
  UpdateJobPosterTemplateKeyTasksFragment,
  Scalars,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import Trigger from "~/components/ToggleForm/Trigger";

import KeyTasksForm, { FormValues } from "../../../components/KeyTasksForm";
import Display from "./Display";
import { hasAllEmptyFields, hasEmptyRequiredFields } from "./validators";

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

const initialDataToFormValues = ({
  tasks,
}: UpdateJobPosterTemplateKeyTasksFragment): FormValues => ({
  keyTasksEn: tasks?.en ?? null,
  keyTasksFr: tasks?.fr ?? null,
});

const formValuesToMutationInput = (
  id: Scalars["UUID"]["input"],
  { keyTasksEn, keyTasksFr }: FormValues,
): UpdateJobPosterTemplateInput => ({
  id: id,
  tasks: {
    en: keyTasksEn,
    fr: keyTasksFr,
  },
});

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
              defaultMessage: "Key tasks updated successfully!",
              id: "Rg8rht",
              description:
                "Message displayed when a user successfully updates the key tasks",
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
              <KeyTasksForm />
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
