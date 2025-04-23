import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion, ThrowNotFound } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import CommunityInterest from "../CommunityInterest/CommunityInterest";

export const CommunitySpecificInfo_Fragment = graphql(/* GraphQL */ `
  fragment CommunitySpecificInfo on EmployeeProfile {
    communityInterests {
      community {
        id
      }
      ...CommunityInterest
    }
  }
`);

export const CommunitySpecificInfoOptions_Fragment = graphql(/* GraphQL */ `
  fragment CommunitySpecificInfoOptions on Query {
    ...CommunityInterestOptions
  }
`);

interface CommunitySpecificInfoProps {
  communitySpecificInfoQuery: FragmentType<
    typeof CommunitySpecificInfo_Fragment
  >;
  communitySpecificInfoOptionsQuery: FragmentType<
    typeof CommunitySpecificInfoOptions_Fragment
  >;
  sectionKey: string;
  communityId: string;
}

const CommunitySpecificInfo = ({
  communitySpecificInfoQuery,
  communitySpecificInfoOptionsQuery,
  sectionKey,
  communityId,
}: CommunitySpecificInfoProps) => {
  const intl = useIntl();

  const communitySpecificInfo = getFragment(
    CommunitySpecificInfo_Fragment,
    communitySpecificInfoQuery,
  );
  const communitySpecificInfoOptions = getFragment(
    CommunitySpecificInfoOptions_Fragment,
    communitySpecificInfoOptionsQuery,
  );

  const communityInterest = unpackMaybes(
    communitySpecificInfo.communityInterests,
  ).find((cI) => cI.community.id === communityId);

  if (communityInterest === undefined) {
    return <ThrowNotFound />;
  }

  return (
    <>
      <Accordion.Item value={sectionKey}>
        <Accordion.Trigger
          as="h3"
          subtitle={intl.formatMessage({
            defaultMessage:
              "The nominee's interest in opportunities in the Financial Management Community.",
            id: "kx17OL",
            description: "Subtitle for community-specific information section",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Community-specific information",
            id: "BPFC5k",
            description: "Title for community-specific information section",
          })}
        </Accordion.Trigger>
        <Accordion.Content>
          <CommunityInterest
            communityInterestQuery={communityInterest}
            communityInterestOptionsQuery={communitySpecificInfoOptions}
            context="admin"
          />
        </Accordion.Content>
      </Accordion.Item>
    </>
  );
};

export default CommunitySpecificInfo;
