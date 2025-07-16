import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentEventNominationsTableFragment as TalentEventNominationsTableFragmentType,
} from "@gc-digital-talent/graphql";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import messages from "~/messages/talentNominationMessages";
import { normalizedText } from "~/components/Table/sortingFns";
import { getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import accessors from "~/components/Table/accessors";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import { getSortedNominatorNames } from "~/utils/talentNominations";
import useSelectedRows from "~/hooks/useSelectedRows";
import { rowSelectCell } from "~/components/Table/ResponsiveTable/RowSelection";

import {
  nomineeNameCell,
  removeDuplicateIds,
  statusCell,
  typesAccessor,
} from "./util";

const TalentEventNominationsTable_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventNominationsTable on TalentNominationGroup {
    id
    createdAt
    advancementNominationCount
    lateralMovementNominationCount
    developmentProgramsNominationCount
    status {
      value
      label {
        localized
      }
    }
    nominee {
      id
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
      nominatorFallbackName
      nominator {
        firstName
        lastName
      }
    }
    talentNominationEvent {
      id
    }
  }
`);

const DownloadNominationsCsv_Mutation = graphql(/* GraphQL */ `
  mutation DownloadNominationsCsv(
    $ids: [UUID!]
    $talentNominationEventId: UUID!
  ) {
    downloadNominationsCsv(
      ids: $ids
      talentNominationEventId: $talentNominationEventId
    )
  }
`);

const columnHelper =
  createColumnHelper<TalentEventNominationsTableFragmentType>();

interface TalentEventNominationsProps {
  query: FragmentType<typeof TalentEventNominationsTable_Fragment>[];
  talentNominationEventId: string;
}

const TalentEventNominationsTable = ({
  query,
  talentNominationEventId,
}: TalentEventNominationsProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const talentEventNominations = getFragment(
    TalentEventNominationsTable_Fragment,
    query,
  );
  const talentEventNominationsData = useMemo(
    () => talentEventNominations,
    [talentEventNominations],
  );

  const { selectedRows, setSelectedRows } = useSelectedRows<string>([]);

  const [{ fetching: downloadingAllCsv }, downloadAllCsv] = useMutation(
    DownloadNominationsCsv_Mutation,
  );

  const handleDownloadError = () => {
    toast.error(intl.formatMessage(errorMessages.downloadRequestFailed));
  };

  const handleDownloadRes = (hasData: boolean) => {
    if (hasData) {
      toast.info(intl.formatMessage(commonMessages.preparingDownload));
    } else {
      handleDownloadError();
    }
  };

  const handleCsvDownload = () => {
    downloadAllCsv({
      ids: removeDuplicateIds(selectedRows),
      talentNominationEventId,
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  const handleCsvDownloadAll = () => {
    downloadAllCsv({
      talentNominationEventId,
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  const nominationIds = talentEventNominationsData.map((nom) => nom.id);

  const columns = [
    columnHelper.accessor(
      ({ nominee }) =>
        getFullNameLabel(nominee?.firstName, nominee?.lastName, intl),
      {
        id: "nominee",
        header: intl.formatMessage(messages.nominee),
        sortingFn: normalizedText,
        cell: ({
          getValue,
          row: {
            original: { id, talentNominationEvent },
          },
        }) =>
          nomineeNameCell(
            talentNominationEvent.id,
            id,
            getValue(),
            nominationIds,
            paths,
          ),
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
    }),
    // received is how creation of a TalentNominationGroup is referenced
    columnHelper.accessor(({ createdAt }) => accessors.date(createdAt), {
      id: "received",
      header: intl.formatMessage(commonMessages.received),
      sortingFn: "datetime",
      cell: ({
        row: {
          original: { createdAt },
        },
      }) => cells.date(createdAt, intl),
      enableColumnFilter: false,
    }),
    columnHelper.accessor(
      ({ nominations }) =>
        getSortedNominatorNames(unpackMaybes(nominations), intl)
          .flatMap((n) => n.name)
          .join(", "),
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
      },
    ),
    columnHelper.accessor(
      ({
        advancementNominationCount,
        lateralMovementNominationCount,
        developmentProgramsNominationCount,
      }) =>
        typesAccessor(
          advancementNominationCount ?? 0,
          lateralMovementNominationCount ?? 0,
          developmentProgramsNominationCount ?? 0,
          intl,
        ),
      {
        id: "options",
        header: intl.formatMessage(commonMessages.options),
      },
    ),
  ] as ColumnDef<TalentEventNominationsTableFragmentType>[];

  return (
    <Table<TalentEventNominationsTableFragmentType>
      data={talentEventNominationsData}
      caption={intl.formatMessage(messages.talentNominations)}
      columns={columns}
      search={{
        internal: true,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: talentEventNominations.length,
        pageSizes: [10, 20, 50],
      }}
      rowSelect={{
        onRowSelection: setSelectedRows,
        getRowId: ({ id, nominee }) => `${id}-nomineeId#${nominee?.id}`,
        cell: ({ row }) =>
          rowSelectCell({
            row,
            label: getFullNameLabel(
              row.original.nominee?.firstName,
              row.original.nominee?.lastName,
              intl,
            ),
          }),
      }}
      download={{
        all: {
          enable: true,
          onClick: handleCsvDownloadAll,
          downloading: downloadingAllCsv,
        },
        csv: {
          enable: true,
          onClick: handleCsvDownload,
          downloading: downloadingAllCsv,
        },
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

export default TalentEventNominationsTable;
