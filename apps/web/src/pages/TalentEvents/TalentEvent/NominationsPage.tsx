import { useQuery } from "urql";
import { useIntl } from "react-intl";
import EnvelopeOpenIcon from "@heroicons/react/24/outline/EnvelopeOpenIcon";

import { graphql } from "@gc-digital-talent/graphql";
import { Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import messages from "~/messages/talentNominationMessages";

import { RouteParams } from "./types";
import TalentEventNominationsTable from "./TalentEventNominationsTable";

const TalentEventNominations_Query = graphql(/* GraphQL */ `
  query TalentEventNominations($talentEventId: UUID!) {
    talentNominationEvent(id: $talentEventId) {
      talentNominationGroups {
        ...TalentEventNominationsTable
      }
    }
  }
`);

const TalentEventNominationsPage = () => {
  const intl = useIntl();

  const { eventId } = useRequiredParams<RouteParams>("eventId");
  const [{ data, fetching, error }] = useQuery({
    query: TalentEventNominations_Query,
    variables: { talentEventId: eventId },
  });

  return (
    <>
      <Heading icon={EnvelopeOpenIcon} color="secondary" className="mt-0 mb-6">
        {intl.formatMessage(messages.talentNominations)}
      </Heading>
      <p className="mb-9">
        {intl.formatMessage({
          defaultMessage:
            "View and manage all the nominations received for this talent management event.",
          id: "Q9yLca",
          description: "Talent nominations table page, table information",
        })}
      </p>
      <Pending fetching={fetching} error={error}>
        {data?.talentNominationEvent?.talentNominationGroups ? (
          <TalentEventNominationsTable
            query={data.talentNominationEvent.talentNominationGroups}
            talentNominationEventId={eventId}
          />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentEventNominationsPage />
  </RequireAuth>
);

Component.displayName = "TalentEventNominationsPage";

export default Component;
