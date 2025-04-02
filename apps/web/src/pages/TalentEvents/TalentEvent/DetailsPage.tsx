import { useQuery } from "urql";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  CardBasic,
  CardSeparator,
  Heading,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import { RouteParams } from "./types";

const TalentEventDetails_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventDetails on TalentNominationEvent {
    id
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    learnMoreUrl {
      en
      fr
    }
    openDate
    closeDate
    developmentPrograms {
      id
      name {
        localized
      }
    }
  }
`);

interface TalentEventDetailsProps {
  query: FragmentType<typeof TalentEventDetails_Fragment>;
}

const TalentEventDetails = ({ query }: TalentEventDetailsProps) => {
  const intl = useIntl();

  const talentEvent = getFragment(TalentEventDetails_Fragment, query);
  const developmentPrograms = unpackMaybes(
    talentEvent.developmentPrograms,
  ).sort((a, b) =>
    (a.name?.localized ?? "").localeCompare(b.name?.localized ?? ""),
  );

  return (
    <>
      <Heading
        level="h2"
        Icon={CalendarIcon}
        color="primary"
        data-h2-margin-top="base(0)"
      >
        {intl.formatMessage({
          defaultMessage: "Event details",
          id: "PnHH9A",
          description: "Subheading for nomination event details",
        })}
      </Heading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Review the details of the event, manage deadlines, and access talent management tools for nominations and talent placement.",
          id: "ds0NaU",
          description: "Description for the details of a nomination event",
        })}
      </p>
      <CardBasic>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="l-tablet(1fr 1fr)"
          data-h2-gap="base(x1)"
        >
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Event name (English)",
              id: "gXF4Rj",
              description: "Label for nomination event name in English",
            })}
          >
            {talentEvent.name.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Event name (French)",
              id: "BisYQJ",
              description: "Label for nomination event name in French",
            })}
          >
            {talentEvent.name.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Event description (English)",
              id: "axPXQ9",
              description: "Label for nomination event description in English",
            })}
          >
            {talentEvent.description?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Event description (French)",
              id: "e7vPeZ",
              description: "Label for nomination event description in French",
            })}
          >
            {talentEvent.description?.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "More information link (English)",
              id: "dgQIEG",
              description:
                "Label for nomination event more information link in English",
            })}
          >
            <span data-h2-word-break="base(break-all)">
              {talentEvent.learnMoreUrl?.en ??
                intl.formatMessage(commonMessages.notProvided)}
            </span>
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "More information link (French)",
              id: "4q/R7/",
              description:
                "Label for nomination event more information link in French",
            })}
          >
            <span data-h2-word-break="base(break-all)">
              {talentEvent.learnMoreUrl?.fr ??
                intl.formatMessage(commonMessages.notProvided)}
            </span>
          </FieldDisplay>
        </div>
        <CardSeparator space="sm" decorative />
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="l-tablet(1fr 1fr)"
          data-h2-gap="base(x1)"
        >
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Nomination opening date",
              id: "JhEMHT",
              description:
                "Label for nomination event date to start accepting nominations",
            })}
          >
            {talentEvent.openDate
              ? formatDate({
                  date: parseDateTimeUtc(talentEvent.openDate),
                  formatString: "MMMM d, yyyy",
                  intl,
                })
              : intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Nomination closing date",
              id: "pq/4js",
              description:
                "Label for nomination event date to stop accepting nominations",
            })}
          >
            {talentEvent.closeDate
              ? formatDate({
                  date: parseDateTimeUtc(talentEvent.closeDate),
                  formatString: "MMMM d, yyyy",
                  intl,
                })
              : intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
        </div>
        <CardSeparator space="sm" decorative />
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Relevant development programs",
            id: "nhqlFu",
            description:
              "Label for development programs relevant to a nomination event",
          })}
        >
          {developmentPrograms.length > 0 ? (
            <ul>
              {developmentPrograms.map((program) => (
                <li key={program.id}>
                  {program.name?.localized ??
                    intl.formatMessage(commonMessages.notAvailable)}
                </li>
              ))}
            </ul>
          ) : (
            intl.formatMessage(commonMessages.notProvided)
          )}
        </FieldDisplay>
      </CardBasic>
    </>
  );
};

const TalentEventDetails_Query = graphql(/* GraphQL */ `
  query TalentEventDetails($talentEventId: UUID!) {
    talentNominationEvent(id: $talentEventId) {
      ...TalentEventDetails
    }
  }
`);

const TalentEventDetailsPage = () => {
  const { eventId } = useRequiredParams<RouteParams>("eventId");
  const [{ data, fetching, error }] = useQuery({
    query: TalentEventDetails_Query,
    variables: { talentEventId: eventId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationEvent ? (
        <TalentEventDetails query={data.talentNominationEvent} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentEventDetailsPage />
  </RequireAuth>
);

Component.displayName = "TalentEventDetailsPage";
