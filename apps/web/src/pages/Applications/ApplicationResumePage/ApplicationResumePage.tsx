import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IntlShape, useIntl } from "react-intl";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import groupBy from "lodash/groupBy";
import { FormProvider, useForm } from "react-hook-form";

import {
  Accordion,
  Button,
  Heading,
  Link,
  Pending,
  Separator,
  ThrowNotFound,
  Well,
} from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { toast } from "@gc-digital-talent/toast";
import { Input, Select } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { ExperienceForDate, ExperienceType } from "~/types/experience";
import { compareByDate, deriveExperienceType } from "~/utils/experienceUtils";
import ExperienceAccordion from "~/components/ExperienceAccordion/ExperienceAccordion";
import applicationMessages from "~/messages/applicationMessages";
import {
  ApplicationStep,
  useGetApplicationQuery,
  useGetMyExperiencesQuery,
  useUpdateApplicationMutation,
} from "~/api/generated";

import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

type SortOptions = "date_desc" | "type_asc";

type FormValues = {
  sortExperiencesBy: SortOptions;
  experienceCount: number;
};

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationResume(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Review your résumé",
      id: "sXjm+Z",
      description: "Page title for the application résumé page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Update and review your résumé information.",
      id: "OkREUg",
      description: "Subtitle for the application résumé page",
    }),
    icon: StarIcon,
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
    },
  };
};

function formatExperienceCount(
  intl: IntlShape,
  experienceType: ExperienceType,
  experienceCount: number,
) {
  switch (experienceType) {
    case "work":
      return intl.formatMessage(
        {
          defaultMessage:
            "{experienceCount, plural, =0 {0 work experiences} =1 {1 work experience} other {# work experiences}}",
          id: "ImwOeT",
          description: "list a number of work experiences",
        },
        {
          experienceCount,
        },
      );
    case "personal":
      return intl.formatMessage(
        {
          defaultMessage:
            "{experienceCount, plural, =0 {0 personal learning experiences} =1 {1 personal learning experience} other {# personal learning experiences}}",
          id: "q++unL",
          description: "list a number of personal experiences",
        },
        {
          experienceCount,
        },
      );
    case "community":
      return intl.formatMessage(
        {
          defaultMessage:
            "{experienceCount, plural, =0 {0 community participation experiences} =1 {1 community participation experience} other {# community participation experiences}}",
          id: "V6wB0a",
          description: "list a number of community experiences",
        },
        {
          experienceCount,
        },
      );
    case "education":
      return intl.formatMessage(
        {
          defaultMessage:
            "{experienceCount, plural, =0 {0 education and certificate experiences} =1 {1 education and certificate experience} other {# education and certificate experiences}}",
          id: "0fexP+",
          description: "list a number of education experiences",
        },
        {
          experienceCount,
        },
      );
    case "award":
      return intl.formatMessage(
        {
          defaultMessage:
            "{experienceCount, plural, =0 {0 award and recognition experiences} =1 {1 award and recognition experience} other {# award and recognition experiences}}",
          id: "inyUex",
          description: "list a number of award experiences",
        },
        {
          experienceCount,
        },
      );
    // should never be hit
    default:
      return intl.formatMessage(
        {
          defaultMessage:
            "{experienceCount, plural, =0 {0 experiences} =1 {1 experience} other {# experiences}}",
          id: "C6kQXh",
          description: "list a number of unknown experiences",
        },
        {
          experienceCount,
        },
      );
  }
}

interface ApplicationResumeProps extends ApplicationPageProps {
  experiences: Array<ExperienceForDate>;
}

export const ApplicationResume = ({
  application,
  experiences,
}: ApplicationResumeProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { followingPageUrl, currentStepOrdinal } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const instructionsPath = paths.applicationResumeIntro(application.id);
  const nextStep =
    followingPageUrl ?? paths.applicationEducation(application.id);
  const { applicantDashboard } = useFeatureFlags();
  const [, executeMutation] = useUpdateApplicationMutation();
  const cancelPath = applicantDashboard ? paths.dashboard() : paths.myProfile();

  const methods = useForm<FormValues>();
  const { watch, setValue } = methods;
  const watchSortExperiencesBy = watch("sortExperiencesBy");

  const nonEmptyExperiences = experiences?.filter(notEmpty) ?? [];
  const hasSomeExperience = !!experiences.length;

  const experiencesByType = groupBy(nonEmptyExperiences, (e) => {
    return deriveExperienceType(e);
  });

  switch (watchSortExperiencesBy) {
    case "date_desc":
      nonEmptyExperiences.sort((a, b) => compareByDate(a, b));
      break;
    case "type_asc":
      nonEmptyExperiences.sort((a, b) => {
        const typeA = deriveExperienceType(a) ?? "";
        const typeB = deriveExperienceType(b) ?? "";
        return typeA > typeB ? 1 : -1;
      });
      break;
    default:
    // no op
  }

  const handleSubmit = async () => {
    executeMutation({
      id: application.id,
      application: {
        insertSubmittedStep: ApplicationStep.ReviewYourResume,
      },
    })
      .then((res) => {
        if (!res.error) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated your résumé!",
              id: "VJm1GR",
              description:
                "Message displayed to users when saving résumé is successful.",
            }),
          );
          navigate(nextStep);
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
  };

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-justify-content="base(space-between)"
        data-h2-align-items="base(flex-start) p-tablet(center)"
      >
        <Heading data-h2-margin-top="base(0)">
          {hasSomeExperience
            ? pageInfo.title
            : intl.formatMessage({
                defaultMessage: "Create your résumé",
                id: "9zHQV0",
                description:
                  "Title for resume page when there are no experiences yet",
              })}
        </Heading>
        <Link
          href={instructionsPath}
          type="button"
          mode="inline"
          color="secondary"
        >
          {intl.formatMessage({
            defaultMessage: "Review instructions",
            id: "VRxiNC",
            description: "A link back to the instructions for this section",
          })}
        </Link>
      </div>
      {hasSomeExperience ? (
        <>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "This step allows you to edit any résumé information you’ve already added to your profile. Click on an item to expand it, revealing more details. If you haven’t added anything to your résumé yet, you can do so from this page by selecting the “<strong>Add a new experience</strong>” link.",
              id: "YbH6ZO",
              description:
                "Application step to continue working on résumé, paragraph one",
            })}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Your résumé currently includes:",
              id: "Q3yncO",
              description: "Title for list of experiences",
            })}
            <ul data-h2-margin="base(x0.5, 0)">
              {Object.keys(experiencesByType).map((experienceType) => {
                return (
                  <li data-h2-margin="base(x0.5, 0)" key={experienceType}>
                    {formatExperienceCount(
                      intl,
                      experienceType as ExperienceType,
                      experiencesByType[experienceType].length,
                    )}
                  </li>
                );
              })}
            </ul>
          </p>
        </>
      ) : (
        <>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Creating your résumé is a little different on this platform. First and foremost, any work you do here will be saved to your profile so that you can reuse it on other applications down the road.",
              id: "19hs6x",
              description:
                "Application step to begin working on résumé, paragraph one",
            })}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Building your résumé consists of describing <strong>work experiences</strong>, <strong>education</strong>, <strong>community participation</strong>, <strong>personal learning</strong>, and <strong>awards</strong> you’ve earned. In a later step, you’ll use these experiences to highlight your skills. You can start adding experiences to your résumé using the “<strong>Add a new experience</strong>” link.",
              id: "9Fzy0s",
              description:
                "Application step to begin working on résumé, paragraph two",
            })}
          </p>
        </>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-justify-content="base(space-between)"
            data-h2-align-items="base(flex-start) p-tablet(center)"
          >
            <Select
              id="sortExperiencesBy"
              label={intl.formatMessage({
                defaultMessage: "Sort your experiences by",
                id: "XuYilo",
                description: "Label for experience sort dropdown",
              })}
              name="sortExperiencesBy"
              options={[
                {
                  value: "date_desc",
                  label: intl.formatMessage({
                    defaultMessage: "Date (recent first)",
                    id: "narnyP",
                    description: "Sort experiences by date descending",
                  }),
                },
                {
                  value: "type_asc",
                  label: intl.formatMessage({
                    defaultMessage: "Type",
                    id: "m7tUAm",
                    description: "Sort experiences by type ascending",
                  }),
                },
              ]}
              hideOptional
              trackUnsaved={false}
            />

            <Link
              type="button"
              mode="inline"
              color="secondary"
              href={paths.applicationResumeAdd(application.id)}
            >
              {intl.formatMessage({
                defaultMessage: "Add a new experience",
                id: "ON4+Yr",
                description: "A link to add a new experience to your resume",
              })}
            </Link>
          </div>
          {hasSomeExperience ? (
            <Accordion.Root type="multiple">
              {experiences.map((experience) => {
                return (
                  <ExperienceAccordion
                    key={experience.id}
                    experience={experience}
                    headingLevel="h3"
                    editPath={paths.applicationResumeEdit(
                      application.id,
                      experience.id,
                    )}
                    showSkills={false}
                  />
                );
              })}
            </Accordion.Root>
          ) : (
            <Well>
              <p data-h2-text-align="base(center)">
                {intl.formatMessage({
                  defaultMessage: "You don’t have any résumé experiences yet.",
                  id: "K9vqwA",
                  description: "Null state messages for résumé list",
                })}
              </p>
            </Well>
          )}
          <Input
            id="experienceCount"
            name="experienceCount"
            label=""
            hideOptional
            type="number"
            hidden
            rules={{
              min: {
                value: 1,
                message: intl.formatMessage({
                  defaultMessage: "Please add at least one experience.",
                  id: "gyZV/3",
                  description: "Error message if there are no experiences",
                }),
              },
            }}
          />

          <Separator
            orientation="horizontal"
            decorative
            data-h2-background="base(black.light)"
            data-h2-margin="base(0, 0, x2, 0)"
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
              onClick={() => {
                setValue("experienceCount", experiences.length);
              }}
            >
              {intl.formatMessage(applicationMessages.saveContinue)}
            </Button>
            <Link
              type="button"
              mode="inline"
              color="secondary"
              href={cancelPath}
            >
              {intl.formatMessage(applicationMessages.saveQuit)}
            </Link>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

const ApplicationResumePage = () => {
  const { applicationId } = useParams();
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
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
      fetching={applicationFetching || experienceFetching}
      error={applicationError || experienceError}
    >
      {application?.poolAdvertisement ? (
        <ApplicationResume
          application={application}
          experiences={experiences}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationResumePage;
