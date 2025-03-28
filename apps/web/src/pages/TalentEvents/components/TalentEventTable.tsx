import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Link } from "@gc-digital-talent/ui";
import {
  graphql,
  TalentEventTableRowFragment,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import useRoutes from "~/hooks/useRoutes";

import { getNominationCount, nominationsCell, statusCell } from "./helpers";

const columnHelper = createColumnHelper<TalentEventTableRowFragment>();

export const TalentEventTableRow_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventTableRow on TalentNominationEvent {
    id
    name {
      localized
    }
    talentNominationGroups {
      id
      nominations {
        id
      }
    }
    status {
      value
      label {
        localized
      }
    }
    openDate
    closeDate
  }
`);

interface TalentEventTableProps {
  talentNominationEventQuery: FragmentType<
    typeof TalentEventTableRow_Fragment
  >[];
  title: string;
}

export const TalentEventTable = ({
  talentNominationEventQuery,
  title,
}: TalentEventTableProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const talentNominationEvents = getFragment(
    TalentEventTableRow_Fragment,
    talentNominationEventQuery,
  );

  const columns = [
    columnHelper.accessor((row) => row?.name?.localized, {
      id: "name",
      header: intl.formatMessage(commonMessages.name),
      cell: ({ row: { original: talentEvent } }) => (
        <Link href={routes.adminTalentManagementEvent(talentEvent.id)}>
          {talentEvent?.name?.localized}
        </Link>
      ),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor(
      (row) => getNominationCount(row?.talentNominationGroups ?? null),
      {
        id: "nominations",
        header: intl.formatMessage({
          defaultMessage: "Nominations",
          id: "KxsYhl",
          description: "Header for Nominations",
        }),
        cell: ({
          row: {
            original: { id, talentNominationGroups },
          },
        }) =>
          nominationsCell(
            id,
            getNominationCount(talentNominationGroups ?? null),
            routes,
            intl,
          ),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor((row) => row?.status?.label?.localized, {
      id: "status",
      header: intl.formatMessage(commonMessages.status),
      cell: ({ row: { original: talentEvent } }) =>
        statusCell(talentEvent?.status),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor("openDate", {
      id: "openDate",
      header: intl.formatMessage({
        defaultMessage: "Opening date",
        id: "qaZ6OZ",
        description: "Header for Opening date",
      }),
      cell: ({
        row: {
          original: { openDate },
        },
      }) =>
        formatDate({
          date: parseDateTimeUtc(openDate),
          formatString: "yyyy-MM-dd",
          intl,
        }),
    }),
    columnHelper.accessor("closeDate", {
      id: "closeDate",
      header: intl.formatMessage({
        defaultMessage: "Closing date",
        id: "tPCmUl",
        description: "Header for Closing date",
      }),
      cell: ({
        row: {
          original: { closeDate },
        },
      }) =>
        formatDate({
          date: parseDateTimeUtc(closeDate),
          formatString: "yyyy-MM-dd",
          intl,
        }),
    }),
  ] as ColumnDef<TalentEventTableRowFragment>[];

  const data = talentNominationEvents.filter(notEmpty);

  return (
    <Table<TalentEventTableRowFragment>
      data={data}
      caption={title}
      columns={columns}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
    />
  );
};

export default TalentEventTable;
