import { useIntl } from "react-intl";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  AccordionMetaData,
  PreviewList,
  TaskCard,
  Well,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";

import TalentNominationListItem from "./TalentNominationListItem";

// render creation date if nominee is null or present multiple times
const shouldRenderCreatedDateComputation = (
  nomineeId: string | undefined,
  allNomineeIds: string[],
) => {
  if (!nomineeId) {
    return true;
  }
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
      ...PreviewListItemTalentNomination
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
  const allNomineeIds: string[] =
    talentManagementTaskCardFragment.talentNominationsAsSubmitter
      ?.map((nomination) => nomination.nominee?.id)
      .filter(notEmpty) ?? [];

  const talentNominationMetaData: AccordionMetaData[] = [
    {
      key: "new-nomination-key",
      type: "link",
      href: paths.talentManagementEvents(),
      color: "primary",
      children: <>{intl.formatMessage(navigationMessages.newNomination)}</>,
    },
  ];

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <TaskCard.Root
          icon={Cog8ToothIcon}
          title={intl.formatMessage({
            defaultMessage: "Talent management",
            id: "voqC0s",
            description: "Card title for Talent management",
          })}
          headingColor="quinary"
          headingAs="h2"
        >
          <TaskCard.Item>
            <Accordion.Root
              type="multiple"
              data-h2-padding-bottom="base:selectors[>.Accordion__Item > .Accordion__Content](x.5)"
            >
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
                      defaultMessage: "Talent nominations ({nominationCount})",
                      id: "pOazxP",
                      description:
                        "Collapsible header, Talent nominations and then count",
                    },
                    { nominationCount: nominationCount },
                  )}
                </Accordion.Trigger>
                <Accordion.MetaData metadata={talentNominationMetaData} />
                <Accordion.Content>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-gap="base(x1)"
                    data-h2-padding-top="base(x.5)"
                  >
                    {talentManagementTaskCardFragment
                      .talentNominationsAsSubmitter?.length ? (
                      <PreviewList.Root>
                        {talentManagementTaskCardFragment.talentNominationsAsSubmitter.map(
                          (talentNominationItem) => (
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
                          ),
                        )}
                      </PreviewList.Root>
                    ) : (
                      <Well data-h2-text-align="base(center)">
                        <p>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>You have no active nominations.</strong>",
                            id: "a4Wc5h",
                            description:
                              "Notice's title when there are no nominations",
                          })}
                        </p>
                        <p>
                          {intl.formatMessage({
                            defaultMessage:
                              'You can start a nomination by browsing the currently active talent management events using the "New nomination" link.',
                            id: "73rG7Y",
                            description:
                              "Notice's text when there are no nominations",
                          })}
                        </p>
                      </Well>
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </TaskCard.Item>
        </TaskCard.Root>
      </div>
    </>
  );
};

export default TalentManagementTaskCard;
