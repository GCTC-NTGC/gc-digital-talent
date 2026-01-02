import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";

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
import { getLogger } from "@gc-digital-talent/logger";

import applicationMessages from "~/messages/applicationMessages";
import {
  isEducationExperience,
  isAwardExperience,
  isCommunityExperience,
  isPersonalExperience,
  isWorkExperience,
  SimpleAnyExperience,
} from "~/utils/experienceUtils";
import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { ExperienceForDate } from "~/types/experience";
import { getEducationRequirementOptions } from "~/utils/educationUtils";
import {
  ClassificationGroup,
  isClassificationGroup,
} from "~/types/classificationGroup";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import useUpdateApplicationMutation from "../useUpdateApplicationMutation";
import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import LinkCareerTimeline from "./LinkCareerTimeline";
import useApplication from "../useApplication";

interface EducationRequirementExperiences {
  educationRequirementAwardExperiences: { sync: string[] };
  educationRequirementCommunityExperiences: { sync: string[] };
  educationRequirementEducationExperiences: { sync: string[] };
  educationRequirementPersonalExperiences: { sync: string[] };
  educationRequirementWorkExperiences: { sync: string[] };
}

type PageAction = "continue" | "cancel";

interface FormValues {
  educationRequirement: EducationRequirementOption;
  educationRequirementExperiences: string[]; // List of ids
  action: PageAction;
}

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
        label: intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
          stepNumber: stepOrdinal,
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

interface ApplicationEducationExperience extends ExperienceForDate {
  id: string;
}

interface ApplicationEducationProps extends ApplicationPageProps {
  experiences: ApplicationEducationExperience[];
}

const ApplicationEducation = ({
  application,
  experiences,
}: ApplicationEducationProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const logger = getLogger();
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
        educationRequirement: application.educationRequirementOption.value,
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
    formState: { isSubmitting },
  } = methods;
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
              isEducationExperience(experience) &&
              includesExperience(experience.id),
          ).length > 0));

    if (isValid) {
      const emptyEducationRequirementExperiences: EducationRequirementExperiences =
        {
          educationRequirementAwardExperiences: { sync: [] },
          educationRequirementCommunityExperiences: { sync: [] },
          educationRequirementEducationExperiences: { sync: [] },
          educationRequirementPersonalExperiences: { sync: [] },
          educationRequirementWorkExperiences: { sync: [] },
        };

      // Gets all experiences by type that have been selected by the applicant.

      const allExperiences = experiences.reduce(
        (
          accumulator: EducationRequirementExperiences,

          experience: SimpleAnyExperience,
        ) => {
          return {
            ...accumulator,

            ...(isAwardExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementAwardExperiences: {
                  sync: [
                    ...accumulator.educationRequirementAwardExperiences.sync,

                    experience.id,
                  ],
                },
              }),

            ...(isCommunityExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementCommunityExperiences: {
                  sync: [
                    ...accumulator.educationRequirementCommunityExperiences
                      .sync,

                    experience.id,
                  ],
                },
              }),

            ...(isEducationExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementEducationExperiences: {
                  sync: [
                    ...accumulator.educationRequirementEducationExperiences
                      .sync,

                    experience.id,
                  ],
                },
              }),

            ...(isPersonalExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementPersonalExperiences: {
                  sync: [
                    ...accumulator.educationRequirementPersonalExperiences.sync,

                    experience.id,
                  ],
                },
              }),

            ...(isWorkExperience(experience) &&
              includesExperience(experience.id) && {
                educationRequirementWorkExperiences: {
                  sync: [
                    ...accumulator.educationRequirementWorkExperiences.sync,

                    experience.id,
                  ],
                },
              }),
          };
        },

        emptyEducationRequirementExperiences,
      );

      // Only save education experiences IF the applicant selects "I meet the post-secondary option".
      // Otherwise, save all experiences.
      const educationRequirementExperiences =
        formValues.educationRequirement === EducationRequirementOption.Education
          ? {
              ...emptyEducationRequirementExperiences,
              educationRequirementEducationExperiences:
                allExperiences.educationRequirementEducationExperiences,
            }
          : allExperiences;

      executeMutation({
        id: application.id,
        application: {
          educationRequirementOption: formValues.educationRequirement,
          ...educationRequirementExperiences,
          ...(formValues.action === "continue" && {
            insertSubmittedStep: ApplicationStep.EducationRequirements,
          }),
        },
      })
        .then(async (res) => {
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
            await navigate(
              formValues.action === "continue" ? nextStep : cancelPath,
            );
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

  let classificationGroupTyped: ClassificationGroup;

  if (isClassificationGroup(classificationGroup)) {
    classificationGroupTyped = classificationGroup;
  } else {
    logger.error(`Unexpected classification: ${classificationGroup}`);
    classificationGroupTyped = "IT";
  }

  return (
    <>
      <Heading size="h3" className="mt-0 mb-6 font-normal">
        {pageInfo.title}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Heading level="h3" size="h6" className="mt-12 mb-3 font-bold">
            {intl.formatMessage({
              defaultMessage: "Select which criteria you meet",
              id: "yJnGeT",
              description:
                "Heading for radio group section in application education page.",
            })}
          </Heading>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage:
                "To help us understand how you meet the minimum experience or education criteria, please identify which of the options you meet, as well as which experiences in your career timeline apply. <strong>If both apply to you, select the education criteria.</strong>",
              id: "prb1eH",
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
              classificationGroupTyped,
              isIAP,
            )}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <LinkCareerTimeline
            experiences={experiences}
            previousStepPath={previousStep}
            classificationGroup={classificationGroup}
          />
          <Separator />
          <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
            <Button
              type="submit"
              color="primary"
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
              color="primary"
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

export const Component = () => {
  const { application } = useApplication();

  const experiences: Omit<Experience, "user">[] = unpackMaybes(
    application.user.experiences,
  );

  return application?.pool ? (
    <ApplicationEducation application={application} experiences={experiences} />
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "ApplicationEducationPage";

export default Component;
