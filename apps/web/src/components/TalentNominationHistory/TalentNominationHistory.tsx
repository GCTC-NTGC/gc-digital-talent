import { useIntl } from "react-intl";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion, Notice, PreviewList } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import TalentNominationHistoryListItem from "./TalentNominationHistoryListItem";

export const TalentNominationHistory_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationHistory on User {
    talentNominationGroupsAsRecruiter {
      id
      updatedAt
      ...TalentNominationHistoryListItem
    }
  }
`);

interface TalentNominationHistoryProps {
  userQuery: FragmentType<typeof TalentNominationHistory_Fragment>;
}

const TalentNominationHistory = ({
  userQuery,
}: TalentNominationHistoryProps) => {
  const intl = useIntl();
  const user = getFragment(TalentNominationHistory_Fragment, userQuery);

  // Sort nomination groups by accepted date most recent first.
  const nominationGroups = unpackMaybes(
    user?.talentNominationGroupsAsRecruiter,
  ).sort((a, b) => {
    const aDate = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bDate = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bDate - aDate;
  });

  return nominationGroups.length > 0 ? (
    <Accordion.Root type="multiple" mode="card">
      {nominationGroups.map((nominationGroup) => (
        <Accordion.Item value={nominationGroup.id} key={nominationGroup.id}>
          <div className="p-6">
            <PreviewList.Root>
              <TalentNominationHistoryListItem
                nominationGroupQuery={nominationGroup}
              />
            </PreviewList.Root>
          </div>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ) : (
    <Notice.Root>
      <Notice.Content>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Nominations will automatically appear here as the employee receives them.",
            id: "5qDoKZ",
            description:
              "Message displayed when an employee has not received any nominations",
          })}
        </p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default TalentNominationHistory;
