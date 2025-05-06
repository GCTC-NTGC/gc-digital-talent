import { useQuery } from "urql";
import useIntl from "react-intl/src/components/useIntl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";

import { graphql } from "@gc-digital-talent/graphql";
import {
  CardBasic,
  Heading,
  Pending,
  Separator,
  ThrowNotFound,
  Well,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { empty } from "@gc-digital-talent/helpers";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import { RouteParams } from "./types";
import CurrentPositionExperiences from "./components/CurrentPositionExperiences";
import FullCareerExperiences from "./components/FullCareerExperiences";

const NomineeExperiences_Query = graphql(/* GraphQL */ `
  query NomineeExperiences($nomineeId: UUID!) {
    user(id: $nomineeId) {
      updatedDate
      ...CurrentPositionExperiences
      ...FullCareerExperiences
    }
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

  const lastUpdated = data?.user?.updatedDate
    ? formatDate({
        date: parseDateTimeUtc(data.user.updatedDate),
        formatString: "MMMM d, yyyy",
        intl,
      })
    : intl.formatMessage(commonMessages.notProvided);

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
          <Heading
            Icon={FlagIcon}
            level="h2"
            color="primary"
            data-h2-margin="base(x1.5 x1.5 0 x1.5)"
            data-h2-font-weight="base(400)"
          >
            {intl.formatMessage({
              defaultMessage: "Current position",
              id: "elMgS2",
              description: "Heading for current position",
            })}
          </Heading>
          <p data-h2-margin="base(x.5 x1.5 x1 x1.5)">
            {intl.formatMessage({
              defaultMessage:
                "This section shows the candidate's current role. If it's an acting role, the candidate's substantive role will also appear here if they've provided it. Select individual experiences to see more details.",
              id: "R1QSIY",
              description:
                "Description for the career page current role section",
            })}
          </p>
          {shareProfile && (
            <Separator data-h2-margin="base(0 0 x1 0)" space="none" />
          )}
          {shareProfile && !empty(data?.user) && (
            <div data-h2-margin="base(0 x1.5)">
              <CurrentPositionExperiences query={data.user} />
            </div>
          )}
          {!shareProfile && (
            <Well data-h2-margin="base(0 x1.5 x1.75 x1.5)" color="error">
              <p
                data-h2-margin-bottom="base(x1)"
                data-h2-font-weight="base(700)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "This nominee has not agreed to share their information with your community",
                  id: "4ujr5X",
                  description: "Null message for nominee profile",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Nominees can agree to provide access to their profile using the “Functional communities” tool on their dashboard.",
                  id: "8plD42",
                  description: "Null secondary message for nominee profile",
                })}
              </p>
            </Well>
          )}
          {shareProfile && (
            <Separator data-h2-margin="base(x1 0)" space="none" />
          )}
          {shareProfile && (
            <p
              data-h2-color="base(black.light)"
              data-h2-margin="base(0 x1.5 x1.75 x1.5)"
            >
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Nominee's profile was last updated on: {lastUpdated}",
                  id: "guYbEb",
                  description: "Last time user's profile was updated",
                },
                { lastUpdated },
              )}
            </p>
          )}
        </div>
      </CardBasic>
      {data?.user ? (
        <CardBasic>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x.5 0)"
            data-h2-margin-bottom="base(x1)"
          >
            <FullCareerExperiences
              query={data.user}
              shareProfile={shareProfile}
            />
          </div>
        </CardBasic>
      ) : null}
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
