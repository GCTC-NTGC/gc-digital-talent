import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import { AlertDialog, Button, Link, Separator } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Scalars } from "@gc-digital-talent/graphql";
import { Submit } from "@gc-digital-talent/forms";

import useRoutes from "~/hooks/useRoutes";
import {
  useDeleteExperienceMutation,
  useExperienceMutations,
} from "~/hooks/useExperienceMutations";
import {
  deriveExperienceType,
  formValuesToSubmitData,
  queryResultToDefaultValues,
} from "~/utils/experienceUtils";
import {
  ExperienceFormValues,
  AllExperienceFormValues,
  ExperienceType,
  AnyExperience,
} from "~/types/experience";
import ExperienceDetails from "~/components/ExperienceFormFields/ExperienceDetails";
import ErrorSummary from "~/components/ExperienceFormFields/ErrorSummary";

type FormAction = "return" | "add-another";
type ExperienceExperienceFormValues =
  ExperienceFormValues<AllExperienceFormValues> & {
    type: ExperienceType | "";
    action: FormAction | "";
  };
interface EditExperienceFormProps {
  applicationId: Scalars["ID"]["output"];
  experience: AnyExperience;
  organizationSuggestions: string[];
}

const EditExperienceForm = ({
  applicationId,
  experience,
  organizationSuggestions,
}: EditExperienceFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const returnPath = paths.applicationCareerTimeline(applicationId);
  const experienceType = deriveExperienceType(experience);
  const defaultValues = queryResultToDefaultValues(
    experienceType ?? "award",
    experience,
  );
  const methods = useForm<ExperienceExperienceFormValues>({
    defaultValues,
    shouldFocusError: false,
  });
  const {
    formState: { isSubmitting },
  } = methods;
  const executeDeletionMutation = useDeleteExperienceMutation(experienceType);
  const { executeMutation, getMutationArgs } = useExperienceMutations(
    "update",
    experienceType,
  );

  const handleSubmit: SubmitHandler<ExperienceExperienceFormValues> = (
    formValues,
  ) => {
    const submitData = formValuesToSubmitData(formValues, [], experienceType);
    const args = getMutationArgs(experience?.id || "", submitData);
    if (executeMutation) {
      executeMutation(args)
        .then(async (res) => {
          if (res.error) {
            toast.error(
              intl.formatMessage({
                defaultMessage: "Error: updating experience failed",
                id: "WyKJsK",
                description:
                  "Message displayed to user after experience fails to be updated.",
              }),
            );
          } else {
            toast.success(
              intl.formatMessage({
                defaultMessage: "Successfully updated experience!",
                id: "4438xW",
                description:
                  "Success message displayed after updating an experience",
              }),
            );
            await navigate(returnPath);
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: updating experience failed",
              id: "WyKJsK",
              description:
                "Message displayed to user after experience fails to be updated.",
            }),
          );
        });
    }
  };

  const handleDeleteExperience = () => {
    if (executeDeletionMutation) {
      executeDeletionMutation({
        id: experience.id,
      })
        .then(async (result) => {
          await navigate(returnPath);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Experience Deleted",
              id: "/qN7tM",
              description:
                "Message displayed to user after experience deleted.",
            }),
          );
          return result.data;
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: deleting experience failed",
              id: "YVhQ4t",
              description:
                "Message displayed to user after experience fails to be deleted.",
            }),
          );
        });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <ErrorSummary experienceType={experienceType} />
        <ExperienceDetails
          experienceType={experienceType}
          organizationSuggestions={organizationSuggestions}
        />
        <Separator />
        <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
          <Submit
            text={intl.formatMessage(formMessages.saveChanges)}
            isSubmitting={isSubmitting}
            color="secondary"
          />
          <Link
            color="warning"
            mode="inline"
            href={paths.applicationCareerTimeline(applicationId)}
          >
            {intl.formatMessage(formMessages.cancelGoBack)}
          </Link>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button type="button" mode="inline" color="error">
                {intl.formatMessage({
                  defaultMessage: "Delete this experience",
                  id: "5DfpAy",
                  description:
                    "Label on button to delete the current experience",
                })}
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Title>
                {intl.formatMessage({
                  defaultMessage: "Are you sure?",
                  id: "AcsOrg",
                  description: "Delete confirmation",
                })}
              </AlertDialog.Title>
              <AlertDialog.Description>
                {intl.formatMessage({
                  defaultMessage:
                    "Are you sure you would like to delete this experience from your profile? This action cannot be undone.",
                  id: "IhXvCe",
                  description:
                    "Question displayed when a user attempts to delete an experience from their profile",
                })}
              </AlertDialog.Description>
              <AlertDialog.Footer>
                <AlertDialog.Action>
                  <Button
                    type="submit"
                    color="error"
                    disabled={isSubmitting}
                    onClick={handleDeleteExperience}
                  >
                    {intl.formatMessage(commonMessages.delete)}
                  </Button>
                </AlertDialog.Action>
                <AlertDialog.Cancel>
                  <Button type="button" color="warning" mode="inline">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </AlertDialog.Cancel>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditExperienceForm;
