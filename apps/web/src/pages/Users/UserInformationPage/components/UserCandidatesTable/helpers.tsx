import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";
import { IntlShape } from "react-intl";

import {
  commonMessages,
  getCandidateSuspendedFilterStatus,
  getPoolCandidatePriorities,
} from "@gc-digital-talent/i18n";
import { Chip, Link, Spoiler } from "@gc-digital-talent/ui";
import {
  PoolCandidate,
  FragmentType,
  User,
  PoolCandidateStatus,
  CandidateSuspendedFilter,
  Maybe,
  Pool,
  AssessmentResultStatus,
} from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import CandidateBookmark, {
  PoolCandidate_BookmarkFragment,
} from "~/components/CandidateBookmark/CandidateBookmark";
import { getFullNameLabel } from "~/utils/nameUtils";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";
import useRoutes from "~/hooks/useRoutes";
import {
  getCandidateStatusChip,
  getPriorityWeight,
} from "~/utils/poolCandidate";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

export const candidateNameCell = (
  user: User,
  candidate: PoolCandidate,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
  tableCandidateIds?: string[],
) => {
  const candidateName = getFullNameLabel(user.firstName, user.lastName, intl);
  return (
    <Link
      href={paths.poolCandidateApplication(candidate.id)}
      state={{ candidateIds: tableCandidateIds, stepName: null }}
    >
      {candidateName}
    </Link>
  );
};
export const bookmarkCell = (
  candidate: FragmentType<typeof PoolCandidate_BookmarkFragment>,
  isBookmarked?: Maybe<boolean>,
) => {
  return (
    <CandidateBookmark
      candidateQuery={candidate}
      bookmarked={isBookmarked ?? undefined}
      size="lg"
    />
  );
};

export const bookmarkHeader = (intl: IntlShape) => (
  <BookmarkIcon
    data-h2-width="base(x1)"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
  />
);

export const priorityCell = (
  priority: number | null | undefined,
  intl: IntlShape,
) => {
  if (!priority) return null;

  if (priority === 10 || priority === 20) {
    return (
      <span
        data-h2-color="base(primary.darker)"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(
          getPoolCandidatePriorities(getPriorityWeight(priority)),
        )}
      </span>
    );
  }
  return (
    <span>
      {intl.formatMessage(
        getPoolCandidatePriorities(getPriorityWeight(priority)),
      )}
    </span>
  );
};

export const processCell = (
  pool: Pool,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) => {
  const poolName = getFullPoolTitleLabel(intl, pool);
  return (
    <Link
      href={paths.poolView(pool.id)}
      aria-label={
        intl.formatMessage(processMessages.process) +
        intl.formatMessage(commonMessages.dividingColon) +
        poolName
      }
    >
      {poolName}
    </Link>
  );
};

export const candidacyStatusAccessor = (
  suspendedAt: string | null | undefined,
  intl: IntlShape,
) => {
  // suspended_at is a time, must output ACTIVE or SUSPENDED strings for column viewing and sorting
  const getSuspendedStatus = (
    suspendedTime: Date,
    currentTime: Date,
  ): CandidateSuspendedFilter => {
    if (suspendedTime >= currentTime) {
      return CandidateSuspendedFilter.Active;
    }
    return CandidateSuspendedFilter.Suspended;
  };

  if (suspendedAt) {
    const parsedSuspendedTime = parseDateTimeUtc(suspendedAt);
    const currentTime = new Date();
    return intl.formatMessage(
      getCandidateSuspendedFilterStatus(
        getSuspendedStatus(parsedSuspendedTime, currentTime),
      ),
    );
  }

  return intl.formatMessage(
    getCandidateSuspendedFilterStatus(CandidateSuspendedFilter.Active),
  );
};

export const notesCell = (
  intl: IntlShape,
  firstName?: Maybe<string>,
  lastName?: Maybe<string>,
  notes?: Maybe<string>,
) =>
  notes ? (
    <Spoiler
      text={notes}
      linkSuffix={intl.formatMessage(
        {
          defaultMessage: "notes for {name}",
          id: "CZbb7c",
          description:
            "Link text suffix to read more notes for a pool candidate",
        },
        {
          name: getFullNameLabel(firstName, lastName, intl),
        },
      )}
    />
  ) : null;

export const finalDecisionCell = (
  status: Maybe<PoolCandidateStatus> | undefined,
  assessmentStatus: Maybe<AssessmentResultStatus> | undefined,
  intl: IntlShape,
) => {
  const { color, label } = getCandidateStatusChip(
    status,
    assessmentStatus,
    intl,
  );
  return <Chip color={color}>{label}</Chip>;
};
