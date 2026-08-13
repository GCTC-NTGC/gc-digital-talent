import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { graphql } from "@gc-digital-talent/graphql";
import { Notice, Pending, PreviewList } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import NominationsReceivedListItem from "./NominationsReceivedListItem";

const NominationsReceived_Query = graphql(/* GraphQL */ `
  query NominationsReceived {
    me {
      id
      talentNominationGroupsAsNominee {
        id
        createdAt
        ...NominationsReceivedListItem
      }
    }
  }
`);

interface NominationsReceivedProps {
  isVerifiedGovEmployee?: boolean;
}

const NominationsReceived = ({
  isVerifiedGovEmployee = false,
}: NominationsReceivedProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: NominationsReceived_Query,
  });

  // Sort nomination groups by received date most recent first.
  const nominationGroups = unpackMaybes(
    data?.me?.talentNominationGroupsAsNominee,
  ).sort((a, b) => {
    const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate;
  });

  return (
    <Pending fetching={fetching} error={error}>
      {nominationGroups.length > 0 ? (
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
      )}
    </Pending>
  );
};

export default NominationsReceived;
