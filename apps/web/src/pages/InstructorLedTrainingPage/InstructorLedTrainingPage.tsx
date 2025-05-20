import { defineMessage, IntlShape, useIntl } from "react-intl";
import { ReactNode, useState } from "react";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { useQuery } from "urql";
import CalendarIcon from "@heroicons/react/24/solid/CalendarIcon";

import {
  commonMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Button,
  CardBasic,
  CardSeparator,
  Dialog,
  Heading,
  Link,
  Loading,
  Metadata,
  MetadataItemProps,
  Well,
} from "@gc-digital-talent/ui";
import {
  CourseLanguage,
  graphql,
  SortOrder,
  TrainingOpportunity,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import RichTextRenderer from "@gc-digital-talent/forms/RichTextRenderer";
import { htmlToRichTextJSON } from "@gc-digital-talent/forms/utils";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import { wrapAbbr } from "~/utils/nameUtils";
import PinnedIcon from "~/components/Svg/PinnedIcon";

import CourseLanguageChip from "./CourseLanguageChip";

const TrainingOpportunitiesPaginated_Query = graphql(/* GraphQL */ `
  query TrainingOpportunities(
    $first: Int
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

const externalLinkAccessor = ({
  href,
  chunks,
  bold = false,
}: {
  href: string;
  chunks: ReactNode;
  bold?: boolean;
}) => {
  return (
    <Link
      href={href}
      color="secondary"
      external
      {...(bold ? { "data-h2-font-weight": "base(700)" } : {})}
    >
      {chunks}
    </Link>
  );
};

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
          <span data-h2-font-weight="base(bold)">
            {formatDate({
              date: parseDateTimeUtc(trainingOpportunity.registrationDeadline),
              formatString: "PPP",
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
          <span data-h2-font-weight="base(bold)">
            {formatDate({
              date: parseDateTimeUtc(trainingOpportunity.trainingStart),
              formatString: "PPP",
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
          <span data-h2-font-weight="base(bold)">
            {formatDate({
              date: parseDateTimeUtc(trainingOpportunity.trainingStart),
              formatString: "PPP",
              intl,
              // eslint-disable-next-line formatjs/no-literal-string-in-jsx
            })}{" "}
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            {"-"}{" "}
            {formatDate({
              date: parseDateTimeUtc(trainingOpportunity.trainingEnd),
              formatString: "PPP",
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

const selectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "secondary",
  "data-h2-text-decoration": "base(none)",
};

const unselectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "black",
  "data-h2-font-weight": "base(bold)",
};

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const [trainingOpportunitiesFilteredBy, setTrainingOpportunitiesFilteredBy] =
    useState<CourseLanguage.English | CourseLanguage.French | null>(null);

  const [{ data, fetching }] = useQuery({
    query: TrainingOpportunitiesPaginated_Query,
    variables: {
      first: 100,
      where: {
        hidePassedRegistrationDeadline: true, // Training opportunities past the application deadline do NOT show
        opportunityLanguage: trainingOpportunitiesFilteredBy,
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
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div data-h2-margin-bottom="base(x3)">
            <Heading
              size="h3"
              Icon={CalendarDaysIcon}
              color="quaternary"
              data-h2-margin-bottom="base(x1)"
            >
              {intl.formatMessage({
                defaultMessage: "Available IT training opportunities",
                id: "hAy7cB",
                description:
                  "Title for available it training opportunities section",
              })}
            </Heading>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "Explore and take advantage of instructor-led training opportunities for Government of Canada IT employees. We’ll continually add new courses, focusing on the government’s most in-demand skills and IT domains.",
                id: "3qkzyD",
                description:
                  "First paragraph of it training opportunities section",
              })}
            </p>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "The training opportunities on this page are supported by the <itTrainingFundLink><abbreviation>IT</abbreviation> Community Training and Development Fund</itTrainingFundLink> and are available only to <abbreviation>IT</abbreviation>-classified employees who are covered by the <itCollectiveAgreementLink><abbreviation>IT</abbreviation> collective agreement.</itCollectiveAgreementLink>",
                  id: "6c89Fd",
                  description:
                    "Second paragraph of it training opportunities section",
                },
                {
                  itTrainingFundLink: (chunks: ReactNode) =>
                    externalLinkAccessor({
                      href: paths.itTrainingFund(),
                      chunks,
                      bold: true,
                    }),
                  itCollectiveAgreementLink: (chunks: ReactNode) =>
                    externalLinkAccessor({
                      href:
                        locale === "en"
                          ? "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=31"
                          : "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-fra.aspx?id=31",
                      chunks,
                    }),
                  abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </p>
          </div>
          <div data-h2-margin-bottom="base(x3)">
            <Heading
              size="h3"
              Icon={UserCircleIcon}
              color="tertiary"
              data-h2-margin-bottom="base(x1)"
            >
              {intl.formatMessage({
                defaultMessage: "Apply and share your profile",
                id: "WPS1Ic",
                description: "Title for apply and share your profile section",
              })}
            </Heading>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "To express your interest, complete the application form and agree to share your GC Digital Talent profile. Your profile helps us confirm your employment status, classification, identification with employment equity groups, and required experience. Before you apply, take a moment to review and update your information or create a profile if you don’t have one yet.",
                id: "bjwTpe",
                description: "First paragraph of apply and share section",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "We’ll select participants based on eligibility, necessary skills or experience, and representation of employment equity groups in the GC’s IT workforce. We’ll contact you within 8 business days of the application closing date. If you’re selected, you’ll then have 3 business days to confirm your participation.",
                id: "pcAgJh",
                description: "Second paragraph of apply and share section",
              })}
            </p>
          </div>
          {fetching ? (
            <Loading inline />
          ) : (
            <>
              {trainingOpportunities.length > 0 ? (
                <>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(row)"
                    data-h2-gap="base(x0.5)"
                    data-h2-margin-bottom="base(x.5)"
                  >
                    <Button
                      onClick={() => setTrainingOpportunitiesFilteredBy(null)}
                      {...(trainingOpportunitiesFilteredBy === null
                        ? selectedFilterStyle
                        : unselectedFilterStyle)}
                    >
                      {intl.formatMessage({
                        defaultMessage: "View all",
                        id: "vXcg28",
                        description:
                          "Filter by option on instructor training page.",
                      })}
                    </Button>
                    <Button
                      onClick={() =>
                        setTrainingOpportunitiesFilteredBy(
                          CourseLanguage.English,
                        )
                      }
                      {...(trainingOpportunitiesFilteredBy ===
                      CourseLanguage.English
                        ? selectedFilterStyle
                        : unselectedFilterStyle)}
                    >
                      {intl.formatMessage({
                        defaultMessage: "English only",
                        id: "YTN8A8",
                        description:
                          "Filter by option on instructor training page.",
                      })}
                    </Button>
                    <Button
                      onClick={() =>
                        setTrainingOpportunitiesFilteredBy(
                          CourseLanguage.French,
                        )
                      }
                      {...(trainingOpportunitiesFilteredBy ===
                      CourseLanguage.French
                        ? selectedFilterStyle
                        : unselectedFilterStyle)}
                    >
                      {intl.formatMessage({
                        defaultMessage: "French only",
                        id: "wBU9X4",
                        description:
                          "Filter by option on instructor training page.",
                      })}
                    </Button>
                  </div>
                  {trainingOpportunities.map((trainingOpportunity) => {
                    const localizedTitle = getLocalizedName(
                      trainingOpportunity.title,
                      intl,
                    );
                    return (
                      <CardBasic
                        key={trainingOpportunity.id}
                        data-h2-margin-bottom="base(x1)"
                      >
                        <div
                          data-h2-display="base(flex)"
                          data-h2-flex-direction="base(column) l-tablet(row)"
                          data-h2-justify-content="base(center) l-tablet(flex-start)"
                          data-h2-align-items="base(center)"
                          data-h2-gap="base(x.75) l-tablet(x.5)"
                          data-h2-margin-bottom="base(x.5)"
                        >
                          <Heading
                            Icon={
                              trainingOpportunity.pinned
                                ? PinnedIcon
                                : CalendarIcon
                            }
                            level="h4"
                            size="h5"
                            data-h2-font-weight="base(700)"
                            data-h2-margin="base(0)"
                            data-h2-text-align="base(center) l-tablet(initial)"
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
                          data-h2-align-items="base(center)"
                        />
                        <CardSeparator />
                        <Dialog.Root>
                          <Dialog.Trigger>
                            <Button mode="text" data-h2-font-weight="base(700)">
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
                            </Button>
                          </Dialog.Trigger>
                          <Dialog.Content>
                            <Dialog.Header>{localizedTitle}</Dialog.Header>
                            <Dialog.Body>
                              <RichTextRenderer
                                node={htmlToRichTextJSON(
                                  getLocalizedName(
                                    trainingOpportunity.description,
                                    intl,
                                  ),
                                )}
                              />
                              <Dialog.Footer>
                                <Link
                                  href={getLocalizedName(
                                    trainingOpportunity.applicationUrl,
                                    intl,
                                  )}
                                  newTab
                                  color="secondary"
                                  mode="solid"
                                >
                                  {intl.formatMessage({
                                    defaultMessage: "Apply now",
                                    id: "PH68o/",
                                    description:
                                      "Label for apply now button in instructor led training",
                                  })}
                                </Link>
                                <Dialog.Close>
                                  <Button
                                    mode="text"
                                    color="warning"
                                    data-h2-font-weight="base(700)"
                                  >
                                    {intl.formatMessage(commonMessages.cancel)}
                                  </Button>
                                </Dialog.Close>
                              </Dialog.Footer>
                            </Dialog.Body>
                          </Dialog.Content>
                        </Dialog.Root>
                      </CardBasic>
                    );
                  })}
                </>
              ) : (
                <Well data-h2-padding="base(x.5)">
                  <p data-h2-text-align="base(center)">
                    {intl.formatMessage({
                      defaultMessage:
                        "There are currently no upcoming training events. Check back later.",
                      id: "l4d7/6",
                      description:
                        "Null message for instructor led training list",
                    })}
                  </p>
                </Well>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

Component.displayName = "InstructorLedTrainingPage";

export default Component;
