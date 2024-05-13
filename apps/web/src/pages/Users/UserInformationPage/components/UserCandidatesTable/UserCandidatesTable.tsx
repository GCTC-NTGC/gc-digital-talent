import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import {
  Department,
  FragmentType,
  PoolCandidate,
  UserInfoFragment,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLanguage,
  getLocalizedName,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
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
  currentLocationAccessor,
  finalDecisionCell,
  notesCell,
  priorityCell,
  processCell,
} from "./helpers";

type PoolCandidateSlice = Pick<
  PoolCandidate,
  | "id"
  | "user"
  | "notes"
  | "submittedAt"
  | "status"
  | "pool"
  | "placedDepartment"
  | "suspendedAt"
  | "isBookmarked"
>;

const columnHelper = createColumnHelper<PoolCandidateSlice>();

export interface UserCandidatesTableProps {
  user: UserInfoFragment;
  departments: Department[];
  title: string;
}

const UserCandidatesTable = ({
  user,
  departments,
  title,
}: UserCandidatesTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const poolCandidatesUnpacked = unpackMaybes(user.poolCandidates);
  const poolCandidatesMappedToType: PoolCandidateSlice[] =
    poolCandidatesUnpacked.map((candidate) => {
      return {
        id: candidate.id,
        user: candidate.user,
        notes: candidate.notes,
        submittedAt: candidate.submittedAt,
        status: candidate.status,
        pool: candidate.pool,
        placedDepartment: candidate.placedDepartment,
        suspendedAt: candidate.suspendedAt,
        isBookmarked: candidate.isBookmarked,
      };
    });
  const candidateIds = poolCandidatesMappedToType.map(
    (candidate) => candidate.id,
  );

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
          candidateNameCell(user, poolCandidate, paths, intl, candidateIds),
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
      () =>
        intl.formatMessage(
          user.priorityWeight
            ? getPoolCandidatePriorities(user.priorityWeight)
            : commonMessages.notFound,
        ),
      {
        id: "priority",
        header: intl.formatMessage(adminMessages.category),
        cell: () => priorityCell(user.priorityWeight, intl),
      },
    ),
    columnHelper.accessor(
      ({ status }) =>
        intl.formatMessage(
          status ? getPoolCandidateStatus(status) : commonMessages.notFound,
        ),
      {
        id: "finalDecision",
        header: intl.formatMessage(tableMessages.finalDecision),
        cell: ({ row: { original: poolCandidate } }) =>
          finalDecisionCell(
            intl,
            poolCandidate,
            unpackMaybes(poolCandidate?.pool?.assessmentSteps),
          ),
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ status }) =>
        intl.formatMessage(
          status ? getPoolCandidateStatus(status) : commonMessages.notFound,
        ),
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
        candidacyStatusAccessor(poolCandidate.suspendedAt, intl),
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
    columnHelper.accessor(
      () =>
        intl.formatMessage(
          user.preferredLang
            ? getLanguage(user.preferredLang)
            : commonMessages.notFound,
        ),
      {
        id: "preferredLang",
        header: intl.formatMessage(
          commonMessages.preferredCommunicationLanguage,
        ),
      },
    ),
    columnHelper.accessor(() => user.email, {
      id: "email",
      header: intl.formatMessage(commonMessages.email),
      sortingFn: normalizedText,
      cell: () => cells.email(user.email),
    }),
    columnHelper.accessor(
      () =>
        currentLocationAccessor(user.currentCity, user.currentProvince, intl),
      {
        id: "currentLocation",
        header: intl.formatMessage(tableMessages.currentLocation),
      },
    ),
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
      data={poolCandidatesMappedToType}
      columns={columns}
      caption={title}
      sort={{ internal: true }}
      hiddenColumnIds={[
        "candidateName",
        "priority",
        "preferredLang",
        "email",
        "currentLocation",
      ]}
    />
  );
};

export default UserCandidatesTable;
