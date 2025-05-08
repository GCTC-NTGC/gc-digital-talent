import { useQuery } from "urql";
import { useIntl } from "react-intl";

import { graphql } from "@gc-digital-talent/graphql";
import {
  CardBasic,
  NotFound,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import messages from "~/messages/profileMessages";

import { RouteParams } from "./types";
import CurrentPositionExperiences from "./components/CurrentPositionExperiences";
import FullCareerExperiences from "./components/FullCareerExperiences";

const NomineeExperiences_Query = graphql(/* GraphQL */ `
  query NomineeExperiences($nomineeId: UUID!) {
    user(id: $nomineeId) {
      ...CurrentPositionExperiences
      ...FullCareerExperiences
    }
    ...FullCareerExperiencesOptions
  }
`);

interface TalentNominationGroupCareerExperienceProps {
  nomineeId: string;
  shareProfile?: boolean;
}

const TalentNominationGroupCareerExperience = ({
  nomineeId,
  shareProfile,
}: TalentNominationGroupCareerExperienceProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: NomineeExperiences_Query,
    variables: { nomineeId },
    pause: !shareProfile,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <CardBasic
        data-h2-border-radius="base(6px 6px 0 0)"
        data-h2-padding="base(0)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
          data-h2-margin-bottom="base(x1)"
        >
          <CurrentPositionExperiences
            query={data?.user}
            shareProfile={shareProfile}
          />
        </div>
      </CardBasic>
      <CardBasic>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
          data-h2-margin-bottom="base(x1)"
        >
          <FullCareerExperiences
            query={data?.user}
            optionsQuery={data}
            shareProfile={shareProfile}
          />
        </div>
      </CardBasic>
    </Pending>
  );
};

const TalentNominationGroupCareerExperience_Query = graphql(/* GraphQL */ `
  query TalentNominationGroupCareerExperience($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
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
  const [{ data, fetching, error }] = useQuery<{
    talentNominationGroup?: {
      consentToShareProfile: boolean;
      nominee: { id: string };
    };
  }>({
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
