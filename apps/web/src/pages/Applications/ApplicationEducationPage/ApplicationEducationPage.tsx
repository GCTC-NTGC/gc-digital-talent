import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import PresentationChartBarIcon from "@heroicons/react/20/solid/PresentationChartBarIcon";
import uniqueId from "lodash/uniqueId";

import {
  Button,
  Link,
  Heading,
  Pending,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  ApplicationStep,
  EducationRequirementOption,
  Experience,
  useGetApplicationQuery,
  useGetMyExperiencesQuery,
  useUpdateApplicationMutation,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import useRoutes from "~/hooks/useRoutes";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import applicationMessages from "~/messages/applicationMessages";

import { RadioGroup } from "@gc-digital-talent/forms";
import { Radio } from "@gc-digital-talent/forms/src/components/RadioGroup";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { GetPageNavInfo } from "~/types/applicationStep";
import { ExperienceForDate } from "~/types/experience";
import { ApplicationPageProps } from "../ApplicationApi";
import LinkResume from "./LinkResume";
import { useApplicationContext } from "../ApplicationContext";

type EducationRequirementExperiences = {
  educationRequirementAwardExperiences: { sync: string[] };
  educationRequirementCommunityExperiences: { sync: string[] };
  educationRequirementEducationExperiences: { sync: string[] };
  educationRequirementPersonalExperiences: { sync: string[] };
  educationRequirementWorkExperiences: { sync: string[] };
};

type PageAction = "continue" | "cancel";

type FormValues = {
  educationRequirement:
    | EducationRequirementOption.AppliedWork
    | EducationRequirementOption.Education;
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
      defaultMessage: "Minimum experience or education",
      id: "6esMaA",
      description: "Page title for the application education page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Confirm you have the minimum experience or equivalent education for the role.",
      id: "gtns9R",
      description: "Subtitle for the application education  page",
    }),
    icon: PresentationChartBarIcon,
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
        id: "dlJCeM",
        description: "Link text for the application education page",
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
  const { applicantDashboard } = useFeatureFlags(); // TODO: Remove once feature flag has been turned on.
  const { followingPageUrl, currentStepOrdinal, isIAP } =
    useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const nextStep =
    followingPageUrl ?? paths.applicationSkillsIntro(application.id);
  const previousStep = paths.applicationResume(application.id);
  const cancelPath = applicantDashboard
    ? paths.dashboard({ fromIapDraft: isIAP })
    : paths.myProfile();

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
  const { register, setValue, watch } = methods;
  const watchEducationRequirement = watch("educationRequirement");
  const actionProps = register("action");

  const [, executeMutation] = useUpdateApplicationMutation();
  const handleSubmit = (formValues: FormValues) => {
    const includesExperience = (id: string) =>
      formValues.educationRequirementExperiences.includes(id);

    const isValid =
      formValues.educationRequirement &&
      formValues.educationRequirementExperiences &&
      ((formValues.educationRequirement ===
        EducationRequirementOption.AppliedWork &&
        formValues.educationRequirementExperiences.length > 0) ||
        (formValues.educationRequirement ===
          EducationRequirementOption.Education &&
          experiences.filter(
            (experience) =>
              isEducationExperience(experience as ExperienceForDate) &&
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
          experience: Experience,
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
            "It looks like you haven't added any education experiences to your résumé yet.",
          id: "Td1lSw",
          description:
            "Alert message informing user to add education experience in application education page.",
        }),
      );
    }
  };

  const qualityStandardsLink = (chunks: React.ReactNode) => {
    const href =
      locale === "en"
        ? "https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/core.html#rpsi"
        : "https://www.canada.ca/fr/secretariat-conseil-tresor/services/dotation/normes-qualification/centrale.html#eepr";
    return (
      <Link href={href} newTab external>
        {chunks}
      </Link>
    );
  };

  const appliedWorkListMessages = [
    applicationMessages.onTheJobLearning,
    applicationMessages.nonConventionalTraining,
    applicationMessages.formalEducation,
    isIAP
      ? applicationMessages.otherExperience
      : applicationMessages.otherFieldExperience,
  ];

  const educationRequirementOptions: Radio[] = [
    {
      value: EducationRequirementOption.AppliedWork,
      label: isIAP
        ? intl.formatMessage({
            defaultMessage:
              "<strong>I meet the applied experience option</strong>",
            id: "kukr/B",
            description:
              "Radio group option for education requirement filter in application education form - IAP variant.",
          })
        : intl.formatMessage({
            defaultMessage:
              "<strong>I meet the applied work experience option</strong>",
            id: "SNwPLZ",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
      contentBelow: (
        <div data-h2-margin="base(x.15, 0, x.5, x1)">
          <p data-h2-margin="base(0, 0, x.5, 0)">
            {intl.formatMessage(applicationMessages.appliedWorkExperience)}
          </p>
          <ul>
            {Object.values(appliedWorkListMessages).map((value) => (
              <li key={uniqueId()} data-h2-margin="base(0, 0, x.25, 0)">
                {intl.formatMessage(value)}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      value: EducationRequirementOption.Education,
      label: isIAP
        ? intl.formatMessage({
            defaultMessage:
              "<strong>I have a high school diploma or equivalent (e.g. GED)</strong>",
            id: "GZSvWZ",
            description:
              "Radio group option for education requirement filter in Indigenous apprenticeship application education form.",
          })
        : intl.formatMessage({
            defaultMessage:
              "<strong>I meet the 2-year post-secondary option</strong>",
            id: "j+jnML",
            description:
              "Radio group option for education requirement filter in application education form.",
          }),
      contentBelow: (
        <div data-h2-margin="base(x.15, 0, x.5, x1)">
          <p>
            {isIAP
              ? intl.formatMessage({
                  defaultMessage:
                    "Successful completion of a standard high school diploma or GED equivalent.",
                  id: "tfzO5t",
                  description:
                    "Message under radio button in Indigenous apprenticeship application education page.",
                })
              : intl.formatMessage(applicationMessages.postSecondaryEducation, {
                  link: qualityStandardsLink,
                })}
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <Heading data-h2-margin="base(0, 0, x2, 0)">{pageInfo.title}</Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Heading
            level="h6"
            data-h2-margin="base(0, 0, x1, 0)"
            data-h2-font-weight="base(800)"
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
                "To help us understand how you meet the minimum experience or education criteria, please identify which of the options you meet, as well as which experiences in your résumé apply. If both apply to you, that’s great! Feel free to select the option that best reflects your qualifications.",
              id: "qEYoGS",
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
            items={educationRequirementOptions}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <LinkResume
            experiences={experiences}
            watchEducationRequirement={watchEducationRequirement}
            previousStepPath={previousStep}
          />
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background="base(black.light)"
            data-h2-margin="base(x2, 0, x2, 0)"
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
              value="continue"
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
  const { applicationId } = useParams();
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
      stale: applicationStale,
    },
  ] = useGetApplicationQuery({
    variables: {
      id: applicationId || "",
    },
    requestPolicy: "cache-first",
  });
  const [
    {
      data: experienceData,
      fetching: experienceFetching,
      error: experienceError,
    },
  ] = useGetMyExperiencesQuery();

  const application = applicationData?.poolCandidate;
  const experiences = experienceData?.me?.experiences as ExperienceForDate[];

  return (
    <Pending
      fetching={applicationFetching || experienceFetching || applicationStale}
      error={applicationError || experienceError}
    >
      {application?.pool ? (
        <ApplicationEducation
          application={application}
          experiences={experiences}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationEducationPage;
