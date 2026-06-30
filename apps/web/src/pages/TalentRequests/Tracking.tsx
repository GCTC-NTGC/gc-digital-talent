import { useIntl } from "react-intl";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { useQuery, type OperationContext } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import talentRequestMessages from "~/messages/talentRequestMessages";
import useRequiredParams from "~/hooks/useRequiredParams";

import TalentRequestSectionCard from "./components/TalentRequestSectionCard";
import TalentRequestMatchesTable from "./components/TalentRequestMatchesTable/TalentRequestMatchesTable";
import TalentRequestTrackedUsersInbox from "./components/TalentRequestTrackedUsersInbox/TalentRequestTrackedUsersInbox";
import type { RouteParams } from "./types";

const TalentRequestTracking_Query = graphql(/** GraphQL */ `
  query TalentRequestTracking($id: UUID!) {
    talentRequest(id: $id) {
      ...TalentRequestMatchesTableTalentRequest
      applicantFilter {
        skills {
          ...TalentRequestUserSkillMatch
        }
      }
    }

    ...TalentRequestReferralDialogOptions
    ...TalentRequestEditReferralDialogSourceOptions
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
  const [{ data, fetching, error }] = useQuery({
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

      <TalentRequestSectionCard
        color="warning"
        icon={MagnifyingGlassPlusIcon}
        title={intl.formatMessage({
          defaultMessage: "Find matching candidates",
          id: "CtcCZj",
          description:
            "Heading for the table that contains users who match talent request criteria",
        })}
        subtitle={intl.formatMessage({
          defaultMessage:
            "This list is always up-to-date, find new candidates that match to this talent request.",
          id: "JT8Azd",
          description:
            "Description of the table showing users who match talent request criteria",
        })}
      >
        <Pending fetching={fetching} error={error}>
          {data?.talentRequest ? (
            <TalentRequestMatchesTable
              query={data.talentRequest}
              skillsQuery={unpackMaybes(
                data?.talentRequest?.applicantFilter?.skills,
              )}
              optionsQuery={data}
            />
          ) : (
            <ThrowNotFound />
          )}
        </Pending>
      </TalentRequestSectionCard>
    </div>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin]}>
    <Tracking />
  </RequireAuth>
);

Component.displayName = "AdminTalentRequestTracking";

export default Component;
