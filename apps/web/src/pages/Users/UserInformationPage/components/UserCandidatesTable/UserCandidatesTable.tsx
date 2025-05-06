import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import { getFullNameLabel } from "~/utils/nameUtils";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";
import useRoutes from "~/hooks/useRoutes";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";
import adminMessages from "~/messages/adminMessages";
import {
  JobPlacementDialog_Fragment,
  jobPlacementDialogAccessor,
  JobPlacementOptionsFragmentType,
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
      ...PoolCandidate_Bookmark
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
      finalDecision {
        value
        label {
          en
          fr
        }
      }
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
        name {
          en
          fr
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
        classification {
          id
          group
          level
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
    priorities: localizedEnumStrings(enumName: "PriorityWeight") {
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
  jobPlacementOptions: JobPlacementOptionsFragmentType;
  title: string;
}

const UserCandidatesTable = ({
  userQuery,
  jobPlacementOptions,
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

  // an admin possessing draft applications will fetch them, fine policy wise but not useful to render
  const candidatesFilteredForSubmitted = poolCandidatesUnpacked.filter(
    (candidate) => !!candidate.submittedAt,
  );

  const candidateIds = candidatesFilteredForSubmitted.map(
    (candidate) => candidate.id,
  );

  const columns = [
    columnHelper.display({
      id: "isBookmarked",
      header: () => bookmarkHeader(intl),
      enableHiding: false,
      cell: ({ row: { original: poolCandidate } }) =>
        bookmarkCell(poolCandidate, poolCandidate.isBookmarked),
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
    columnHelper.accessor(
      ({ pool }) =>
        getFullPoolTitleLabel(intl, {
          workStream: pool.workStream,
          name: pool.name,
          publishingGroup: pool.publishingGroup,
          classification: pool.classification,
        }),
      {
        id: "process",
        header: intl.formatMessage(processMessages.process),
        sortingFn: normalizedText,
        cell: ({
          row: {
            original: { pool },
          },
        }) =>
          processCell(
            {
              id: pool.id,
              workStream: pool.workStream,
              name: pool.name,
              publishingGroup: pool.publishingGroup,
              classification: pool.classification,
            },
            paths,
            intl,
          ),
      },
    ),
    columnHelper.accessor(
      () => getLocalizedName(user.priority?.label, intl, true),
      {
        id: "priority",
        header: intl.formatMessage(adminMessages.category),
        cell: () =>
          priorityCell(user.priorityWeight, stringsData?.priorities, intl),
      },
    ),
    columnHelper.accessor(
      ({ finalDecision }) => getLocalizedName(finalDecision?.label, intl, true),
      {
        id: "finalDecision",
        header: intl.formatMessage(tableMessages.finalDecision),
        cell: ({ row: { original: poolCandidate } }) =>
          finalDecisionCell(
            poolCandidate.finalDecision,
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
            jobPlacementOptions,
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
    columnHelper.accessor(({ notes }) => notes ?? "", {
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
      data={candidatesFilteredForSubmitted}
      columns={columns}
      caption={title}
      sort={{ internal: true }}
      hiddenColumnIds={["candidateName", "priority"]}
    />
  );
};

export default UserCandidatesTable;
