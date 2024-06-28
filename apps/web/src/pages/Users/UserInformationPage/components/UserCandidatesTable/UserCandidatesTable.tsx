import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Department,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import { getFullNameLabel } from "~/utils/nameUtils";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";
import useRoutes from "~/hooks/useRoutes";
import { PoolCandidate_BookmarkFragment } from "~/components/CandidateBookmark/CandidateBookmark";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";
import adminMessages from "~/messages/adminMessages";
import {
  JobPlacementDialog_Fragment,
  jobPlacementDialogAccessor,
} from "~/components/PoolCandidatesTable/JobPlacementDialog";
import cells from "~/components/Table/cells";
import accessors from "~/components/Table/accessors";

import {
  bookmarkCell,
  bookmarkHeader,
  candidacyStatusAccessor,
  candidateNameCell,
  finalDecisionCell,
  notesCell,
  priorityCell,
  processCell,
} from "./helpers";

const UserCandidatesTableRow_Fragment = graphql(/* GraphQL */ `
  fragment UserCandidatesTableRow on User {
    id
    firstName
    lastName
    priorityWeight
    priority {
      label {
        en
        fr
      }
    }
    poolCandidates {
      id
      isBookmarked
      status {
        value
        label {
          en
          fr
        }
      }
      submittedAt
      suspendedAt
      notes
      assessmentStatus {
        currentStep
        overallAssessmentStatus
      }
      placedDepartment {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      pool {
        id
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
        classification {
          id
          group
          level
        }
        assessmentSteps {
          id
          type {
            value
            label {
              en
              fr
            }
          }
          sortOrder
          title {
            en
            fr
          }
          poolSkills {
            id
            type {
              value
              label {
                en
                fr
              }
            }
            requiredLevel
          }
        }
      }
    }
  }
`);

const UserCandidatesTableStrings_Query = graphql(/* GraphQL */ `
  query UserCandidatesTableStrings {
    suspendedStatuses: localizedEnumStrings(
      enumName: "CandidateSuspendedFilter"
    ) {
      value
      label {
        en
        fr
      }
    }
  }
`);

interface UserCandidatesTableProps {
  userQuery: FragmentType<typeof UserCandidatesTableRow_Fragment>;
  departments: Department[];
  title: string;
}

const UserCandidatesTable = ({
  userQuery,
  departments,
  title,
}: UserCandidatesTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [{ data: stringsData }] = useQuery({
    query: UserCandidatesTableStrings_Query,
  });

  const user = getFragment(UserCandidatesTableRow_Fragment, userQuery);
  const poolCandidatesUnpacked = unpackMaybes(user.poolCandidates);
  type PoolCandidateSlice = (typeof poolCandidatesUnpacked)[number];
  const columnHelper = createColumnHelper<PoolCandidateSlice>();

  const candidateIds = poolCandidatesUnpacked.map((candidate) => candidate.id);

  const columns = [
    columnHelper.display({
      id: "isBookmarked",
      header: () => bookmarkHeader(intl),
      enableHiding: false,
      cell: ({ row: { original: poolCandidate } }) =>
        bookmarkCell(
          poolCandidate as FragmentType<typeof PoolCandidate_BookmarkFragment>,
          poolCandidate.isBookmarked,
        ),
      meta: {
        shrink: true,
        hideMobileHeader: true,
      },
    }),
    columnHelper.accessor(
      () => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "candidateName",
        header: intl.formatMessage(tableMessages.candidateName),
        sortingFn: normalizedText,
        cell: ({ row: { original: poolCandidate } }) =>
          candidateNameCell(
            user.firstName,
            user.lastName,
            poolCandidate.id,
            paths,
            intl,
            candidateIds,
          ),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(({ pool }) => getFullPoolTitleLabel(intl, pool), {
      id: "process",
      header: intl.formatMessage(processMessages.process),
      sortingFn: normalizedText,
      cell: ({
        row: {
          original: { pool },
        },
      }) => processCell(pool, paths, intl),
    }),
    columnHelper.accessor(
      () => getLocalizedName(user.priority?.label, intl, true),
      {
        id: "priority",
        header: intl.formatMessage(adminMessages.category),
        cell: () =>
          priorityCell(user.priorityWeight, user.priority?.label, intl),
      },
    ),
    columnHelper.accessor(
      ({ status }) => getLocalizedName(status?.label, intl, true),
      {
        id: "finalDecision",
        header: intl.formatMessage(tableMessages.finalDecision),
        cell: ({ row: { original: poolCandidate } }) =>
          finalDecisionCell(
            poolCandidate.status?.value,
            poolCandidate.assessmentStatus,
            intl,
          ),
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ status }) => getLocalizedName(status?.label, intl),
      {
        id: "jobPlacement",
        header: intl.formatMessage(tableMessages.jobPlacement),
        cell: ({ row: { original: poolCandidate } }) =>
          jobPlacementDialogAccessor(
            poolCandidate as FragmentType<typeof JobPlacementDialog_Fragment>,
            departments,
          ),
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      (row) => getLocalizedName(row.placedDepartment?.name, intl, true),
      {
        id: "placedDepartment",
        header: intl.formatMessage(tableMessages.placedDepartment),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      (poolCandidate) =>
        candidacyStatusAccessor(
          poolCandidate.suspendedAt,
          stringsData?.suspendedStatuses,
          intl,
        ),
      {
        id: "candidacyStatus",
        header: intl.formatMessage(tableMessages.candidacyStatus),
      },
    ),
    columnHelper.accessor(({ notes }) => notes || "", {
      id: "notes",
      header: intl.formatMessage(adminMessages.notes),
      sortingFn: normalizedText,
      cell: ({ row: { original: poolCandidate } }) =>
        notesCell(intl, user.firstName, user.lastName, poolCandidate.notes),
    }),
    columnHelper.accessor(({ submittedAt }) => accessors.date(submittedAt), {
      id: "dateReceived",
      enableColumnFilter: false,
      header: intl.formatMessage(tableMessages.dateReceived),
      sortingFn: "datetime",
      cell: ({
        row: {
          original: { submittedAt },
        },
      }) => cells.date(submittedAt, intl),
    }),
  ] as ColumnDef<PoolCandidateSlice>[];

  return (
    <Table<PoolCandidateSlice>
      data={poolCandidatesUnpacked}
      columns={columns}
      caption={title}
      sort={{ internal: true }}
      hiddenColumnIds={["candidateName", "priority"]}
    />
  );
};

export default UserCandidatesTable;
