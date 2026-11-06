import { useIntl } from "react-intl";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Notice, PreviewList } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import TalentNominationHistoryListItem from "./TalentNominationHistoryListItem";

export const TalentNominationHistory_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationHistory on User {
    talentNominationGroupsAsNominee {
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
    user?.talentNominationGroupsAsNominee,
  ).sort((a, b) => {
    const aDate = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bDate = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bDate - aDate;
  });

  return nominationGroups.length > 0 ? (
    <div className="my-6">
      <PreviewList.Root>
        {nominationGroups.map((nominationGroup) => (
          <TalentNominationHistoryListItem
            key={nominationGroup.id}
            nominationGroupQuery={nominationGroup}
          />
        ))}
      </PreviewList.Root>
    </div>
  ) : (
    <Notice.Root className="my-6">
      <Notice.Content>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Nominations will automatically appear here as you receive them.",
            id: "DNjn83",
            description:
              "Message displayed when an employee has not received any nominations",
          })}
        </p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default TalentNominationHistory;
