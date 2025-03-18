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
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

import TalentNominationListItem from "./TalentNominationListItem";

const TalentManagementTaskCard_Fragment = graphql(/* GraphQL */ `
  fragment TalentManagementTaskCard on User {
    talentNominationsAsSubmitter {
      id
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
                  {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
                  {`${intl.formatMessage(commonMessages.talentNominations)} (${talentManagementTaskCardFragment.talentNominationsAsSubmitter?.length ?? 0})`}
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
                              talentNominationListItemQuery={
                                talentNominationItem
                              }
                            />
                          ),
                        )}
                      </PreviewList.Root>
                    ) : (
                      <Well data-h2-text-align="base(center)">
                        <p data-h2-font-weight="base(bold)">
                          {intl.formatMessage({
                            defaultMessage: "You have no active nominations.",
                            id: "mEmT94",
                            description:
                              "Notice's title when there are no nominations",
                          })}
                        </p>
                        <p>
                          {intl.formatMessage({
                            defaultMessage:
                              'You can start a nomination by browsing the currently active talent nomination events using the "New nomination" button.',
                            id: "oQxQJM",
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
