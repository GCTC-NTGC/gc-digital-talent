import { useQuery } from "urql";
import type { ComponentProps } from "react";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import permissionConstants from "~/constants/permissionConstants";

import type { RouteParams } from "./types";
import CurrentPositionExperiences from "./components/CurrentPositionExperiences";
import FullCareerExperiences from "./components/FullCareerExperiences";
import type ErrorNotice from "./components/ErrorNotice";

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
  contentHiddenReason?: null | ComponentProps<typeof ErrorNotice>["reason"];
  talentNominationGroupQuery: FragmentType<
    typeof TalentNominationGroupCareerExperience_Fragment
  >;
}

const TalentNominationGroupCareerExperience = ({
  nomineeId,
  contentHiddenReason,
  talentNominationGroupQuery,
}: TalentNominationGroupCareerExperienceProps) => {
  const contentIsVisible = !contentHiddenReason;
  const [{ data: nomineeData, fetching, error }] = useQuery({
    query: NomineeExperiences_Query,
    variables: { nomineeId },
    pause: !contentIsVisible,
  });

  const talentNominationGroup = getFragment(
    TalentNominationGroupCareerExperience_Fragment,
    talentNominationGroupQuery,
  );

  return (
    <Pending fetching={fetching} error={error}>
      <Card space="lg" className="mb-6">
        <CurrentPositionExperiences
          query={nomineeData?.user}
          contentHiddenReason={contentHiddenReason}
        />
      </Card>
      <Card space="lg">
        <FullCareerExperiences
          userQuery={nomineeData?.user}
          talentNominationGroupQuery={talentNominationGroup}
          contentHiddenReason={contentHiddenReason}
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
        isVerifiedGovEmployee
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

  let contentHiddenReason: ComponentProps<
    typeof TalentNominationGroupCareerExperience
  >["contentHiddenReason"] = null;
  if (!data?.talentNominationGroup?.consentToShareProfile) {
    contentHiddenReason = "not-shared-with-community";
  }
  if (!data?.talentNominationGroup?.nominee?.isVerifiedGovEmployee) {
    contentHiddenReason = "not-verified-gov-employee";
  }

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup && nomineeId ? (
        <TalentNominationGroupCareerExperience
          nomineeId={nomineeId}
          contentHiddenReason={contentHiddenReason}
          talentNominationGroupQuery={data.talentNominationGroup}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.viewCommunityTalentNominations}>
    <TalentNominationGroupCareerExperiencePage />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupCareerExperiencePage";

export default Component;
