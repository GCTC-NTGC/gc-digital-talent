import { useIntl } from "react-intl";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import MagnifyingGlassPlusIcon from "@heroicons/react/24/outline/MagnifyingGlassPlusIcon";
import { useQuery } from "urql";

import { Notice, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import talentRequestMessages from "~/messages/talentRequestMessages";
import useRequiredParams from "~/hooks/useRequiredParams";

import TalentRequestSectionCard from "./components/TalentRequestSectionCard";
import TalentRequestMatchesTable from "./components/TalentRequestMatchesTable/TalentRequestMatchesTable";
import type { RouteParams } from "./types";

const TalentRequestTracking_Query = graphql(/** GraphQL */ `
  query TalentRequestTracking($id: UUID!) {
    talentRequest(id: $id) {
      ...TalentRequestMatchesTableTalentRequest
    }
  }
`);

const Tracking = () => {
  const intl = useIntl();
  const { talentRequestId } = useRequiredParams<RouteParams>("talentRequestId");
  const [{ data, fetching, error }] = useQuery({
    query: TalentRequestTracking_Query,
    variables: { id: talentRequestId },
  });
  const trackedUsers = [];

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
        {trackedUsers.length > 0 ? null : (
          <Notice.Root mode="inline">
            <Notice.Title>
              {intl.formatMessage({
                defaultMessage: "You are not tracking any candidates yet",
                id: "uQqsKm",
                description:
                  "Title displayed when there are no tracked users for a talent request",
              })}
            </Notice.Title>
            <Notice.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Use the ‘<italic>Find matching candidates</italic>’ table to start tracking possible matching candidates to this request.",
                  id: "nmXd3e",
                  description:
                    "Help message displayed when there are no tracked users for a talent request",
                })}
              </p>
            </Notice.Content>
          </Notice.Root>
        )}
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
            <TalentRequestMatchesTable query={data.talentRequest} />
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
