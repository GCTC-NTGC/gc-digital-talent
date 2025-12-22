import { useQuery } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import { RouteParams } from "./types";
import CurrentPositionExperiences from "./components/CurrentPositionExperiences";
import FullCareerExperiences from "./components/FullCareerExperiences";

const TalentNominationGroupCareerExperience_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupCareerExperience on TalentNominationGroup {
    ...FullCareerExperiencesTalentNominationGroup
  }
`);

// we have to run a separate query for the nominee since the event only has basic details and we want to hold this until we know we have consent to query
const NomineeExperiences_Query = graphql(/* GraphQL */ `
  query NomineeExperiences($nomineeId: UUID!) {
    user(id: $nomineeId) {
      ...CurrentPositionExperiences
      ...FullCareerExperiencesUser
    }
  }
`);

interface TalentNominationGroupCareerExperienceProps {
  nomineeId: string;
  shareProfile?: boolean;
  talentNominationGroupQuery: FragmentType<
    typeof TalentNominationGroupCareerExperience_Fragment
  >;
}

const TalentNominationGroupCareerExperience = ({
  nomineeId,
  shareProfile,
  talentNominationGroupQuery,
}: TalentNominationGroupCareerExperienceProps) => {
  const [{ data: nomineeData, fetching, error }] = useQuery({
    query: NomineeExperiences_Query,
    variables: { nomineeId },
    pause: !shareProfile,
  });

  const talentNominationGroup = getFragment(
    TalentNominationGroupCareerExperience_Fragment,
    talentNominationGroupQuery,
  );

  return (
    <Pending fetching={fetching} error={error}>
      <Card className="mb-6 flex flex-col gap-y-3">
        <CurrentPositionExperiences
          query={nomineeData?.user}
          shareProfile={shareProfile}
        />
      </Card>
      <Card className="mb-6 flex flex-col gap-y-3">
        <FullCareerExperiences
          userQuery={nomineeData?.user}
          talentNominationGroupQuery={talentNominationGroup}
          shareProfile={shareProfile}
        />
      </Card>
    </Pending>
  );
};

const TalentNominationGroupCareerExperience_Query = graphql(/* GraphQL */ `
  query TalentNominationGroupCareerExperience($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
      ...TalentNominationGroupCareerExperience
      consentToShareProfile
      nominee {
        id
      }
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

  const nomineeId = data?.talentNominationGroup?.nominee?.id;
  const shareProfile = data?.talentNominationGroup?.consentToShareProfile;

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup && nomineeId && shareProfile !== null ? (
        <TalentNominationGroupCareerExperience
          nomineeId={nomineeId}
          shareProfile={shareProfile}
          talentNominationGroupQuery={data.talentNominationGroup}
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

export default Component;
