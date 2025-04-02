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
import { normalizedText } from "~/components/Table/sortingFns";
import { getFullNameLabel } from "~/utils/nameUtils";

import { RouteParams } from "./types";
import {
  nominationsToNominators,
  nominatorsAccessor,
  statusCell,
} from "./util";

const TalentEventNominationsTable_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventNominationsTable on TalentNominationGroup {
    id
    status {
      value
      label {
        localized
      }
    }
    nominee {
      firstName
      lastName
      department {
        name {
          localized
        }
      }
    }
    nominations {
      id
      nominator {
        firstName
        lastName
      }
    }
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
    columnHelper.accessor(
      ({ nominee }) =>
        getFullNameLabel(nominee?.firstName, nominee?.lastName, intl),
      {
        id: "nominee",
        header: intl.formatMessage(messages.nominee),
        sortingFn: normalizedText,
        // cell: ({
        //   row: {
        //     original: { nominee },
        //   },
        // }) =>
        //   candidateNameCell(
        //     poolCandidate.id,
        //     paths,
        //     intl,
        //     candidateIdsFromFilterData,
        //     poolCandidate.user.firstName,
        //     poolCandidate.user.lastName,
        //   ),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(({ status }) => status?.label?.localized, {
      id: "status",
      header: intl.formatMessage(commonMessages.status),
      sortingFn: normalizedText,
      cell: ({
        row: {
          original: { status },
        },
      }) => statusCell(status),
      enableSorting: false,
    }),
    columnHelper.accessor(({ id }) => id, {
      id: "received",
      header: intl.formatMessage(commonMessages.received),
      enableSorting: false,
    }),
    columnHelper.accessor(
      ({ nominations }) =>
        nominatorsAccessor(nominationsToNominators(nominations), intl),
      {
        id: "nominators",
        header: intl.formatMessage(messages.nominators),
      },
    ),
    columnHelper.accessor(
      ({ nominee }) =>
        nominee?.department?.name?.localized ??
        intl.formatMessage(commonMessages.notProvided),
      {
        id: "department",
        header: intl.formatMessage(commonMessages.department),
        enableSorting: false,
      },
    ),
    columnHelper.accessor(({ id }) => id, {
      id: "types",
      header: intl.formatMessage(commonMessages.types),
      enableSorting: false,
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
      nullMessage={{
        title: intl.formatMessage({
          defaultMessage: "This table doesn't have any data to display.",
          id: "Rw9JVt",
          description: "Null message title for talent nominations table.",
        }),
        description: intl.formatMessage({
          defaultMessage:
            "As talent nominations for this event are received, they will automatically appear here.",
          id: "soHyUi",
          description: "Null message description for talent nominations table.",
        }),
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
