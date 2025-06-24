import { useIntl } from "react-intl";
import { useQuery } from "urql";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

import {
  Card,
  Container,
  Flourish,
  Heading,
  Link,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

import useRequiredParams from "~/hooks/useRequiredParams";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import DataRow from "~/components/DataRow/DataRow";

import formLabels from "./formLabels";

const TrainingOpportunityPage_Fragment = graphql(/* GraphQL */ `
  fragment TrainingOpportunityPage on TrainingOpportunity {
    id
    title {
      localized
    }
    description {
      localized
    }
    courseLanguage {
      value
      label {
        localized
      }
    }
    courseFormat {
      value
      label {
        localized
      }
    }
    registrationDeadline
    trainingStart
    trainingEnd
    applicationUrl {
      localized
    }
  }
`);

const TrainingOpportunity_Query = graphql(/* GraphQL */ `
  query TrainingOpportunity($id: UUID!) {
    trainingOpportunity(id: $id) {
      ...TrainingOpportunityPage
    }
  }
`);

interface RouteParams extends Record<string, string> {
  id: string;
}

interface TrainingOpportunityProps {
  query: FragmentType<typeof TrainingOpportunityPage_Fragment>;
}

const TrainingOpportunityPage = ({ query }: TrainingOpportunityProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const trainingOpportunity = getFragment(
    TrainingOpportunityPage_Fragment,
    query,
  );

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
      {
        label: trainingOpportunity.title?.localized,
        url: paths.instructorLedTrainingOpportunity(trainingOpportunity.id),
      },
    ],
  });

  let trainingDateLabel = intl.formatMessage({
    defaultMessage: "Training date",
    id: "yd+VEB",
    description: "Label for training date meta data",
  });
  let trainingDateValue;

  if (trainingOpportunity.trainingStart) {
    trainingDateValue = formatDate({
      date: parseDateTimeUtc(trainingOpportunity.trainingStart),
      formatString: "MMMM d, yyyy",
      intl,
    });
  }

  if (trainingOpportunity.trainingStart && trainingOpportunity.trainingEnd) {
    trainingDateLabel = intl.formatMessage({
      defaultMessage: "Training dates",
      id: "yK0vlP",
      description: "Label for training dates meta data",
    });

    trainingDateValue = `${formatDate({
      date: parseDateTimeUtc(trainingOpportunity.trainingStart),
      formatString: "MMMM d, yyyy",
      intl,
    })} - ${formatDate({
      date: parseDateTimeUtc(trainingOpportunity.trainingEnd),
      formatString: "MMMM d, yyyy",
      intl,
    })}`;
  }

  return (
    <>
      <SEO
        title={trainingOpportunity.title?.localized ?? ""}
        description={intl.formatMessage({
          defaultMessage:
            "Learn more about this training opportunity and apply.",
          id: "7L19hE",
          description: "Subtitle for training opportunity single page",
        })}
      />
      <Hero
        title={trainingOpportunity.title?.localized}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Learn more about this training opportunity and apply.",
          id: "7L19hE",
          description: "Subtitle for training opportunity single page",
        })}
        crumbs={crumbs}
      />
      <Container>
        <Heading
          icon={InformationCircleIcon}
          size="h2"
          color="primary"
          className="mt-18 mb-6 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Course details",
            id: "yjZ5Lz",
            description: "Heading for section course details",
          })}
        </Heading>
        <Card>
          <DataRow
            hideSeparator
            label={
              intl.formatMessage(formLabels.applicationDeadline) +
              intl.formatMessage(commonMessages.dividingColon)
            }
            value={
              trainingOpportunity?.registrationDeadline
                ? formatDate({
                    date: parseDateTimeUtc(
                      trainingOpportunity?.registrationDeadline,
                    ),
                    formatString: "MMMM d, yyyy",
                    intl,
                  })
                : intl.formatMessage(commonMessages.notFound)
            }
          />
          <DataRow
            label={
              trainingDateLabel +
              intl.formatMessage(commonMessages.dividingColon)
            }
            value={trainingDateValue}
          />
          <DataRow
            label={
              intl.formatMessage(formLabels.courseLanguage) +
              intl.formatMessage(commonMessages.dividingColon)
            }
            value={trainingOpportunity?.courseLanguage?.label.localized}
          />
          <DataRow
            label={
              intl.formatMessage(formLabels.format) +
              intl.formatMessage(commonMessages.dividingColon)
            }
            value={trainingOpportunity?.courseFormat?.label.localized}
          />
          <DataRow
            label={""}
            value={
              <Link
                href={trainingOpportunity.applicationUrl?.localized ?? ""}
                color="primary"
                mode="solid"
                external
                newTab
              >
                {intl.formatMessage({
                  defaultMessage: "Apply now",
                  id: "PH68o/",
                  description:
                    "Label for apply now button in instructor led training",
                })}
              </Link>
            }
          />
        </Card>
        {trainingOpportunity?.description?.localized ? (
          <>
            <Heading size="h3" className="mt-18 mb-6">
              {intl.formatMessage({
                defaultMessage: "Course description",
                id: "IFTwDy",
                description: "Heading for section course description",
              })}
            </Heading>
            <div className="mb-6">
              <RichTextRenderer
                node={htmlToRichTextJSON(
                  trainingOpportunity.description.localized,
                )}
              />
            </div>
          </>
        ) : null}
        <Link
          href={trainingOpportunity.applicationUrl?.localized ?? ""}
          color="secondary"
          mode="solid"
          external
          newTab
          className="mb-18"
        >
          {intl.formatMessage({
            defaultMessage: "Apply now",
            id: "PH68o/",
            description:
              "Label for apply now button in instructor led training",
          })}
        </Link>
      </Container>
      <Flourish />
    </>
  );
};

export const Component = () => {
  const { id } = useRequiredParams<RouteParams>("id");
  const [{ data, fetching, error }] = useQuery({
    query: TrainingOpportunity_Query,
    variables: { id },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.trainingOpportunity ? (
        <TrainingOpportunityPage query={data.trainingOpportunity} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

Component.displayName = "TrainingOpportunityPage";

export default Component;
