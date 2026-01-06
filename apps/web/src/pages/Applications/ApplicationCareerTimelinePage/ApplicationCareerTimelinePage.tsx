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
  Ul,
  Notice,
} from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { ErrorMessage, Field, HiddenInput } from "@gc-digital-talent/forms";
import { groupBy, notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Experience,
  ApplicationStep,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { ExperienceForDate, ExperienceType } from "~/types/experience";
import {
  deriveExperienceType,
  SimpleAnyExperience,
} from "~/utils/experienceUtils";
import ExperienceCard, {
  ExperienceCard_Fragment,
} from "~/components/ExperienceCard/ExperienceCard";
import applicationMessages from "~/messages/applicationMessages";
import ExperienceSortAndFilter, {
  FormValues as ExperienceSortAndFilterFormValues,
} from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import { sortAndFilterExperiences } from "~/components/ExperienceSortAndFilter/sortAndFilterUtil";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

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
        label: intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
          stepNumber: stepOrdinal,
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
            "{experienceCount, plural, =0 {0 work experiences} one {# work experience} other {# work experiences}}",
          id: "E4AMEH",
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
            "{experienceCount, plural, =0 {0 personal learning experiences} one {# personal learning experience} other {# personal learning experiences}}",
          id: "GEULvE",
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
            "{experienceCount, plural, =0 {0 community participation experiences} one {# community participation experience} other {# community participation experiences}}",
          id: "IOwsKt",
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
            "{experienceCount, plural, =0 {0 education and certificate experiences} one {# education and certificate experience} other {# education and certificate experiences}}",
          id: "tj90+D",
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
            "{experienceCount, plural, =0 {0 award and recognition experiences} one {# award and recognition experience} other {# award and recognition experiences}}",
          id: "PYeS11",
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
            "{experienceCount, plural, =0 {0 experiences} one {# experience} other {# experiences}}",
          id: "uuXnmb",
          description: "list a number of unknown experiences",
        },
        {
          experienceCount,
        },
      );
  }
}

interface ApplicationExperience extends ExperienceForDate, SimpleAnyExperience {
  id: string;
}

interface ApplicationCareerTimelineProps extends ApplicationPageProps {
  experiences: ApplicationExperience[];
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
    formState: { isSubmitting, errors },
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
      <div className="flex flex-col items-start justify-between xs:flex-row xs:items-center">
        <Heading size="h3" className="mt-0 font-normal">
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
          <p className="mt-6 mb-3">
            {intl.formatMessage({
              defaultMessage:
                "This step allows you to edit any career timeline information you’ve already added to your profile. Click on an item to expand it, revealing more details. If you haven’t added anything to your career timeline yet, you can do so from this page by selecting the “<strong>Add a new experience</strong>” link.",
              id: "0PeEzR",
              description:
                "Application step to continue working on career timeline, paragraph one",
            })}
          </p>
          <p className="my-3">
            {intl.formatMessage({
              defaultMessage: "Your career timeline currently includes:",
              id: "ce3IeQ",
              description: "Title for list of experiences",
            })}
          </p>
          <Ul className="mt-3 mb-12" space="lg">
            {Object.keys(experiencesByType).map((experienceType) => {
              return (
                <li key={experienceType}>
                  {formatExperienceCount(
                    intl,
                    experienceType as ExperienceType,
                    experiencesByType[experienceType].length,
                  )}
                </li>
              );
            })}
          </Ul>
        </>
      ) : (
        <>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "Creating your career timeline is a little different on this platform. First and foremost, any work you do here will be saved to your profile so that you can reuse it on other applications down the road.",
              id: "ZqZc8Z",
              description:
                "Application step to begin working on career timeline, paragraph one",
            })}
          </p>
          <p className="my-6">
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

      <div className="mb-3 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <ExperienceSortAndFilter
          initialFormValues={sortAndFilterValues}
          onChange={(formValues) => setSortAndFilterValues(formValues)}
        />
        <div className="mb-4">
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
        <div className="flex flex-col gap-y-3">
          {hasExperiencesByType ? (
            experienceList.map((experience) => {
              return (
                <ExperienceCard
                  key={experience.id}
                  headingLevel="h3"
                  showSkills={false}
                  editPath={paths.applicationCareerTimelineEdit(
                    application.id,
                    experience.id,
                  )}
                  showEdit={!applicationWasSubmitted}
                  experienceQuery={makeFragmentData(
                    experience,
                    ExperienceCard_Fragment,
                  )}
                />
              );
            })
          ) : (
            <Notice.Root className="text-center">
              <Notice.Content>
                <p>{intl.formatMessage(commonMessages.noExperiencesOfType)}</p>
              </Notice.Content>
            </Notice.Root>
          )}
        </div>
      ) : (
        <Notice.Root>
          <Notice.Content>
            <p className="text-center">
              {intl.formatMessage({
                defaultMessage:
                  "You don’t have any career timeline experiences yet.",
                id: "YqQuy8",
                description: "Null state messages for career timeline list",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <HiddenInput
            name="experienceCount"
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
          <ErrorMessage
            errors={errors}
            name="experienceCount"
            render={({ message }) => (
              <Field.Error className="mt-3">{message}</Field.Error>
            )}
          />

          <Separator />
          <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
            <Button
              type="submit"
              color="primary"
              value="continue"
              disabled={mutating || isSubmitting}
              onClick={() => {
                setValue("experienceCount", experiences.length);
              }}
            >
              {intl.formatMessage(applicationMessages.saveContinue)}
            </Button>
            <Link mode="inline" href={cancelPath} color="primary">
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

export default Component;
