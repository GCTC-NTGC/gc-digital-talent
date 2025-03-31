import { useQuery } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import { RouteParams } from "./types";

const TalentEventDetails_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventDetails on TalentNominationEvent {
    id
  }
`);

interface TalentEventDetailsProps {
  query: FragmentType<typeof TalentEventDetails_Fragment>;
}

const TalentEventDetails = ({ query }: TalentEventDetailsProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const talentEvent = getFragment(TalentEventDetails_Fragment, query);

  return null; // TO DO: Add page in #12852
};

const TalentEventDetails_Query = graphql(/* GraphQL */ `
  query TalentEventDetails($talentEventId: UUID!) {
    talentNominationEvent(id: $talentEventId) {
      ...TalentEventDetails
    }
  }
`);

const TalentEventDetailsPage = () => {
  const { eventId } = useRequiredParams<RouteParams>("eventId");
  const [{ data, fetching, error }] = useQuery({
    query: TalentEventDetails_Query,
    variables: { talentEventId: eventId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationEvent ? (
        <TalentEventDetails query={data.talentNominationEvent} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentEventDetailsPage />
  </RequireAuth>
);

Component.displayName = "TalentEventDetailsPage";
