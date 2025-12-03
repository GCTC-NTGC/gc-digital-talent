import { useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { ReactNode } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  AccordionMetaData,
  Link,
  PreviewList,
  TaskCard,
  Notice,
} from "@gc-digital-talent/ui";
import { MAX_DATE } from "@gc-digital-talent/date-helpers/const";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";

import TalentNominationListItem from "./TalentNominationListItem";
import PoolCandidateSearchRequestPreviewListItem from "./PoolCandidateSearchRequestPreviewListItem";

const linkAccessor = (href: string, chunks: ReactNode) => {
  return (
    <Link href={href} color="black" size="sm">
      {chunks}
    </Link>
  );
};

// render creation date if nominee is null or present multiple times
const shouldRenderCreatedDateComputation = (
  nomineeId: string | undefined,
  allNomineeIds: (string | undefined)[],
) => {
  if (
    allNomineeIds.reduce(
      (accumulator, currentValue) =>
        currentValue === nomineeId ? accumulator + 1 : accumulator,
      0,
    ) > 1
  ) {
    return true;
  }

  return false;
};

const TalentManagementTaskCard_Fragment = graphql(/* GraphQL */ `
  fragment TalentManagementTaskCard on User {
    talentNominationsAsSubmitter {
      id
      nominee {
        id
      }
      submittedAt
      updatedAt
      talentNominationEvent {
        closeDate
      }

      ...PreviewListItemTalentNomination
    }
    poolCandidateSearchRequests {
      id
      ...PreviewListItemSearchRequest
    }
  }
`);

interface TalentManagementTaskCardProps {
  talentManagementTaskCardQuery: FragmentType<
    typeof TalentManagementTaskCard_Fragment
  >;
}

const TalentManagementTaskCard = ({
  talentManagementTaskCardQuery,
}: TalentManagementTaskCardProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const talentManagementTaskCardFragment = getFragment(
    TalentManagementTaskCard_Fragment,
    talentManagementTaskCardQuery,
  );
  const nominationCount =
    talentManagementTaskCardFragment.talentNominationsAsSubmitter?.length ?? 0;
  const allNomineeIds: (string | undefined)[] =
    talentManagementTaskCardFragment.talentNominationsAsSubmitter?.map(
      (nomination) => nomination.nominee?.id,
    ) ?? [];

  const talentNominationMetaData: AccordionMetaData = [
    {
      key: "new-nomination-key",
      type: "link",
      href: paths.talentManagementEvents(),
      color: "primary",
      children: <>{intl.formatMessage(navigationMessages.newNomination)}</>,
    },
  ];

  const talentRequestMetaData: AccordionMetaData = [
    {
      key: "find-talent-key",
      type: "link",
      href: paths.search(),
      color: "primary",
      children: <>{intl.formatMessage(navigationMessages.newRequest)}</>,
    },
  ];

  const sortedNominations = unpackMaybes(
    talentManagementTaskCardFragment.talentNominationsAsSubmitter,
  )
    .sort((a, b) => {
      const aUpdated = a?.updatedAt ? new Date(a.updatedAt) : MAX_DATE;
      const bUpdated = b?.updatedAt ? new Date(b.updatedAt) : MAX_DATE;
      return aUpdated.getTime() - bUpdated.getTime();
    })
    .sort((a, b) => {
      const aDeadline = a?.talentNominationEvent.closeDate
        ? new Date(a.talentNominationEvent.closeDate)
        : MAX_DATE;
      const bDeadline = b?.talentNominationEvent.closeDate
        ? new Date(b.talentNominationEvent.closeDate)
        : MAX_DATE;
      return aDeadline.getTime() - bDeadline.getTime();
    })
    .sort((a, b) => (a?.submittedAt ? 1 : 0) - (b?.submittedAt ? 1 : 0));

  const poolCandidateSearchRequests = unpackMaybes(
    talentManagementTaskCardFragment.poolCandidateSearchRequests,
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <TaskCard.Root
          icon={Cog8ToothIcon}
          title={intl.formatMessage({
            defaultMessage: "Talent management",
            id: "voqC0s",
            description: "Card title for Talent management",
          })}
          headingColor="success"
          headingAs="h2"
        >
          <>
            {sortedNominations.length > 0 && (
              <TaskCard.Item>
                <Accordion.Root type="multiple">
                  <Accordion.Item value="your_talent_nominations">
                    <Accordion.Trigger
                      as="h3"
                      subtitle={intl.formatMessage({
                        defaultMessage:
                          "Nominate employees for advancement, lateral movement, or development programs. Track submission status or view previous nominations you've submitted.",
                        id: "zCjdD9",
                        description:
                          "Subtitle explaining talent nominations expandable within Talent management card",
                      })}
                    >
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "Talent nominations ({nominationCount})",
                          id: "pOazxP",
                          description:
                            "Collapsible header, Talent nominations and then count",
                        },
                        { nominationCount: nominationCount },
                      )}
                    </Accordion.Trigger>
                    <Accordion.MetaData metadata={talentNominationMetaData} />
                    <Accordion.Content>
                      <div className="mt-3 flex flex-col gap-6">
                        {sortedNominations.length ? (
                          <PreviewList.Root>
                            {sortedNominations.map((talentNominationItem) => (
                              <TalentNominationListItem
                                key={talentNominationItem.id}
                                headingAs="h4"
                                displayCreatedDate={shouldRenderCreatedDateComputation(
                                  talentNominationItem.nominee?.id,
                                  allNomineeIds,
                                )}
                                talentNominationListItemQuery={
                                  talentNominationItem
                                }
                              />
                            ))}
                          </PreviewList.Root>
                        ) : (
                          <Notice.Root className="text-center">
                            <Notice.Title>
                              {intl.formatMessage({
                                defaultMessage:
                                  "You have no active nominations.",
                                id: "mEmT94",
                                description:
                                  "Notice's title when there are no nominations",
                              })}
                            </Notice.Title>
                            <Notice.Content>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    'You can start a nomination by browsing the currently active talent management events using the "New nomination" link.',
                                  id: "73rG7Y",
                                  description:
                                    "Notice's text when there are no nominations",
                                })}
                              </p>
                            </Notice.Content>
                          </Notice.Root>
                        )}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </TaskCard.Item>
            )}
          </>
          <>
            {poolCandidateSearchRequests.length > 0 && (
              <TaskCard.Item>
                <Accordion.Root type="multiple">
                  <Accordion.Item value="your_talent_requests">
                    <Accordion.Trigger
                      as="h3"
                      subtitle={intl.formatMessage(
                        {
                          defaultMessage: `When you submit a request for talent using the "<findTalentLink>Find talent</findTalentLink>" feature, it will appear in this list while it remains active.`,
                          id: "c/XQZ2",
                          description:
                            "Subtitle explaining your talent requests expandable within Talent management card",
                        },
                        {
                          findTalentLink: (chunks: ReactNode) =>
                            linkAccessor(paths.search(), chunks),
                        },
                      )}
                    >
                      {intl.formatMessage(
                        {
                          defaultMessage: "Talent requests ({requestsCount})",
                          id: "IFCSio",
                          description:
                            "Title for a list of talent requests with a count",
                        },
                        {
                          requestsCount: poolCandidateSearchRequests.length,
                        },
                      )}
                    </Accordion.Trigger>
                    <Accordion.MetaData metadata={talentRequestMetaData} />
                    <Accordion.Content>
                      <div className="mt-3 flex flex-col gap-6">
                        {poolCandidateSearchRequests?.length ? (
                          <PreviewList.Root>
                            {poolCandidateSearchRequests?.map((request) => (
                              <PoolCandidateSearchRequestPreviewListItem
                                key={request.id}
                                poolCandidateSearchRequestQuery={request}
                              />
                            ))}
                          </PreviewList.Root>
                        ) : (
                          <Notice.Root className="text-center">
                            <Notice.Title>
                              {intl.formatMessage({
                                defaultMessage:
                                  "You don't have any active requests at the moment.",
                                id: "3PwQT7",
                                description:
                                  "Title for notice when there are no pool candidate search requests",
                              })}
                            </Notice.Title>
                            <Notice.Content>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    'You can start a new talent request using the "New request" button or navigating to the "Find talent" page from the main navigation.',
                                  id: "6jBrNA",
                                  description:
                                    "Body for notice when there are no pool candidate search requests",
                                })}
                              </p>
                            </Notice.Content>
                          </Notice.Root>
                        )}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </TaskCard.Item>
            )}
          </>
        </TaskCard.Root>
      </div>
    </>
  );
};

export default TalentManagementTaskCard;
