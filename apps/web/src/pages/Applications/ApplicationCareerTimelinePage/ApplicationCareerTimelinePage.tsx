import { useState } from "react";
import { useNavigate } from "react-router";
import { IntlShape, useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import {
  Button,
  Heading,
  Link,
  Separator,
  ThrowNotFound,
  Well,
} from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { Input } from "@gc-digital-talent/forms";
import { groupBy, notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Experience, ApplicationStep } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { ExperienceForDate, ExperienceType } from "~/types/experience";
import { deriveExperienceType } from "~/utils/experienceUtils";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import applicationMessages from "~/messages/applicationMessages";
import ExperienceSortAndFilter, {
  FormValues as ExperienceSortAndFilterFormValues,
} from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import { sortAndFilterExperiences } from "~/components/ExperienceSortAndFilter/sortAndFilterUtil";

import useUpdateApplicationMutation from "../useUpdateApplicationMutation";
import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import useApplication from "../useApplication";

type SortOptions = "date_desc" | "type_asc";

interface FormValues {
  sortExperiencesBy: SortOptions;
  experienceCount: number;
}

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationCareerTimeline(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Review your career timeline",
      id: "w3BYPV",
      description: "Page title for the application career timeline page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Update and review your career timeline information.",
      id: "5dFzBc",
      description: "Subtitle for the application career timeline page",
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

interface ApplicationCareerTimelineProps extends ApplicationPageProps {
  experiences: ExperienceForDate[];
}

export const ApplicationCareerTimeline = ({
  application,
  experiences,
}: ApplicationCareerTimelineProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { followingPageUrl, currentStepOrdinal, isIAP } =
    useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const instructionsPath = paths.applicationCareerTimelineIntro(application.id);
  const nextStep =
    followingPageUrl ?? paths.applicationEducation(application.id);
  const [{ fetching: mutating }, executeMutation] =
    useUpdateApplicationMutation();
  const cancelPath = paths.profileAndApplications({ fromIapDraft: isIAP });
  const applicationWasSubmitted = !!application.submittedAt;

  const methods = useForm<FormValues>();
  const {
    setValue,
    formState: { isSubmitting },
  } = methods;

  const [sortAndFilterValues, setSortAndFilterValues] =
    useState<ExperienceSortAndFilterFormValues>({
      sortBy: "date_desc",
      filterBy: "none",
    });

  const nonEmptyExperiences = experiences?.filter(notEmpty) ?? [];
  const experienceList = sortAndFilterExperiences(
    nonEmptyExperiences,
    sortAndFilterValues,
    intl,
  );
  const experiencesByType = groupBy(nonEmptyExperiences, (e) => {
    return deriveExperienceType(e) ?? "";
  });
  const hasSomeExperience = !!experiences.length;
  const hasExperiencesByType = !!experienceList.length;

  const handleSubmit = () => {
    executeMutation({
      id: application.id,
      application: {
        insertSubmittedStep: ApplicationStep.ReviewYourResume,
      },
    })
      .then(async (res) => {
        if (!res.error) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated your career timeline!",
              id: "dfkNm9",
              description:
                "Message displayed to users when saving career timeline is successful.",
            }),
          );
          await navigate(nextStep);
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
        <Heading
          data-h2-margin="base(0)"
          size="h3"
          data-h2-font-weight="base(400)"
        >
          {hasSomeExperience
            ? pageInfo.title
            : intl.formatMessage({
                defaultMessage: "Create your career timeline",
                id: "sLqKuH",
                description:
                  "Title for career timeline page when there are no experiences yet",
              })}
        </Heading>
        <Link href={instructionsPath} mode="inline">
          {intl.formatMessage({
            defaultMessage: "Review instructions",
            id: "cCSlti",
            description: "Title for review instructions action",
          })}
        </Link>
      </div>
      {hasSomeExperience ? (
        <>
          <p data-h2-margin="base(x1, 0, x.5, 0)">
            {intl.formatMessage({
              defaultMessage:
                "This step allows you to edit any career timeline information you’ve already added to your profile. Click on an item to expand it, revealing more details. If you haven’t added anything to your career timeline yet, you can do so from this page by selecting the “<strong>Add a new experience</strong>” link.",
              id: "0PeEzR",
              description:
                "Application step to continue working on career timeline, paragraph one",
            })}
          </p>
          <p data-h2-margin="base(x.5, 0)">
            {intl.formatMessage({
              defaultMessage: "Your career timeline currently includes:",
              id: "ce3IeQ",
              description: "Title for list of experiences",
            })}
          </p>
          <ul data-h2-margin="base(x0.5, 0, x2, 0)">
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
        </>
      ) : (
        <>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Creating your career timeline is a little different on this platform. First and foremost, any work you do here will be saved to your profile so that you can reuse it on other applications down the road.",
              id: "ZqZc8Z",
              description:
                "Application step to begin working on career timeline, paragraph one",
            })}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Building your career timeline consists of describing <strong>work experiences</strong>, <strong>education</strong>, <strong>community participation</strong>, <strong>personal learning</strong>, and <strong>awards</strong> you’ve earned. In a later step, you’ll use these experiences to highlight your skills. You can start adding experiences to your career timeline using the “<strong>Add a new experience</strong>” link.",
              id: "bDmp5T",
              description:
                "Application step to begin working on career timeline, paragraph two",
            })}
          </p>
        </>
      )}

      <div
        data-h2-flex-grid="base(center, x1, x1)"
        data-h2-padding-bottom="base(x.5)"
      >
        <ExperienceSortAndFilter
          initialFormValues={sortAndFilterValues}
          onChange={(formValues) => setSortAndFilterValues(formValues)}
        />
        <div data-h2-flex-item="base(0of1) p-tablet(fill)">{/* spacer */}</div>

        <div data-h2-flex-item="base(1of1) p-tablet(content)">
          <Link
            mode="inline"
            href={paths.applicationCareerTimelineAdd(application.id)}
          >
            {intl.formatMessage({
              defaultMessage: "Add a new experience",
              id: "ARFz8L",
              description:
                "A link to add a new experience to your career timeline",
            })}
          </Link>
        </div>
      </div>
      {hasSomeExperience ? (
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {hasExperiencesByType ? (
            experienceList.map((experience) => {
              return (
                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                  headingLevel="h3"
                  showSkills={false}
                  editPath={paths.applicationCareerTimelineEdit(
                    application.id,
                    experience.id,
                  )}
                  showEdit={!applicationWasSubmitted}
                />
              );
            })
          ) : (
            <Well data-h2-text-align="base(center)">
              <p>{intl.formatMessage(commonMessages.noExperiencesOfType)}</p>
            </Well>
          )}
        </div>
      ) : (
        <Well>
          <p data-h2-text-align="base(center)">
            {intl.formatMessage({
              defaultMessage:
                "You don’t have any career timeline experiences yet.",
              id: "YqQuy8",
              description: "Null state messages for career timeline list",
            })}
          </p>
        </Well>
      )}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Input
            id="experienceCount"
            name="experienceCount"
            label=""
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
              onClick={() => {
                setValue("experienceCount", experiences.length);
              }}
            >
              {intl.formatMessage(applicationMessages.saveContinue)}
            </Button>
            <Link mode="inline" href={cancelPath} color="secondary">
              {intl.formatMessage(applicationMessages.saveQuit)}
            </Link>
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

  return application ? (
    <ApplicationCareerTimeline
      application={application}
      experiences={experiences}
    />
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "ApplicationCareerTimelinePage";
