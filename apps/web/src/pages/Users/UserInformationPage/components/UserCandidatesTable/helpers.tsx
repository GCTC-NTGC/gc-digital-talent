import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";
import { IntlShape } from "react-intl";

import {
  commonMessages,
  MaybeLocalizedEnums,
  getLocalizedEnumStringByValue,
} from "@gc-digital-talent/i18n";
import { Chip, Link, Spoiler } from "@gc-digital-talent/ui";
import {
  FragmentType,
  CandidateSuspendedFilter,
  Maybe,
  Pool,
  AssessmentResultStatus,
  Scalars,
  PriorityWeight,
  Classification,
  LocalizedFinalDecision,
} from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import CandidateBookmark, {
  PoolCandidate_BookmarkFragment,
} from "~/components/CandidateBookmark/CandidateBookmark";
import { getFullNameLabel } from "~/utils/nameUtils";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";
import useRoutes from "~/hooks/useRoutes";
import { getCandidateStatusChip } from "~/utils/poolCandidate";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

export const candidateNameCell = (
  firstName: Maybe<string> | undefined,
  lastName: Maybe<string> | undefined,
  candidateId: Scalars["UUID"]["output"],
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
  tableCandidateIds?: string[],
) => {
  const candidateName = getFullNameLabel(firstName, lastName, intl);
  return (
    <Link
      href={paths.poolCandidateApplication(candidateId)}
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
    className="size-6"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
  />
);

export const priorityCell = (
  priorityWeight: number | null | undefined,
  priorities: MaybeLocalizedEnums | undefined,
  intl: IntlShape,
) => {
  let priority: PriorityWeight | null = null;
  switch (priorityWeight) {
    case 10:
      priority = PriorityWeight.PriorityEntitlement;
      break;
    case 20:
      priority = PriorityWeight.Veteran;
      break;
    case 30:
      priority = PriorityWeight.CitizenOrPermanentResident;
      break;
    default:
    // null
  }

  if (!priority) return null;

  const label = getLocalizedEnumStringByValue(priority, priorities, intl);

  if (priorityWeight === 10 || priorityWeight === 20) {
    return (
      <span className="font-bold text-secondary-600 dark:text-secondary-200">
        {label}
      </span>
    );
  }
  return <span>{label}</span>;
};

export const processCell = (
  pool: Pick<Pool, "id" | "workStream" | "name" | "publishingGroup"> & {
    classification?: Maybe<Pick<Classification, "group" | "level">>;
  },
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) => {
  const poolName = getFullPoolTitleLabel(intl, {
    workStream: pool.workStream,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    classification: pool.classification,
  });
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

export const candidacyStatusAccessor = (
  suspendedAt: string | null | undefined,
  suspendedStatusStrings: MaybeLocalizedEnums | undefined,
  intl: IntlShape,
) => {
  if (suspendedAt) {
    const parsedSuspendedTime = parseDateTimeUtc(suspendedAt);
    const currentTime = new Date();
    const suspendedStatus = getSuspendedStatus(
      parsedSuspendedTime,
      currentTime,
    );
    return getLocalizedEnumStringByValue(
      suspendedStatus,
      suspendedStatusStrings,
      intl,
    );
  }

  return getLocalizedEnumStringByValue(
    CandidateSuspendedFilter.Active,
    suspendedStatusStrings,
    intl,
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
  finalDecsion: Maybe<LocalizedFinalDecision> | undefined,
  assessmentStatus: Maybe<AssessmentResultStatus> | undefined,
  intl: IntlShape,
) => {
  const { color, label } = getCandidateStatusChip(
    finalDecsion,
    assessmentStatus,
    intl,
  );
  return <Chip color={color}>{label}</Chip>;
};
