import { useIntl } from "react-intl";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import { useQuery, type OperationContext } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import talentRequestMessages from "~/messages/talentRequestMessages";
import useRequiredParams from "~/hooks/useRequiredParams";

import TalentRequestSectionCard from "./components/TalentRequestSectionCard";
import TalentRequestTrackedUsersInbox from "./components/TalentRequestTrackedUsersInbox/TalentRequestTrackedUsersInbox";
import type { RouteParams } from "./types";

const TalentRequestTracking_Query = graphql(/** GraphQL */ `
  query TalentRequestTracking($id: UUID!) {
    talentRequest(id: $id) {
      applicantFilter {
        skills {
          ...TalentRequestUserSkillMatch
        }
      }
    }

    ...TalentRequestReferralDialogOptions
  }
`);

const context: Partial<OperationContext> = {
  // Keep these query results tied to tracked-user mutations, even for empty lists.
  additionalTypenames: ["TalentRequest", "TalentRequestTrackedUser", "User"],
  requestPolicy: "cache-first",
};

const Tracking = () => {
  const intl = useIntl();
  const { talentRequestId } = useRequiredParams<RouteParams>("talentRequestId");
  const [{ data }] = useQuery({
    query: TalentRequestTracking_Query,
    variables: { id: talentRequestId },
    context,
  });

  return (
    <div className="flex flex-col gap-y-6">
      <TalentRequestSectionCard
        color="primary"
        icon={MapPinIcon}
        title={intl.formatMessage(talentRequestMessages.candidateTracking)}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Track and manage all candidates that have matched this request.",
          id: "T0+7FE",
          description:
            "Description of the candidates being tracked by a talent request",
        })}
      >
        <TalentRequestTrackedUsersInbox
          talentRequestId={talentRequestId}
          optionsQuery={data}
          requestedSkillsCount={
            data?.talentRequest?.applicantFilter?.skills?.length ?? 0
          }
        />
      </TalentRequestSectionCard>
    </div>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <Tracking />
  </RequireAuth>
);

Component.displayName = "AdminTalentRequestTracking";

export default Component;
