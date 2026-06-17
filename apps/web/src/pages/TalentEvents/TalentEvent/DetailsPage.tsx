import { useQuery } from "urql";
import { useIntl } from "react-intl";
import { useState } from "react";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import type {
  FragmentType,
  LocalizedTalentNominationEventStatus,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Button,
  Card,
  CardSeparator,
  Heading,
  Link,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";
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
import DevelopmentProgramCard from "~/components/DevelopmentProgramCard/DevelopmentProgramCard";

import type { RouteParams } from "./types";
import { statusCell } from "../components/helpers";

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
    communityDevelopmentPrograms(trashed: WITH) {
      id
      developmentProgram {
        id
        name {
          localized
        }
        descriptionForProfile {
          localized
        }
      }
      pivot {
        descriptionForNominations {
          en
          fr
        }
      }
    }
    status {
      value
      label {
        localized
      }
    }
  }
`);

interface StatusChipProps {
  status: LocalizedTalentNominationEventStatus | null | undefined;
}

const StatusChip = ({ status }: StatusChipProps) => {
  return <span>{statusCell(status)}</span>;
};

interface TalentEventDetailsProps {
  query: FragmentType<typeof TalentEventDetails_Fragment>;
}

const TalentEventDetails = ({ query }: TalentEventDetailsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const talentEvent = getFragment(TalentEventDetails_Fragment, query);

  const developmentPrograms = unpackMaybes(
    talentEvent.communityDevelopmentPrograms,
  )
    .flatMap((cdp) => ({
      developmentProgram: cdp.developmentProgram,
      descriptionForNomination: cdp.pivot?.descriptionForNominations,
    }))
    .sort(sortAlphaBy((i) => i.developmentProgram.name.localized));

  const notFound = intl.formatMessage(commonMessages.notFound);

  return (
    <>
      <Card className="grid gap-6 sm:grid-cols-2">
        <div className="col-span-2 flex items-center justify-between">
          <Heading
            level="h2"
            icon={QueueListIcon}
            color="primary"
            className="m-0"
          >
            {intl.formatMessage(adminMessages.eventDetails)}
          </Heading>
          <div className="flex flex-col items-center justify-center gap-6 text-right sm:col-span-2 sm:flex-row">
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
            <StatusChip status={talentEvent.status} />
          </div>
        </div>
        <p className="col-span-2 my-6">
          {intl.formatMessage({
            defaultMessage:
              "The event name, description and information link in both official languages.",
            id: "pjxgBI",
            description: "Description for the details of a nomination event",
          })}
        </p>
        <p className="font-bold">
          {talentEvent.name.en ??
            intl.formatMessage(commonMessages.notProvided)}
        </p>
        <p className="font-bold">
          {talentEvent.name.fr ??
            intl.formatMessage(commonMessages.notProvided)}
        </p>
        <>
          {talentEvent.learnMoreUrl?.en && (
            <Link
              mode="text"
              external
              newTab
              href={talentEvent.learnMoreUrl.en}
              className="-mt-3 break-all"
            >
              {talentEvent.learnMoreUrl.en}
            </Link>
          )}
        </>
        <>
          {talentEvent.learnMoreUrl?.fr && (
            <Link
              mode="text"
              external
              newTab
              href={talentEvent.learnMoreUrl.fr}
              className="-mt-3 break-all"
            >
              {talentEvent.learnMoreUrl.fr}
            </Link>
          )}
        </>
        <p>
          {talentEvent.description?.en ??
            intl.formatMessage(commonMessages.notProvided)}
        </p>
        <p>
          {talentEvent.description?.fr ??
            intl.formatMessage(commonMessages.notProvided)}
        </p>
        <div className="sm:col-span-2">
          <CardSeparator space="none" decorative />
        </div>
        <Heading
          level="h3"
          color="primary"
          className="col-span-2 m-0"
          size="h6"
        >
          {intl.formatMessage({
            defaultMessage: "Nomination settings",
            id: "cM66Sh",
            description: "Subheading for nomination event details",
          })}
        </Heading>
        <p className="col-span-2 -mt-3">
          {intl.formatMessage({
            defaultMessage:
              "The start and end dates for the nomination period, the types of nominations that can be submitted and whether leadership competencies are required upon submission.",
            id: "zgLR8q",
            description: "Description before nomination settings",
          })}
        </p>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Nomination submission period",
            id: "THsT/q",
            description: "Label for nomination event submission period",
          })}
          className="col-span-2"
        >
          <span>
            {intl.formatMessage(
              {
                defaultMessage: "{openDate} to {closeDate}",
                id: "FBXx0v",
                description:
                  "Message for submission period for nomination event",
              },
              {
                openDate: talentEvent.openDate
                  ? formatDate({
                      date: parseDateTimeUtc(talentEvent.openDate),
                      formatString: DATE_FORMAT_LOCALIZED,
                      intl,
                      timeZone: "Canada/Pacific",
                    })
                  : intl.formatMessage(commonMessages.notProvided),
                closeDate: talentEvent.closeDate
                  ? formatDate({
                      date: parseDateTimeUtc(talentEvent.closeDate),
                      formatString: DATE_FORMAT_LOCALIZED,
                      intl,
                      timeZone: "Canada/Pacific",
                    })
                  : intl.formatMessage(commonMessages.notProvided),
              },
            )}
          </span>
        </FieldDisplay>
        <BoolCheckIcon
          value={talentEvent.includeLeadershipCompetencies}
          className="col-span-2"
        >
          {intl.formatMessage({
            defaultMessage:
              "Leadership competencies are required to be nominated for this event",
            id: "A3m7l/",
            description: "Label for the include leadership competencies",
          })}
        </BoolCheckIcon>
        <div className="col-span-2">
          <CardSeparator space="none" decorative />
        </div>
        <FieldDisplay
          label={intl.formatMessage(adminMessages.community)}
          className="col-span-2"
        >
          {talentEvent.community
            ? talentEvent.community.name?.localized
            : intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(adminMessages.developmentOpportunities)}
          className="col-span-2"
        >
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage:
                "Professionalization options provided to nominators as potential development opportunity recommendations during the nomination process.",
              id: "Ktxmhc",
              description: "Description above development opportunities",
            })}
          </p>
          {developmentPrograms.length > 0 ? (
            <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
              <DevelopmentProgramCard.Root>
                {developmentPrograms.map((dp) => (
                  <DevelopmentProgramCard.Item
                    id={dp.developmentProgram.id}
                    key={dp.developmentProgram.id}
                    title={dp.developmentProgram.name.localized ?? notFound}
                    description={
                      <>
                        <span className="mb-3 block">
                          {dp.developmentProgram.descriptionForProfile
                            .localized ?? notFound}
                        </span>
                        {dp.descriptionForNomination && (
                          <span>{dp.descriptionForNomination[locale]}</span>
                        )}
                      </>
                    }
                    actions={false}
                  />
                ))}
              </DevelopmentProgramCard.Root>
            </div>
          ) : (
            intl.formatMessage(commonMessages.notProvided)
          )}
        </FieldDisplay>
        <div className="col-span-2">
          <CardSeparator space="none" decorative />
        </div>
        <div className="col-span-2">
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
