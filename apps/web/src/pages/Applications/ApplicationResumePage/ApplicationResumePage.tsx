import React from "react";
import { IntlShape, useIntl } from "react-intl";
import { StarIcon } from "@heroicons/react/20/solid";
import groupBy from "lodash/groupBy";
import { FormProvider, useForm } from "react-hook-form";

import { Button, Heading, Link, Separator, Well } from "@gc-digital-talent/ui";
import { Applicant, ApplicationStep } from "@gc-digital-talent/graphql";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { Select } from "@gc-digital-talent/forms";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import { resumeIsIncomplete } from "~/validators/profile";
import { ExperienceType } from "~/types/experience";

import { deriveExperienceType } from "~/utils/experienceUtils";
import { notEmpty } from "@gc-digital-talent/helpers";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

type FormValues = {
  sortExperiencesBy: string;
};

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
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
        label: intl.formatMessage({
          defaultMessage: "Step 3",
          id: "khjfel",
          description: "Breadcrumb link text for the application résumé page",
        }),
      },
    ],
    link: {
      url: path,
    },
    prerequisites: [ApplicationStep.Welcome, ApplicationStep.ReviewYourProfile],
    introUrl: paths.applicationResumeIntro(application.id),
    stepSubmitted: ApplicationStep.ReviewYourResume,
    hasError: (applicant: Applicant) => {
      const isIncomplete = resumeIsIncomplete(applicant);
      return isIncomplete;
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
            "{experienceCount, plural, =0 {0 education and certificate experiences} =1 {1 education and certificate experience} other {# education and certificate experiences}}",
          id: "qFij+H",
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
            "{experienceCount, plural, =0 {0 community participation experiences} =1 {1 community participation experience} other {# community participation experiences}}",
          id: "V6wB0a",
          description: "list a number of community experiences",
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

const ApplicationResume = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });
  const instructionsPath = paths.applicationResumeIntro(application.id);
  const nextStep = paths.applicationEducation(application.id);
  const { applicantDashboard } = useFeatureFlags();

  const methods = useForm<FormValues>();
  const { watch } = methods;
  const watchSortExperiencesBy = watch("sortExperiencesBy");

  const experiences = application.user.experiences ?? [];
  const hasSomeExperience = !!experiences.length;
  const experiencesByType = groupBy(experiences.filter(notEmpty), (e) => {
    return deriveExperienceType(e);
  });

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
                "This step allows you to edit any résumé information you’ve already added to your profile. Click on an item to expand it, revealing more details. If you haven’t added anything to your résumé yet, you can do so from this page by selecting the “<strong>Add a new experience</strong>” button.",
              id: "Ne8kuI",
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
                "Building your résumé consists of describing <strong>work experiences</strong>, <strong>education</strong>, <strong>community participation</strong>, <strong>personal learning</strong>, and <strong>awards</strong> you’ve earned. In a later step, you’ll use these experiences to highlight your skills. You can start adding experiences to your résumé using the “<strong>Add a new experience</strong>” button.",
              id: "TEwoWv",
              description:
                "Application step to begin working on résumé, paragraph two",
            })}
          </p>
        </>
      )}

      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-justify-content="base(space-between)"
        data-h2-align-items="base(flex-start) p-tablet(center)"
      >
        <FormProvider {...methods}>
          <form>
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
          </form>
        </FormProvider>

        <Button color="secondary">
          {intl.formatMessage({
            defaultMessage: "Add a new experience",
            id: "p5nWIk",
            description: "A button to add a new experience to your resume",
          })}
        </Button>
      </div>
      {hasSomeExperience ? (
        JSON.stringify(application.user.experiences)
      ) : (
        <Well>
          <p data-h2-text-align="base(center)">
            {intl.formatMessage({
              defaultMessage: "You don’t have any resume experiences yet.",
              id: "xuAFzV",
              description: "Null state messages for resume list",
            })}
          </p>
        </Well>
      )}
      <Separator
        orientation="horizontal"
        data-h2-background-color="base(gray.lighter)"
        data-h2-margin="base(x2, 0)"
        decorative
      />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.25, x.5)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
      >
        <Link type="button" color="primary" mode="solid" href={nextStep}>
          {intl.formatMessage({
            defaultMessage: "I’m happy with my résumé",
            id: "Km89qF",
            description: "Link text to continue the application process",
          })}
        </Link>
        <Link
          type="button"
          mode="inline"
          color="secondary"
          href={applicantDashboard ? paths.dashboard() : paths.myProfile()}
        >
          {intl.formatMessage({
            defaultMessage: "Save and quit for now",
            id: "U86N4g",
            description: "Action button to save and exit an application",
          })}
        </Link>
      </div>
    </>
  );
};

const ApplicationResumePage = () => (
  <ApplicationApi PageComponent={ApplicationResume} />
);

export default ApplicationResumePage;
