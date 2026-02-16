import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { isPast } from "date-fns/isPast";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
  PoolCandidate,
  PoolStatusTableFragment,
  Scalars,
} from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import { normalizedText } from "~/components/Table/sortingFns";
import { getShortPoolTitleLabel } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";
import processMessages from "~/messages/processMessages";

import accessors from "../Table/accessors";
import { expiryCell } from "./cells";
import sortStatus from "./sortStatus";

const isSuspended = (suspendedAt: PoolCandidate["suspendedAt"]): boolean => {
  if (!suspendedAt) return false;

  const suspendedAtDate = parseDateTimeUtc(suspendedAt);
  return isPast(suspendedAtDate);
};

const PoolStatusTable_Fragment = graphql(/* GraphQL */ `
  fragment PoolStatusTable on User {
    id
    firstName
    lastName
    poolCandidates {
      id
      ...ChangeDateDialog_PoolCandidate
      status {
        value
        label {
          localized
        }
      }
      expiryDate
      notes
      suspendedAt
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
        workStream {
          id
          name {
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
      }
    }
  }
`);

type RowDef = NonNullable<
  NonNullable<PoolStatusTableFragment["poolCandidates"]>[number]
>;

const columnHelper = createColumnHelper<RowDef>();

interface PoolStatusTableProps {
  currentPoolId?: Scalars["ID"]["output"];
  onlyRecruitmentProcesses?: boolean;
  userQuery: FragmentType<typeof PoolStatusTable_Fragment>;
}

const PoolStatusTable = ({
  currentPoolId,
  userQuery,
  onlyRecruitmentProcesses = false,
}: PoolStatusTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(PoolStatusTable_Fragment, userQuery);

  const columns = [
    columnHelper.accessor(
      (row) =>
        getShortPoolTitleLabel(intl, {
          workStream: row.pool.workStream,
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
      ({ pool: { publishingGroup } }) =>
        getLocalizedName(publishingGroup?.label, intl),
      {
        id: "publishingGroup",
        sortingFn: normalizedText,
        header: intl.formatMessage(processMessages.publishingGroup),
      },
    ),
    columnHelper.accessor(
      (row) =>
        row.status?.label?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
      {
        id: "status",
        enableHiding: false,
        header: intl.formatMessage(commonMessages.status),
        sortingFn: ({ original: a }, { original: b }) =>
          sortStatus(a.status?.value, b.status?.value),
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
      ({ pool: { workStream } }) => getLocalizedName(workStream?.name, intl),
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
      cell: ({ row: { original: candidate } }) =>
        expiryCell(candidate, {
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      header: intl.formatMessage({
        defaultMessage: "Expiry date",
        id: "STDYoR",
        description:
          "Title of the 'Expiry date' column for the table on view-user page",
      }),
    }),
  ] as ColumnDef<RowDef>[];

  let data = unpackMaybes(user.poolCandidates);
  if (currentPoolId) {
    data = data.filter(
      (poolCandidates) => poolCandidates.pool.id != currentPoolId,
    );
  }
  if (onlyRecruitmentProcesses) {
    data = data.filter(
      ({ status }) => status?.value === ApplicationStatus.Qualified,
    );
  }

  return (
    <Table<RowDef>
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
