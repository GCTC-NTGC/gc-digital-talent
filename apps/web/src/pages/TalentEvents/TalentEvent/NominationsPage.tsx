import { useQuery } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

import { RouteParams } from "./types";

const TalentEventNominations_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventNominations on TalentNominationEvent {
    id
  }
`);

interface TalentEventNominationsProps {
  query: FragmentType<typeof TalentEventNominations_Fragment>;
}

const TalentEventNominations = ({ query }: TalentEventNominationsProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const talentEvent = getFragment(TalentEventNominations_Fragment, query);

  return null;
};

const TalentEventNominations_Query = graphql(/* GraphQL */ `
  query TalentEventNominations($talentEventId: UUID!) {
    talentNominationEvent(id: $talentEventId) {
      ...TalentEventNominations
    }
  }
`);

const TalentEventNominationsPage = () => {
  const { eventId } = useRequiredParams<RouteParams>("eventId");
  const [{ data, fetching, error }] = useQuery({
    query: TalentEventNominations_Query,
    variables: { talentEventId: eventId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationEvent ? (
        <TalentEventNominations query={data.talentNominationEvent} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentEventNominationsPage />
  </RequireAuth>
);

Component.displayName = "TalentEventNominationsPage";
