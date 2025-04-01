import { useQuery } from "urql";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import EnvelopeOpenIcon from "@heroicons/react/24/outline/EnvelopeOpenIcon";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentEventNominationsTableFragment as TalentEventNominationsTableFragmentType,
} from "@gc-digital-talent/graphql";
import { Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import messages from "~/messages/talentNominationMessages";

import { RouteParams } from "./types";

const TalentEventNominationsTable_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventNominationsTable on TalentNominationGroup {
    id
  }
`);

const columnHelper =
  createColumnHelper<TalentEventNominationsTableFragmentType>();

interface TalentEventNominationsProps {
  query: FragmentType<typeof TalentEventNominationsTable_Fragment>[];
}

const TalentEventNominations = ({ query }: TalentEventNominationsProps) => {
  const intl = useIntl();

  const talentEventNominations = getFragment(
    TalentEventNominationsTable_Fragment,
    query,
  );
  const talentEventNominationsData = useMemo(
    () => talentEventNominations,
    [talentEventNominations],
  );

  const columns = [
    columnHelper.accessor(({ id }) => id, {
      id: "id",
      header: intl.formatMessage(commonMessages.name),
      enableColumnFilter: false,
      meta: {
        isRowTitle: true,
      },
    }),
  ] as ColumnDef<TalentEventNominationsTableFragmentType>[];

  return (
    <Table<TalentEventNominationsTableFragmentType>
      data={talentEventNominationsData}
      caption={intl.formatMessage(messages.talentNominations)}
      columns={columns}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: talentEventNominations.length,
        pageSizes: [10, 20, 50],
      }}
    />
  );
};

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
      <Heading
        Icon={EnvelopeOpenIcon}
        color="primary"
        data-h2-margin-bottom="base(x1)"
      >
        {intl.formatMessage(messages.talentNominations)}
      </Heading>
      <p data-h2-margin-bottom="base(x1.5)">
        {intl.formatMessage({
          defaultMessage:
            'Manage and action nominations received from managers and executives. Nominations will arrive as "Unassigned", from which you can choose to assign them to team members to triage and assess. When approved, a nomination will automatically add the candidate to the candidates table for you to talent manage.',
          id: "1Q6Elv",
          description: "Talent nominations table page, table information",
        })}
      </p>
      <Pending fetching={fetching} error={error}>
        {data?.talentNominationEvent?.talentNominationGroups ? (
          <TalentEventNominations
            query={data.talentNominationEvent.talentNominationGroups}
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
