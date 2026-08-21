import { useIntl } from "react-intl";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Notice, PreviewList } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import NominationsReceivedListItem from "./NominationsReceivedListItem";

export const NominationsReceived_Fragment = graphql(/* GraphQL */ `
  fragment NominationsReceived on User {
    talentNominationGroupsAsNominee {
      id
      createdAt
      ...NominationsReceivedListItem
    }
  }
`);

interface NominationsReceivedProps {
  userQuery: FragmentType<typeof NominationsReceived_Fragment>;
  isVerifiedGovEmployee?: boolean;
}

const NominationsReceived = ({
  userQuery,
  isVerifiedGovEmployee = false,
}: NominationsReceivedProps) => {
  const intl = useIntl();
  const user = getFragment(NominationsReceived_Fragment, userQuery);

  // Sort nomination groups by received date most recent first.
  const nominationGroups = unpackMaybes(
    user?.talentNominationGroupsAsNominee,
  ).sort((a, b) => {
    const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate;
  });

  return nominationGroups.length > 0 ? (
    <PreviewList.Root>
      {nominationGroups.map((nominationGroup) => (
        <NominationsReceivedListItem
          key={nominationGroup.id}
          nominationGroupQuery={nominationGroup}
        />
      ))}
    </PreviewList.Root>
  ) : (
    isVerifiedGovEmployee && (
      <Notice.Root className="mt-6.75">
        <Notice.Content>
          <p className="text-center">
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
    )
  );
};

export default NominationsReceived;
