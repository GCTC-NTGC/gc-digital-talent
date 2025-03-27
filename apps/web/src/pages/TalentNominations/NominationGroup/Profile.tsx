import { useQuery } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import { RouteParams } from "./types";

const TalentNominationGroupProfile_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupProfile on TalentNominationGroup {
    id
  }
`);

interface TalentNominationGroupProfileProps {
  query: FragmentType<typeof TalentNominationGroupProfile_Fragment>;
}

const TalentNominationGroupProfile = ({
  query,
}: TalentNominationGroupProfileProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const talentNominationGroup = getFragment(
    TalentNominationGroupProfile_Fragment,
    query,
  );

  return null; // TO DO: Add page in #12853
};

const TalentNominationGroupProfile_Query = graphql(/* GraphQL */ `
  query TalentNominationGroupProfile($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
      ...TalentNominationGroupProfile
    }
  }
`);

const TalentNominationGroupProfilePage = () => {
  const { talentNominationGroupId } = useRequiredParams<RouteParams>(
    "talentNominationGroupId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: TalentNominationGroupProfile_Query,
    variables: { talentNominationGroupId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup ? (
        <TalentNominationGroupProfile query={data.talentNominationGroup} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentNominationGroupProfilePage />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupProfilePage";
