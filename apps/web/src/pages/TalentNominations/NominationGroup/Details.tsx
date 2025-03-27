import { useQuery } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import { RouteParams } from "./types";

const TalentNominationGroupDetails_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupDetails on TalentNominationGroup {
    id
  }
`);

interface TalentNominationGroupDetailsProps {
  query: FragmentType<typeof TalentNominationGroupDetails_Fragment>;
}

const TalentNominationGroupDetails = ({
  query,
}: TalentNominationGroupDetailsProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const talentNominationGroup = getFragment(
    TalentNominationGroupDetails_Fragment,
    query,
  );

  return null; // TO DO: Add page in #12852
};

const TalentNominationGroupDetails_Query = graphql(/* GraphQL */ `
  query TalentNominationGroupDetails($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
      ...TalentNominationGroupDetails
    }
  }
`);

const TalentNominationGroupDetailsPage = () => {
  const { talentNominationGroupId } = useRequiredParams<RouteParams>(
    "talentNominationGroupId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: TalentNominationGroupDetails_Query,
    variables: { talentNominationGroupId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup ? (
        <TalentNominationGroupDetails query={data.talentNominationGroup} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentNominationGroupDetailsPage />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupDetailsPage";
