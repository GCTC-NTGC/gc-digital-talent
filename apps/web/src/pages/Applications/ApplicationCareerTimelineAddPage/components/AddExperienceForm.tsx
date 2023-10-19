import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import { Button, Heading, Link, Separator } from "@gc-digital-talent/ui";
import { Select } from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import { useAuthorization } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import { useExperienceMutations } from "~/hooks/useExperienceMutations";
import { Scalars } from "~/api/generated";
import {
  formValuesToSubmitData,
  getExperienceFormLabels,
} from "~/utils/experienceUtils";
import {
  ExperienceFormValues,
  AllExperienceFormValues,
  ExperienceType,
} from "~/types/experience";
import TasksAndResponsibilities from "~/components/ExperienceFormFields/AdditionalDetails";
import ExperienceDetails from "~/components/ExperienceFormFields/ExperienceDetails";
import ErrorSummary from "~/components/ExperienceFormFields/ErrorSummary";

import { experienceTypeTitles } from "../messages";
import { isSuccessfulCreate } from "./addExperienceUtils";

type FormAction = "return" | "add-another";
type ExperienceExperienceFormValues =
  ExperienceFormValues<AllExperienceFormValues> & {
    experienceType: ExperienceType | "";
    action: FormAction | "";
  };
interface AddExperienceFormProps {
  applicationId: Scalars["ID"];
}

const AddExperienceForm = ({ applicationId }: AddExperienceFormProps) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const { userAuthInfo } = useAuthorization();
  const methods = useForm<ExperienceExperienceFormValues>({
    shouldFocusError: false,
  });
  const {
    watch,
    register,
    setValue,
    setFocus,
    formState: { isSubmitSuccessful, isSubmitting },
    reset,
  } = methods;
  const [type, action] = watch(["experienceType", "action"]);
  const { executeMutation, getMutationArgs, executing } =
    useExperienceMutations("create", type);
  const actionProps = register("action");

  const handleSubmit: SubmitHandler<ExperienceExperienceFormValues> = async (
    formValues,
  ) => {
    const submitData = formValuesToSubmitData(formValues, [], type);
    const args = getMutationArgs(userAuthInfo?.id || "", submitData);
    if (executeMutation) {
      executeMutation(args)
        .then((res) => {
          if (!isSuccessfulCreate(res)) {
            toast.error(
              intl.formatMessage({
                defaultMessage: "Error: adding experience failed",
                id: "moKAQP",
                description:
                  "Message displayed to user after experience fails to be created.",
              }),
            );
            return;
          }
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
              navigate(paths.applicationCareerTimeline(applicationId));
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

  React.useEffect(() => {
    if (action === "add-another" && isSubmitSuccessful) {
      // Help users out by focusing the first input after scrolling
      setFocus("experienceType");
      reset();
    }
  }, [isSubmitSuccessful, reset, action, setFocus]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <ErrorSummary experienceType={type} />
        <Heading level="h3">{experienceFormLabels.selectType}</Heading>
        <Select
          label={experienceFormLabels.type}
          name="experienceType"
          id="experienceType"
          doNotSort
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          nullSelection={experienceFormLabels.typeNullSelection}
          options={[
            {
              value: "work",
              label: intl.formatMessage(experienceTypeTitles.work),
            },
            {
              value: "education",
              label: intl.formatMessage(experienceTypeTitles.education),
            },
            {
              value: "community",
              label: intl.formatMessage(experienceTypeTitles.community),
            },
            {
              value: "personal",
              label: intl.formatMessage(experienceTypeTitles.personal),
            },
            {
              value: "award",
              label: intl.formatMessage(experienceTypeTitles.award),
            },
          ]}
        />
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
          <Button
            type="submit"
            mode="solid"
            value="return"
            disabled={executing || isSubmitting}
            {...actionProps}
            onClick={() => setValue("action", "return")}
          >
            {intl.formatMessage({
              defaultMessage: "Save and go back",
              id: "CuHYqt",
              description: "Text for save button on profile form.",
            })}
          </Button>
          <Button
            type="submit"
            mode="inline"
            disabled={executing || isSubmitting}
            {...actionProps}
            onClick={() => setValue("action", "add-another")}
          >
            {intl.formatMessage({
              defaultMessage: "Save and add another",
              id: "+7v9Dq",
              description:
                "Text for save button and add another button on experience form.",
            })}
          </Button>
          <Link
            mode="inline"
            href={paths.applicationCareerTimeline(applicationId)}
          >
            {intl.formatMessage(formMessages.cancelGoBack)}
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddExperienceForm;
