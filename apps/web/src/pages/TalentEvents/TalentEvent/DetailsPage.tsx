import { useQuery } from "urql";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { useIntl } from "react-intl";
import { useState } from "react";
import { isFuture } from "date-fns/isFuture";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Button,
  Card,
  CardSeparator,
  Heading,
  Link,
  Pending,
  ThrowNotFound,
  Ul,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import permissionConstants from "~/constants/permissionConstants";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

import type { RouteParams } from "./types";

const TalentEventDetails_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventDetails on TalentNominationEvent {
    id
    name {
      en
      fr
      localized
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
    includeLeadershipCompetencies
    community {
      id
      name {
        localized
      }
    }
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
  const paths = useRoutes();
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const talentEvent = getFragment(TalentEventDetails_Fragment, query);
  const developmentPrograms = unpackMaybes(
    talentEvent.developmentPrograms,
  ).sort(
    sortAlphaBy((developmentProgram) => developmentProgram.name?.localized),
  );
  const showCopyButton =
    !talentEvent.closeDate || isFuture(parseDateTimeUtc(talentEvent.closeDate));
  return (
    <>
      <Heading
        level="h2"
        icon={CalendarIcon}
        color="secondary"
        className="mt-0"
      >
        {intl.formatMessage({
          defaultMessage: "Event details",
          id: "PnHH9A",
          description: "Subheading for nomination event details",
        })}
      </Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Review and edit the details of this talent management event.",
          id: "7E14Li",
          description: "Description for the details of a nomination event",
        })}
      </p>
      <Card className="grid gap-6 sm:grid-cols-2">
        {showCopyButton && (
          <>
            <div className="text-right sm:col-span-2">
              <Button
                mode="inline"
                color="primary"
                icon={linkCopied ? CheckIcon : undefined}
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    window.location.protocol +
                      "//" +
                      window.location.host +
                      paths.createTalentNomination(talentEvent.id),
                  );
                  setLinkCopied(true);
                  setTimeout(() => {
                    setLinkCopied(false);
                  }, 2000);
                }}
                aria-label={
                  linkCopied
                    ? intl.formatMessage({
                        defaultMessage: "Nomination link copied",
                        id: "ms0CBt",
                        description:
                          "Button text to indicate that a talent event nomination URL has been copied",
                      })
                    : intl.formatMessage(
                        {
                          defaultMessage:
                            "Copy {title} nomination URL to clipboard",
                          id: "zxHKZ2",
                          description:
                            "Button text to copy a create talent event URL",
                        },
                        {
                          title: talentEvent.name.localized,
                        },
                      )
                }
              >
                {linkCopied
                  ? intl.formatMessage({
                      defaultMessage: "Nomination link copied",
                      id: "ms0CBt",
                      description:
                        "Button text to indicate that a talent event nomination URL has been copied",
                    })
                  : intl.formatMessage({
                      defaultMessage: "Copy nomination link",
                      id: "vV5a2X",
                      description: "Button text to copy a nomination URL",
                    })}
              </Button>
            </div>
            <div className="sm:col-span-2">
              <CardSeparator space="none" decorative />
            </div>
          </>
        )}
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Event name",
            id: "XFF/p+",
            description: "Label for nomination event name",
          })}
          appendLanguageToLabel={"en"}
        >
          {talentEvent.name.en ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Event name",
            id: "XFF/p+",
            description: "Label for nomination event name",
          })}
          appendLanguageToLabel={"fr"}
        >
          {talentEvent.name.fr ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Event description",
            id: "9mrSt3",
            description: "Label for nomination event description",
          })}
          appendLanguageToLabel={"en"}
        >
          {talentEvent.description?.en ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Event description",
            id: "9mrSt3",
            description: "Label for nomination event description",
          })}
          appendLanguageToLabel={"fr"}
        >
          {talentEvent.description?.fr ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "More information link",
            id: "uWNoOD",
            description: "Label for nomination event more information link",
          })}
          appendLanguageToLabel={"en"}
        >
          {talentEvent.learnMoreUrl?.en ? (
            <Link
              mode="text"
              external
              newTab
              href={talentEvent.learnMoreUrl.en}
              className="break-all"
            >
              {talentEvent.learnMoreUrl.en}
            </Link>
          ) : (
            intl.formatMessage(commonMessages.notProvided)
          )}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "More information link",
            id: "uWNoOD",
            description: "Label for nomination event more information link",
          })}
          appendLanguageToLabel={"fr"}
        >
          {talentEvent.learnMoreUrl?.fr ? (
            <Link
              mode="text"
              external
              newTab
              href={talentEvent.learnMoreUrl.fr}
              className="break-all"
            >
              {talentEvent.learnMoreUrl.fr}
            </Link>
          ) : (
            intl.formatMessage(commonMessages.notProvided)
          )}
        </FieldDisplay>
        <div className="sm:col-span-2">
          <CardSeparator space="none" decorative />
        </div>
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
                formatString: DATE_FORMAT_LOCALIZED,
                intl,
                timeZone: "Canada/Pacific",
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
                formatString: DATE_FORMAT_LOCALIZED,
                intl,
                timeZone: "Canada/Pacific",
              })
            : intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Leadership competencies",
            id: "LSErl5",
            description: "label for the include leadership competencies",
          })}
        >
          <BoolCheckIcon value={talentEvent.includeLeadershipCompetencies}>
            {intl.formatMessage({
              defaultMessage:
                "Leadership competencies are required to be nominated for this event",
              id: "A3m7l/",
              description: "Label for the include leadership competencies",
            })}
          </BoolCheckIcon>
        </FieldDisplay>
        <div className="sm:col-span-2">
          <CardSeparator space="none" decorative />
        </div>
        <FieldDisplay
          label={intl.formatMessage(adminMessages.community)}
          className="sm:col-span-2"
        >
          {talentEvent.community
            ? talentEvent.community.name?.localized
            : intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Relevant development programs",
            id: "nhqlFu",
            description:
              "Label for development programs relevant to a nomination event",
          })}
          className="sm:col-span-2"
        >
          {developmentPrograms.length > 0 ? (
            <Ul>
              {developmentPrograms.map((program) => (
                <li key={program.id}>
                  {program.name?.localized ??
                    intl.formatMessage(commonMessages.notAvailable)}
                </li>
              ))}
            </Ul>
          ) : (
            intl.formatMessage(commonMessages.notProvided)
          )}
        </FieldDisplay>
        <div className="self-start sm:col-span-2">
          <CardSeparator />
          <div>
            <Link
              href={paths.updateTalentManagementEvent(talentEvent.id)}
              className="font-bold"
            >
              {intl.formatMessage({
                defaultMessage: "Edit talent nomination event",
                id: "eEVJFa",
                description:
                  "Link to edit the currently viewed talent nomination event",
              })}
            </Link>
          </div>
        </div>
      </Card>
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
  <RequireAuth roles={permissionConstants.viewCommunityTalentNominations}>
    <TalentEventDetailsPage />
  </RequireAuth>
);

Component.displayName = "TalentEventDetailsPage";

export default Component;
