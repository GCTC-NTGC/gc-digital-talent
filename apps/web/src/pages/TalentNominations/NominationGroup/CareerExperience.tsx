import { useQuery } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import { RouteParams } from "./types";

const TalentNominationGroupCareerExperience_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupCareerExperience on TalentNominationGroup {
    id
  }
`);

interface TalentNominationGroupCareerExperienceProps {
  query: FragmentType<typeof TalentNominationGroupCareerExperience_Fragment>;
}

const TalentNominationGroupCareerExperience = ({
  query,
}: TalentNominationGroupCareerExperienceProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const talentNominationGroup = getFragment(
    TalentNominationGroupCareerExperience_Fragment,
    query,
  );

  return null; // TO DO: Add page in #12854
};

const TalentNominationGroupCareerExperience_Query = graphql(/* GraphQL */ `
  query TalentNominationGroupCareerExperience($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
      ...TalentNominationGroupCareerExperience
    }
  }
`);

const TalentNominationGroupCareerExperiencePage = () => {
  const { talentNominationGroupId } = useRequiredParams<RouteParams>(
    "talentNominationGroupId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: TalentNominationGroupCareerExperience_Query,
    variables: { talentNominationGroupId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup ? (
        <TalentNominationGroupCareerExperience
          query={data.talentNominationGroup}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentNominationGroupCareerExperiencePage />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupCareerExperiencePage";
