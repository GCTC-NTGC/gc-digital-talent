import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import { Button, Link, Separator } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";
import { useAuthorization } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import { useExperienceMutations } from "~/hooks/useExperienceMutations";
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
import TasksAndResponsibilities from "~/components/ExperienceFormFields/TasksAndResponsibilities";
import ExperienceDetails from "~/components/ExperienceFormFields/ExperienceDetails";

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
  const { user } = useAuthorization();
  const experienceType = deriveExperienceType(experience);
  const defaultValues = queryResultToDefaultValues(
    experienceType || "award",
    experience,
  );
  const methods = useForm<ExperienceExperienceFormValues>({
    defaultValues,
  });
  const { executeMutation, getMutationArgs } = useExperienceMutations(
    "update",
    experienceType,
  );

  const handleSubmit: SubmitHandler<ExperienceExperienceFormValues> = async (
    formValues,
  ) => {
    const submitData = formValuesToSubmitData(formValues, [], experienceType);
    const args = getMutationArgs(user?.id || "", submitData);
    if (executeMutation) {
      executeMutation(args)
        .then((res) => {
          if (res.data) {
            toast.success(
              intl.formatMessage({
                defaultMessage: "Successfully added experience!",
                id: "DZ775N",
                description:
                  "Success message displayed after adding experience to profile",
              }),
            );
            if (formValues.action !== "add-another") {
              navigate(paths.applicationResume(applicationId));
            }
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: adding experience failed",
              id: "moKAQP",
              description:
                "Message displayed to user after experience fails to be created.",
            }),
          );
        });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <ExperienceDetails />
        <TasksAndResponsibilities />
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
          <Button type="submit" mode="solid" value="return">
            {intl.formatMessage(formMessages.saveChanges)}
          </Button>
          <Link
            type="button"
            mode="inline"
            color="quaternary"
            href={paths.applicationResume(applicationId)}
          >
            {intl.formatMessage(formMessages.cancelGoBack)}
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditExperienceForm;
