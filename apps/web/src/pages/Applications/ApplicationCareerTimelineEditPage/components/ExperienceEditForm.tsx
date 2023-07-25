import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import { AlertDialog, Button, Link, Separator } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import {
  useDeleteExperienceMutation,
  useExperienceMutations,
} from "~/hooks/useExperienceMutations";
import { Scalars } from "~/api/generated";
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
import TasksAndResponsibilities from "~/components/ExperienceFormFields/AdditionalDetails";
import ExperienceDetails from "~/components/ExperienceFormFields/ExperienceDetails";
import ErrorSummary from "~/components/ExperienceFormFields/ErrorSummary";

type FormAction = "return" | "add-another";
type ExperienceExperienceFormValues =
  ExperienceFormValues<AllExperienceFormValues> & {
    type: ExperienceType | "";
    action: FormAction | "";
  };
export interface EditExperienceFormProps {
  applicationId: Scalars["ID"];
  experience: AnyExperience;
}

const EditExperienceForm = ({
  applicationId,
  experience,
}: EditExperienceFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const returnPath = paths.applicationCareerTimeline(applicationId);
  const experienceType = deriveExperienceType(experience);
  const defaultValues = queryResultToDefaultValues(
    experienceType || "award",
    experience,
  );
  const methods = useForm<ExperienceExperienceFormValues>({
    defaultValues,
    shouldFocusError: false,
  });
  const executeDeletionMutation = useDeleteExperienceMutation(experienceType);
  const { executeMutation, getMutationArgs } = useExperienceMutations(
    "update",
    experienceType,
  );

  const handleSubmit: SubmitHandler<ExperienceExperienceFormValues> = async (
    formValues,
  ) => {
    const submitData = formValuesToSubmitData(formValues, [], experienceType);
    const args = getMutationArgs(experience?.id || "", submitData);
    if (executeMutation) {
      executeMutation(args)
        .then((res) => {
          if (res.data) {
            toast.success(
              intl.formatMessage({
                defaultMessage: "Successfully updated experience!",
                id: "4438xW",
                description:
                  "Success message displayed after updating an experience",
              }),
            );
            navigate(returnPath);
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
        .then((result) => {
          navigate(returnPath);
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
        <ExperienceDetails experienceType={experienceType} />
        <TasksAndResponsibilities experienceType={experienceType} />
        <Separator
          orientation="horizontal"
          decorative
          data-h2-background="base(black.light)"
          data-h2-margin="base(x2, 0)"
        />
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(x.25, x.5)"
          data-h2-flex-wrap="base(wrap)"
          data-h2-flex-direction="base(column) l-tablet(row)"
          data-h2-align-items="base(flex-start) l-tablet(center)"
        >
          <Button type="submit">
            {intl.formatMessage(formMessages.saveChanges)}
          </Button>
          <Link
            color="quaternary"
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
                <AlertDialog.Cancel>
                  <Button type="button" color="secondary">
                    {intl.formatMessage({
                      defaultMessage: "Cancel",
                      id: "KnE2Rk",
                      description: "Cancel confirmation",
                    })}
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    type="submit"
                    mode="solid"
                    color="primary"
                    onClick={handleDeleteExperience}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Delete",
                      id: "sBksyQ",
                      description: "Delete confirmation",
                    })}
                  </Button>
                </AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditExperienceForm;
