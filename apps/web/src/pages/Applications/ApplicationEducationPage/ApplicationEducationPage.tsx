import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Heading,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  ApplicationStep,
  EducationRequirementOption,
  Experience,
} from "@gc-digital-talent/graphql";

import applicationMessages from "~/messages/applicationMessages";
import { isEducationExperience } from "~/utils/experienceUtils";
import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { ExperienceForDate } from "~/types/experience";

import useUpdateApplicationMutation from "../useUpdateApplicationMutation";
import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import LinkCareerTimeline from "./LinkCareerTimeline";
import { getEducationRequirementOptions } from "./utils";
import useApplication from "../useApplication";

type PageAction = "continue" | "cancel";

type FormValues = {
  educationRequirement: EducationRequirementOption;
  educationRequirementExperiences: string[]; // List of ids
  action: PageAction;
};

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationEducation(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Minimum experience or equivalent education",
      id: "LvYEdh",
      description: "Title for Minimum experience or equivalent education",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Confirm you have the minimum experience or equivalent education for the role.",
      id: "gtns9R",
      description: "Subtitle for the application education  page",
    }),
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(applicationMessages.numberedStep, {
          stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
      label: intl.formatMessage({
        defaultMessage: "Education requirements",
        id: "+t5Z7B",
        description: "Title for application education",
      }),
    },
  };
};

interface ApplicationEducationProps extends ApplicationPageProps {
  experiences: Array<ExperienceForDate>;
}

const ApplicationEducation = ({
  application,
  experiences,
}: ApplicationEducationProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const navigate = useNavigate();
  const { followingPageUrl, currentStepOrdinal, isIAP, classificationGroup } =
    useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const nextStep =
    followingPageUrl ?? paths.applicationSkillsIntro(application.id);
  const previousStep = paths.applicationCareerTimeline(application.id);
  const cancelPath = paths.profileAndApplications({ fromIapDraft: isIAP });

  const methods = useForm<FormValues>({
    defaultValues: {
      // Only show default values if applicant has previously submitted data.
      ...(application.educationRequirementOption && {
        educationRequirement: application.educationRequirementOption,
      }),
      ...(application.educationRequirementExperiences && {
        educationRequirementExperiences:
          application.educationRequirementExperiences
            .filter(notEmpty)
            .map(({ id }) => {
              return id;
            }),
      }),
    },
  });
  const {
    register,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;
  const watchEducationRequirement = watch("educationRequirement");
  const actionProps = register("action");

  const [{ fetching: mutating }, executeMutation] =
    useUpdateApplicationMutation();
  const handleSubmit = (formValues: FormValues) => {
    const includesExperience = (id: string) =>
      formValues.educationRequirementExperiences.includes(id);

    const isValid =
      formValues.educationRequirement &&
      formValues.educationRequirementExperiences &&
      (formValues.educationRequirement ===
        EducationRequirementOption.AppliedWork ||
        (formValues.educationRequirement ===
          EducationRequirementOption.ProfessionalDesignation &&
          formValues.educationRequirementExperiences.length > 0) ||
        (formValues.educationRequirement ===
          EducationRequirementOption.Education &&
          experiences.filter(
            (experience) =>
              isEducationExperience(experience as ExperienceForDate) &&
              includesExperience(experience.id),
          ).length > 0));

    if (isValid) {
      const selectedExperiences = experiences.filter((experience) =>
        includesExperience(experience.id),
      );

      // Only save education experiences IF the applicant selects "I meet the post-secondary option".
      // Otherwise, save all experiences.
      const educationRequirementExperiences =
        formValues.educationRequirement === EducationRequirementOption.Education
          ? selectedExperiences.filter(isEducationExperience)
          : selectedExperiences;

      executeMutation({
        id: application.id,
        application: {
          educationRequirementOption: formValues.educationRequirement,
          educationRequirementExperiences: {
            sync: educationRequirementExperiences.map((e) => e.id),
          },
          ...(formValues.action === "continue" && {
            insertSubmittedStep: ApplicationStep.EducationRequirements,
          }),
        },
      })
        .then((res) => {
          if (!res.error) {
            toast.success(
              intl.formatMessage({
                defaultMessage:
                  "Successfully updated your education requirement!",
                id: "QYlwuE",
                description:
                  "Message displayed to users when saving education requirement is successful.",
              }),
            );
            navigate(formValues.action === "continue" ? nextStep : cancelPath);
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: updating education requirement failed",
              id: "ZCUy93",
              description:
                "Message displayed to user after education requirement fails to be updated.",
            }),
          );
        });
    } else {
      toast.error(
        intl.formatMessage({
          defaultMessage:
            "It looks like you haven't added any education experiences to your career timeline yet.",
          id: "UjxhSB",
          description:
            "Alert message informing user to add education experience in application education page.",
        }),
      );
    }
  };

  return (
    <>
      <Heading
        data-h2-margin="base(0, 0, x1, 0)"
        data-h2-font-weight="base(400)"
        size="h3"
      >
        {pageInfo.title}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Heading
            level="h3"
            size="h6"
            data-h2-margin="base(x2, 0, x.5, 0)"
            data-h2-font-weight="base(700)"
          >
            {intl.formatMessage({
              defaultMessage: "Select which criteria you meet",
              id: "yJnGeT",
              description:
                "Heading for radio group section in application education page.",
            })}
          </Heading>
          <p data-h2-margin="base(0, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "To help us understand how you meet the minimum experience or education criteria, please identify which of the options you meet, as well as which experiences in your career timeline apply. If both apply to you, that’s great! Feel free to select the option that best reflects your qualifications.",
              id: "rxo7fM",
              description:
                "Description for radio group section in application education page.",
            })}
          </p>
          <RadioGroup
            idPrefix="education_requirement"
            legend={
              isIAP
                ? intl.formatMessage({
                    defaultMessage:
                      "Please select the option that best reflects your qualifications",
                    id: "0IggSg",
                    description:
                      "Legend for the radio group in the application education page - IAP variant.",
                  })
                : intl.formatMessage({
                    defaultMessage: "Select the option that applies to you",
                    id: "TBsQMo",
                    description:
                      "Legend for the radio group in the application education page.",
                  })
            }
            name="educationRequirement"
            items={getEducationRequirementOptions(
              intl,
              locale,
              classificationGroup,
              isIAP,
            )}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <LinkCareerTimeline
            experiences={experiences}
            watchEducationRequirement={watchEducationRequirement}
            previousStepPath={previousStep}
            classificationGroup={classificationGroup}
          />
          <Separator />
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x1)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-flex-direction="base(column) l-tablet(row)"
            data-h2-align-items="base(flex-start) l-tablet(center)"
          >
            <Button
              type="submit"
              color="secondary"
              value="continue"
              disabled={mutating || isSubmitting}
              {...actionProps}
              onClick={() => {
                setValue("action", "continue");
              }}
            >
              {intl.formatMessage(applicationMessages.saveContinue)}
            </Button>
            <Button
              type="submit"
              mode="inline"
              color="secondary"
              value="cancel"
              disabled={isSubmitting}
              {...actionProps}
              onClick={() => {
                setValue("action", "cancel");
              }}
            >
              {intl.formatMessage(applicationMessages.saveQuit)}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

const ApplicationEducationPage = () => {
  const { application } = useApplication();

  const experiences: Experience[] = unpackMaybes(application.user.experiences);

  return application?.pool ? (
    <ApplicationEducation application={application} experiences={experiences} />
  ) : (
    <ThrowNotFound />
  );
};

export default ApplicationEducationPage;
