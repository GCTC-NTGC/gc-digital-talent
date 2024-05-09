import React from "react";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";
import { IntlShape } from "react-intl";

import {
  commonMessages,
  getCandidateSuspendedFilterStatus,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";
import { Chip, Link, Spoiler } from "@gc-digital-talent/ui";
import {
  PoolCandidate,
  FragmentType,
  User,
  PoolCandidateStatus,
  CandidateSuspendedFilter,
  Maybe,
  AssessmentStep,
  ProvinceOrTerritory,
  Language,
  Pool,
} from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import CandidateBookmark, {
  PoolCandidate_BookmarkFragment,
} from "~/components/CandidateBookmark/CandidateBookmark";
import { getFullNameLabel } from "~/utils/nameUtils";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";
import useRoutes from "~/hooks/useRoutes";
import {
  getCandidateStatusChip,
  statusToJobPlacement,
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
) => {
  return <CandidateBookmark candidateQuery={candidate} size="lg" />;
};

export const bookmarkHeader = (intl: IntlShape) => (
  <BookmarkIcon
    data-h2-width="base(x1)"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
  />
);

export const statusCell = (
  status: PoolCandidateStatus | null | undefined,
  intl: IntlShape,
) => {
  if (!status) return null;

  if (status === PoolCandidateStatus.NewApplication) {
    return (
      <span
        data-h2-color="base(tertiary.darker)"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(getPoolCandidateStatus(status as string))}
      </span>
    );
  }
  if (
    status === PoolCandidateStatus.ApplicationReview ||
    status === PoolCandidateStatus.ScreenedIn ||
    status === PoolCandidateStatus.ScreenedOutApplication ||
    status === PoolCandidateStatus.ScreenedOutNotInterested ||
    status === PoolCandidateStatus.ScreenedOutNotResponsive ||
    status === PoolCandidateStatus.UnderAssessment ||
    status === PoolCandidateStatus.ScreenedOutAssessment
  ) {
    return (
      <span data-h2-font-weight="base(700)">
        {intl.formatMessage(getPoolCandidateStatus(status as string))}
      </span>
    );
  }
  return (
    <span>{intl.formatMessage(getPoolCandidateStatus(status as string))}</span>
  );
};

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
        {intl.formatMessage(getPoolCandidatePriorities(priority))}
      </span>
    );
  }
  return (
    <span>{intl.formatMessage(getPoolCandidatePriorities(priority))}</span>
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

export const preferredLanguageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {intl.formatMessage(
      language ? getLanguage(language) : commonMessages.notFound,
    )}
  </span>
);

export const currentLocationAccessor = (
  city: string | null | undefined,
  province: ProvinceOrTerritory | null | undefined,
  intl: IntlShape,
) =>
  `${city || intl.formatMessage(commonMessages.notFound)}, ${intl.formatMessage(
    province
      ? getProvinceOrTerritory(province as string)
      : commonMessages.notFound,
  )}`;

export const finalDecisionCell = (
  intl: IntlShape,
  poolCandidate: PoolCandidate,
  poolAssessmentSteps: AssessmentStep[],
) => {
  const { color, label } = getCandidateStatusChip(
    poolCandidate,
    unpackMaybes(poolAssessmentSteps),
    intl,
  );
  return <Chip color={color}>{label}</Chip>;
};

export const jobPlacementCell = (
  intl: IntlShape,
  status?: Maybe<PoolCandidateStatus>,
) => {
  return <span>{intl.formatMessage(statusToJobPlacement(status))}</span>;
};
