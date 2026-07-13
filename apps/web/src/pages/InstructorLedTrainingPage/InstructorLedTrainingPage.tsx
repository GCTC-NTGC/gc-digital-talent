import type { IntlShape } from "react-intl";
import { defineMessage, useIntl } from "react-intl";
import { useMemo } from "react";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { useQuery } from "urql";
import CalendarIcon from "@heroicons/react/24/solid/CalendarIcon";
import { useSearchParams } from "react-router";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import type { MetadataItemProps } from "@gc-digital-talent/ui";
import {
  Button,
  Card,
  CardSeparator,
  Container,
  Heading,
  Link,
  Loading,
  Metadata,
  UNICODE_CHAR,
  Notice,
  Ul,
} from "@gc-digital-talent/ui";
import type { TrainingOpportunity } from "@gc-digital-talent/graphql";
import { CourseLanguage, graphql, SortOrder } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import PinnedIcon from "~/components/Svg/PinnedIcon";

import CourseLanguageChip from "./CourseLanguageChip";

const TrainingOpportunitiesPaginated_Query = graphql(/* GraphQL */ `
  query TrainingOpportunities(
    $first: Int!
    $where: TrainingOpportunitiesFilterInput
    $orderBy: [OrderByClause!]
  ) {
    trainingOpportunitiesPaginated(
      first: $first
      where: $where
      orderBy: $orderBy
    ) {
      data {
        id
        title {
          en
          fr
        }
        description {
          en
          fr
        }
        courseLanguage {
          value
          label {
            en
            fr
          }
        }
        courseFormat {
          value
          label {
            en
            fr
          }
        }
        registrationDeadline
        trainingStart
        trainingEnd
        applicationUrl {
          en
          fr
        }
        pinned
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
`);

const pageSubtitle = defineMessage({
  defaultMessage:
    "Find available instructor-led training courses and apply to grow your IT expertise.",
  id: "JlQIBx",
  description: "Page subtitle for the instructor led training page",
});

function getMetadata(
  intl: IntlShape,
  trainingOpportunity: TrainingOpportunity,
): MetadataItemProps[] {
  const metadata = [];
  if (trainingOpportunity.registrationDeadline) {
    metadata.push({
      key: `application-deadline-${trainingOpportunity.id}`,
      type: "text",
      children: (
        <>
          {intl.formatMessage({
            defaultMessage: "Application deadline",
            id: "vB6jX+",
            description: "Label for application deadline meta data",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          <span className="font-bold">
            {formatDate({
              date: parseDateTimeUtc(trainingOpportunity.registrationDeadline),
              formatString: DATE_FORMAT_LOCALIZED,
              intl,
            })}
          </span>
        </>
      ),
    } satisfies MetadataItemProps);
  }

  if (trainingOpportunity.trainingStart && !trainingOpportunity.trainingEnd) {
    metadata.push({
      key: `training-starting-date-${trainingOpportunity.id}`,
      type: "text",
      children: (
        <>
          {intl.formatMessage({
            defaultMessage: "Training date",
            id: "yd+VEB",
            description: "Label for training date meta data",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          <span className="font-bold">
            {formatDate({
              date: parseDateTimeUtc(trainingOpportunity.trainingStart),
              formatString: DATE_FORMAT_LOCALIZED,
              intl,
            })}
          </span>
        </>
      ),
    } satisfies MetadataItemProps);
  }

  if (trainingOpportunity.trainingStart && trainingOpportunity.trainingEnd) {
    metadata.push({
      key: `training-dates-${trainingOpportunity.id}`,
      type: "text",
      children: (
        <>
          {intl.formatMessage({
            defaultMessage: "Training dates",
            id: "yK0vlP",
            description: "Label for training dates meta data",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          <span className="font-bold">
            {formatDate({
              date: parseDateTimeUtc(trainingOpportunity.trainingStart),
              formatString: DATE_FORMAT_LOCALIZED,
              intl,
            })}
            <span className="mx-1">{UNICODE_CHAR.HYPHEN}</span>
            {formatDate({
              date: parseDateTimeUtc(trainingOpportunity.trainingEnd),
              formatString: DATE_FORMAT_LOCALIZED,
              intl,
            })}
          </span>
        </>
      ),
    } satisfies MetadataItemProps);
  }

  if (trainingOpportunity.registrationDeadline) {
    metadata.push({
      key: `course-format-${trainingOpportunity.id}`,
      type: "text",
      children: (
        <>{getLocalizedName(trainingOpportunity.courseFormat?.label, intl)}</>
      ),
    } satisfies MetadataItemProps);
  }

  return metadata;
}

type UseLangSearchParamReturn = [
  lang: CourseLanguage | null,
  setLang: (newLang: CourseLanguage | null) => void,
];

function useLangSearchParam(): UseLangSearchParamReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  const langParam = searchParams.get("lang") ?? null;

  const lang = useMemo(() => {
    return (
      Object.values(CourseLanguage).find(
        (courseLang) => courseLang === langParam,
      ) ?? null
    );
  }, [langParam]);

  const setLang = (newLang: CourseLanguage | null) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current);
      if (newLang && newLang !== lang) {
        params.set("lang", newLang);
      } else {
        params.delete("lang");
      }

      return params;
    });
  };

  return [lang, setLang];
}

const selectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "secondary",
  className: "no-underline",
};

const unselectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "black",
  className: "font-bold",
};

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const [opportunityLanguage, setOpportunityLanguage] = useLangSearchParam();

  const [{ data, fetching }] = useQuery({
    query: TrainingOpportunitiesPaginated_Query,
    variables: {
      first: 100,
      where: {
        hidePassedRegistrationDeadline: true, // Training opportunities past the application deadline do NOT show
        opportunityLanguage,
      },
      orderBy: [
        { column: "pinned", order: SortOrder.Desc },
        { column: "registration_deadline", order: SortOrder.Asc },
      ],
    },
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.itTrainingFund),
        url: paths.itTrainingFund(),
      },
      {
        label: intl.formatMessage(pageTitles.instructorLedTraining),
        url: paths.instructorLedTraining(),
      },
    ],
  });

  const trainingOpportunities = unpackMaybes(
    data?.trainingOpportunitiesPaginated.data,
  );

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitles.instructorLedTraining)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <Hero
        title={intl.formatMessage(pageTitles.instructorLedTraining)}
        subtitle={intl.formatMessage(pageSubtitle)}
        crumbs={crumbs}
        centered
      />
      <Container className="my-18">
        <Heading
          size="h3"
          icon={CalendarDaysIcon}
          color="warning"
          className="mt-0 mb-6"
        >
          {intl.formatMessage({
            defaultMessage: "Available IT training opportunities",
            id: "hAy7cB",
            description:
              "Title for available it training opportunities section",
          })}
        </Heading>
        <p className="mb-3">
          {intl.formatMessage({
            defaultMessage:
              "Explore and take advantage of instructor-led training opportunities for Government of Canada IT employees. We’ll continually add new courses, focusing on the government’s most in-demand skills and IT domains.",
            id: "3qkzyD",
            description: "First paragraph of it training opportunities section",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Training opportunities supported by the fund are available to eligible IT-classified employees. Both employees represented by the Professional Institute of the Public Service of Canada (PIPSC) and unrepresented employees may access training. Employees represented by PIPSC will have priority when spaces are limited. Depending on the opportunities being applied for, there may be additional eligibility requirements listed.",
            id: "TIOZdw",
            description:
              "Second paragraph of it training opportunities section",
          })}
        </p>
        <Heading
          size="h3"
          icon={UserCircleIcon}
          color="error"
          className="mt-18 mb-6"
        >
          {intl.formatMessage({
            defaultMessage: "Apply now",
            id: "rzRITR",
            description: "Title for apply section",
          })}
        </Heading>
        <p className="mb-3">
          {intl.formatMessage({
            defaultMessage:
              "To be considered, you must submit an application and meet all eligibility requirements. Participants will be selected based on eligibility, required skills or experience, departmental and regional representation, and employment equity considerations within the Government of Canada’s IT workforce. If needed, a randomized selection process may also be used. We’ll contact you within 5 business days of the application closing date. If you’re selected, you’ll then have 3 business days to confirm your participation. For the Choose your own course option, we will notify you within 14 days of receiving your application. The start date of the course must be within 90 days of you submitting your application.",
            id: "n4cmd3",
            description: "First paragraph of apply section",
          })}
        </p>
        <p className="mb-3">
          {intl.formatMessage({
            defaultMessage: "To be eligible, employees must:",
            id: "DZ795j",
            description: "Second paragraph of apply section",
          })}
        </p>
        <p className="mb-3">
          <Ul space="md">
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "Be IT-classified or acting in an IT role for a minimum of four months plus one day",
                id: "A66erX",
                description: "First item in list of apply section",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: "Have an active Navigar account",
                id: "A5HTBD",
                description: "Second item in list of apply section",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "Have completed all required prerequisites (course-dependent)",
                id: "a3GTSe",
                description: "Third item in list of apply section",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "Be available to attend at least 80% of the scheduled training",
                id: "hUf6+2",
                description: "Fourth item in list of apply section",
              })}
            </li>
          </Ul>
        </p>
        <div
          role="group"
          aria-labelledby="langFilter"
          className="mt-18 mb-3 flex gap-3"
        >
          <span id="langFilter">
            {intl.formatMessage({
              defaultMessage: "Filter by",
              id: "dekUfM",
              description: "Label for a set of filters",
            })}
            {intl.formatMessage(commonMessages.dividingColon)}
          </span>
          <Button
            aria-pressed={opportunityLanguage === null}
            onClick={() => setOpportunityLanguage(null)}
            {...(opportunityLanguage === null
              ? selectedFilterStyle
              : unselectedFilterStyle)}
          >
            {intl.formatMessage({
              defaultMessage: "View all",
              id: "vXcg28",
              description: "Filter by option on instructor training page.",
            })}
          </Button>
          <Button
            aria-pressed={opportunityLanguage === CourseLanguage.English}
            onClick={() => setOpportunityLanguage(CourseLanguage.English)}
            {...(opportunityLanguage === CourseLanguage.English
              ? selectedFilterStyle
              : unselectedFilterStyle)}
          >
            {intl.formatMessage({
              defaultMessage: "English only",
              id: "YTN8A8",
              description: "Filter by option on instructor training page.",
            })}
          </Button>
          <Button
            aria-pressed={opportunityLanguage === CourseLanguage.French}
            onClick={() => setOpportunityLanguage(CourseLanguage.French)}
            {...(opportunityLanguage === CourseLanguage.French
              ? selectedFilterStyle
              : unselectedFilterStyle)}
          >
            {intl.formatMessage({
              defaultMessage: "French only",
              id: "wBU9X4",
              description: "Filter by option on instructor training page.",
            })}
          </Button>
        </div>
        {fetching ? (
          <Loading inline />
        ) : (
          <>
            {trainingOpportunities.length > 0 ? (
              <>
                {trainingOpportunities.map((trainingOpportunity) => {
                  const localizedTitle = getLocalizedName(
                    trainingOpportunity.title,
                    intl,
                  );
                  return (
                    <Card key={trainingOpportunity.id} className="mb-6">
                      <div className="mb-3 flex flex-col items-center justify-center gap-4.5 sm:flex-row sm:justify-start sm:gap-3">
                        <Heading
                          icon={
                            trainingOpportunity.pinned
                              ? PinnedIcon
                              : CalendarIcon
                          }
                          level="h4"
                          size="h5"
                          className="m-0 text-center font-bold sm:text-left"
                        >
                          {localizedTitle}
                        </Heading>
                        <CourseLanguageChip
                          courseLanguage={
                            trainingOpportunity.courseLanguage?.value
                          }
                        />
                      </div>
                      <Metadata
                        metadata={getMetadata(intl, trainingOpportunity)}
                        className="items-center text-center"
                      />
                      <CardSeparator />

                      <Link
                        href={paths.instructorLedTrainingOpportunity(
                          trainingOpportunity.id,
                        )}
                        className="font-bold"
                      >
                        {intl.formatMessage(
                          {
                            defaultMessage:
                              "Learn more and apply <hidden>for {trainingOpportunityTitle}</hidden>",
                            id: "4t9lEL",
                            description:
                              "Button label to open a training opportunities dialog",
                          },
                          {
                            trainingOpportunityTitle: localizedTitle,
                          },
                        )}
                      </Link>
                    </Card>
                  );
                })}
              </>
            ) : (
              <Notice.Root className="text-center">
                <Notice.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "There are currently no upcoming training events. Check back later.",
                      id: "l4d7/6",
                      description:
                        "Null message for instructor led training list",
                    })}
                  </p>
                </Notice.Content>
              </Notice.Root>
            )}
          </>
        )}
      </Container>
    </>
  );
};

Component.displayName = "InstructorLedTrainingPage";

export default Component;
