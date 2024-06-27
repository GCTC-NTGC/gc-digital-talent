import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { isPast } from "date-fns/isPast";

import {
  commonMessages,
  getLocalizedName,
  getPoolCandidateStatus,
  getPoolStream,
  getPublishingGroup,
} from "@gc-digital-talent/i18n";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { notEmpty } from "@gc-digital-talent/helpers";
import { PoolCandidate, User } from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import { normalizedText } from "~/components/Table/sortingFns";
import { getShortPoolTitleLabel } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";
import processMessages from "~/messages/processMessages";
import adminMessages from "~/messages/adminMessages";

import accessors from "../Table/accessors";
import { expiryCell, statusCell, viewTeamLinkCell } from "./cells";
import sortStatus from "./sortStatus";

const isSuspended = (suspendedAt: PoolCandidate["suspendedAt"]): boolean => {
  if (!suspendedAt) return false;

  const suspendedAtDate = parseDateTimeUtc(suspendedAt);
  return isPast(suspendedAtDate);
};

const columnHelper = createColumnHelper<PoolCandidate>();

interface PoolStatusTableProps {
  user: User;
}

const PoolStatusTable = ({ user }: PoolStatusTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const columns = [
    columnHelper.accessor((row) => getShortPoolTitleLabel(intl, row.pool), {
      id: "pool",
      meta: {
        isRowTitle: true,
      },
      sortingFn: normalizedText,
      enableHiding: false,
      cell: ({ row: { original: candidate }, getValue }) =>
        cells.view(paths.poolView(candidate.pool.id), getValue()),
      header: intl.formatMessage({
        defaultMessage: "Pool",
        id: "icYqDt",
        description:
          "Title of the 'Pool' column for the table on view-user page",
      }),
    }),
    columnHelper.accessor(({ pool }) => pool.processNumber, {
      id: "processNumber",
      header: intl.formatMessage(processMessages.processNumber),
    }),
    columnHelper.accessor(
      (row) => getLocalizedName(row.pool.team?.displayName, intl, true),
      {
        id: "team",
        header: intl.formatMessage(adminMessages.team),
        sortingFn: normalizedText,
        cell: ({ row: { original: poolCandidate } }) =>
          viewTeamLinkCell(
            paths.teamView(
              poolCandidate.pool.team?.id ? poolCandidate.pool.team?.id : "",
            ),
            poolCandidate.pool.team?.displayName,
            intl,
          ),
      },
    ),
    columnHelper.accessor(
      (row) =>
        intl.formatMessage(
          row.pool.publishingGroup
            ? getPublishingGroup(row.pool.publishingGroup)
            : commonMessages.notFound,
        ),
      {
        id: "publishingGroup",
        sortingFn: normalizedText,
        header: intl.formatMessage(processMessages.publishingGroup),
      },
    ),
    columnHelper.accessor(
      (row) => intl.formatMessage(getPoolCandidateStatus(row.status as string)),
      {
        id: "status",
        enableHiding: false,
        cell: ({ row: { original: candidate } }) => statusCell(candidate, user),
        header: intl.formatMessage(commonMessages.status),
        sortingFn: sortStatus,
      },
    ),
    columnHelper.accessor(
      (row) =>
        isSuspended(row.suspendedAt)
          ? intl.formatMessage({
              defaultMessage: "Inactive",
              id: "u5UAJn",
              description: "Status message if the application is suspended",
            })
          : intl.formatMessage({
              defaultMessage: "Active",
              id: "4L9rHO",
              description: "Status message if the application is not suspended",
            }),
      {
        id: "availability",
        enableHiding: false,
        header: intl.formatMessage({
          defaultMessage: "Availability",
          id: "mevv+t",
          description: "Availability label",
        }),
      },
    ),
    columnHelper.accessor(
      (row) =>
        intl.formatMessage(
          row.pool.stream
            ? getPoolStream(row.pool.stream)
            : commonMessages.notAvailable,
        ),
      {
        id: "application",
        enableHiding: false,
        sortingFn: normalizedText,
        cell: ({ row: { original: candidate }, getValue }) =>
          cells.view(
            paths.poolCandidateApplication(candidate.id),
            intl.formatMessage(
              {
                defaultMessage: "{stream} application",
                id: "jcWDLK",
                description:
                  "Link text to view an application to a specific pool stream",
              },
              {
                stream: getValue(),
              },
            ),
          ),
        header: intl.formatMessage({
          defaultMessage: "Application",
          id: "cF8idC",
          description: "Label for the application link column",
        }),
      },
    ),
    columnHelper.accessor((row) => accessors.date(row.expiryDate), {
      id: "expiryDate",
      enableHiding: false,
      sortingFn: "datetime",
      cell: ({ row: { original: candidate } }) => expiryCell(candidate, user),
      header: intl.formatMessage({
        defaultMessage: "Expiry date",
        id: "STDYoR",
        description:
          "Title of the 'Expiry date' column for the table on view-user page",
      }),
    }),
  ] as ColumnDef<PoolCandidate>[];

  const data = user.poolCandidates?.filter(notEmpty) ?? [];

  return (
    <Table<PoolCandidate>
      caption={intl.formatMessage({
        defaultMessage: "Pool information",
        id: "ptOxLJ",
        description: "Title for pool information",
      })}
      data={data}
      columns={columns}
      urlSync={false}
      sort={{
        internal: true,
        initialState: [
          {
            id: "status",
            desc: false,
          },
        ],
      }}
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage: "This user is not in any pools yet",
          id: "W58QTT",
          description:
            "Message on view-user page that the user is not in any pools",
        }),
      }}
    />
  );
};

export default PoolStatusTable;
