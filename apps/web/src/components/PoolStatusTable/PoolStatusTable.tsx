import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { isPast } from "date-fns/isPast";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  FragmentType,
  getFragment,
  graphql,
  PoolStatusTable_PoolCandidateFragment as PoolStatusTablePoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";

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

const isSuspended = (
  suspendedAt: PoolStatusTablePoolCandidateFragmentType["suspendedAt"],
): boolean => {
  if (!suspendedAt) return false;

  const suspendedAtDate = parseDateTimeUtc(suspendedAt);
  return isPast(suspendedAtDate);
};

const columnHelper =
  createColumnHelper<PoolStatusTablePoolCandidateFragmentType>();

const PoolStatusTable_Fragment = graphql(/* GraphQL */ `
  fragment PoolStatusTable on User {
    id
    poolCandidates {
      id
      status {
        value
        label {
          en
          fr
        }
      }
      expiryDate
      notes
      suspendedAt
      user {
        id
      }
      pool {
        id
        processNumber
        name {
          en
          fr
        }
        classification {
          id
          group
          level
        }
        stream {
          value
          label {
            en
            fr
          }
        }
        publishingGroup {
          value
          label {
            en
            fr
          }
        }
        team {
          id
          name
          displayName {
            en
            fr
          }
        }
      }
    }
  }
`);

interface PoolStatusTableProps {
  userQuery: FragmentType<typeof PoolStatusTable_Fragment>;
}

const PoolStatusTable = ({ userQuery }: PoolStatusTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(PoolStatusTable_Fragment, userQuery);

  const columns = [
    columnHelper.accessor(
      (row) =>
        getShortPoolTitleLabel(intl, {
          stream: row.pool.stream,
          name: row.pool.name,
          publishingGroup: row.pool.publishingGroup,
          classification: row.pool.classification,
        }),
      {
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
      },
    ),
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
      ({ pool: { publishingGroup } }) =>
        getLocalizedName(publishingGroup?.label, intl),
      {
        id: "publishingGroup",
        sortingFn: normalizedText,
        header: intl.formatMessage(processMessages.publishingGroup),
      },
    ),
    columnHelper.accessor(
      ({ status }) => getLocalizedName(status?.label, intl),
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
      ({ pool: { stream } }) => getLocalizedName(stream?.label, intl),
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
  ] as ColumnDef<PoolStatusTablePoolCandidateFragmentType>[];

  const data = user.poolCandidates?.filter(notEmpty) ?? [];

  return (
    <Table<PoolStatusTablePoolCandidateFragmentType>
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
