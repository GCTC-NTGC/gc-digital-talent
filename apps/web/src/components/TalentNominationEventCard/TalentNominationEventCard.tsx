import { useState } from "react";
import { useIntl } from "react-intl";

import { Heading, Card, Link, Dialog, Button } from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { hasRequiredRoles, useAuthorization } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";

interface TalentNominationEventCardProps {
  talentNominationEventQuery: FragmentType<
    typeof TalentNominationEventCard_Fragment
  >;
}

export const TalentNominationEventCard_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationEventCard on TalentNominationEvent {
    id
    name {
      localized
    }
    description {
      localized
    }
    openDate
    closeDate
    learnMoreUrl {
      localized
    }
    community {
      name {
        localized
      }
    }
  }
`);

const TalentNominationEventCard = ({
  talentNominationEventQuery,
}: TalentNominationEventCardProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { userAuthInfo } = useAuthorization();
  const roleAssignments = userAuthInfo?.roleAssignments?.filter(notEmpty) ?? [];
  const [confirmOpen, setConfirmOpen] = useState(false);

  const talentNominationEvent = getFragment(
    TalentNominationEventCard_Fragment,
    talentNominationEventQuery,
  );

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const isPastEvent = talentNominationEvent.closeDate
    ? new Date() > new Date(talentNominationEvent.closeDate)
    : false;

  const canNominatePast = hasRequiredRoles({
    toCheck: [
      { name: "community_talent_coordinator" },
      { name: "community_admin" },
    ],
    userRoles: roleAssignments,
  });

  const nominationPath = paths.createTalentNomination(talentNominationEvent.id);

  return (
    <>
      <Card className="relative flex flex-col p-9 pt-6">
        <Heading level="h6" className="order-2 font-bold">
          {talentNominationEvent.name.localized}
        </Heading>
        <div className="order-1 drop-shadow-(--ribbon-shadow)">
          <div
            className="relative -ml-10.5 inline-block rounded-l-md bg-secondary-100 py-1 pr-9 pl-10.5 text-sm/normal font-bold text-black dark:text-secondary-700"
            style={{
              clipPath:
                "polygon(0% 0%, 100% 0%, calc(100% - 1rem) 50%, 100% 100%, 0% 100%)",
            }}
          >
            {talentNominationEvent.community?.name?.localized}
          </div>
        </div>
        <div className="order-3">
          <p className="mb-3 text-gray-600 dark:text-gray-200">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Accepting nominations from {openDate} to {closeDate}.",
                id: "8UrSRQ",
                description:
                  "Text for date range values for Accepting nominations",
              },
              {
                openDate: formatDate({
                  date: parseDateTimeUtc(talentNominationEvent.openDate),
                  formatString: DATE_FORMAT_LOCALIZED,
                  intl,
                  timeZone: localTimeZone,
                }),
                closeDate: formatDate({
                  date: parseDateTimeUtc(talentNominationEvent.closeDate),
                  formatString: DATE_FORMAT_LOCALIZED,
                  intl,
                  timeZone: localTimeZone,
                }),
              },
            )}
          </p>
          <p className="mb-6">{talentNominationEvent.description?.localized}</p>
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            {isPastEvent && canNominatePast ? (
              <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
                <Dialog.Trigger>
                  <Button mode="solid" color="primary">
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "Start a nomination<hidden> for {title}</hidden>",
                        id: "ZqGZ2s",
                        description:
                          "Button label to start a nomination for event",
                      },
                      { title: talentNominationEvent.name.localized },
                    )}
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header>
                    {intl.formatMessage({
                      defaultMessage: "Closed nomination event",
                      id: "PONcJx",
                      description:
                        "Title for past talent event confirmation dialog",
                    })}
                  </Dialog.Header>
                  <Dialog.Body>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "This event is already closed. Are you sure you want to submit a nomination?",
                        id: "IAR6nU",
                        description:
                          "Body text for past talent event confirmation dialog",
                      })}
                    </p>

                    <Dialog.Footer>
                      <Link mode="solid" color="primary" href={nominationPath}>
                        {intl.formatMessage({
                          defaultMessage: "Start nomination",
                          id: "9Ky9Y4",
                          description:
                            "Confirm button for past talent event dialog",
                        })}
                      </Link>
                      <Dialog.Close>
                        <Button mode="inline" color="secondary">
                          {intl.formatMessage({
                            defaultMessage: "Close",
                            id: "JI/w8j",
                            description:
                              "Cancel button for past talent event dialog",
                          })}
                        </Button>
                      </Dialog.Close>
                    </Dialog.Footer>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Root>
            ) : (
              !isPastEvent && (
                <Link mode="solid" color="primary" href={nominationPath}>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "Start a nomination<hidden> for {title}</hidden>",
                      id: "ZqGZ2s",
                      description:
                        "Button label to start a nomination for event",
                    },
                    { title: talentNominationEvent.name.localized },
                  )}
                </Link>
              )
            )}
            {talentNominationEvent.learnMoreUrl?.localized && (
              <Link
                color="primary"
                mode="inline"
                href={talentNominationEvent.learnMoreUrl.localized}
                external
                newTab
              >
                {intl.formatMessage(
                  {
                    defaultMessage: "Learn more<hidden> about {title}</hidden>",
                    id: "5dSChw",
                    description: "Button label to Learn more about event",
                  },
                  { title: talentNominationEvent.name.localized },
                )}
              </Link>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default TalentNominationEventCard;
