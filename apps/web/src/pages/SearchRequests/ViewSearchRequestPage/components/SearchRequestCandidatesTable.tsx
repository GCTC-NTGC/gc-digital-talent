import { useIntl } from "react-intl";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  PoolCandidateFilter,
  ApplicantFilter,
  PoolCandidateSearchInput,
  PoolCandidateStatus,
  CandidateSuspendedFilter,
  CandidateExpiryFilter,
} from "@gc-digital-talent/graphql";

import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import adminMessages from "~/messages/adminMessages";

type AbstractFilter = PoolCandidateFilter | ApplicantFilter;

function isPoolCandidateFilter(
  filter: AbstractFilter,
): filter is PoolCandidateFilter {
  if (filter.__typename === "PoolCandidateFilter") return true;

  return false;
}

const transformApplicantFilterToPoolCandidateSearchInput = (
  applicantFilter: ApplicantFilter,
): PoolCandidateSearchInput => {
  return {
    applicantFilter: {
      equity: {
        isWoman: applicantFilter.equity?.isWoman ?? undefined,
        hasDisability: applicantFilter.equity?.hasDisability,
        isIndigenous: applicantFilter.equity?.isIndigenous,
        isVisibleMinority: applicantFilter.equity?.isVisibleMinority,
      },
      hasDiploma: applicantFilter?.hasDiploma,
      positionDuration: applicantFilter?.positionDuration,
      languageAbility: applicantFilter.languageAbility?.value,
      locationPreferences: applicantFilter?.locationPreferences
        ?.filter(notEmpty)
        .map((workRegion) => workRegion?.value),
      operationalRequirements: applicantFilter?.operationalRequirements
        ?.filter(notEmpty)
        .map((req) => req?.value),
      pools: unpackMaybes(applicantFilter.pools).map(({ id }) => ({ id })),
      skills: unpackMaybes(applicantFilter.skills).map(({ id }) => ({ id })),
      workStreams: unpackMaybes(applicantFilter.workStreams).map(({ id }) => ({
        id,
      })),
      community: applicantFilter?.community?.id
        ? { id: applicantFilter.community.id }
        : undefined,
    },
    appliedClassifications: applicantFilter.qualifiedClassifications
      ?.filter(notEmpty)
      .map(({ group, level }) => ({ group, level })),
    poolCandidateStatus: [
      PoolCandidateStatus.QualifiedAvailable,
      PoolCandidateStatus.PlacedCasual,
      PoolCandidateStatus.PlacedTentative,
    ],
  };
};

const SingleSearchRequestTableApi = ({
  filter,
}: {
  filter: AbstractFilter;
}) => {
  const intl = useIntl();
  const isLegacyFilter = isPoolCandidateFilter(filter);

  const applicantFilterInput = !isLegacyFilter
    ? transformApplicantFilterToPoolCandidateSearchInput(filter)
    : undefined;

  return (
    <PoolCandidatesTable
      initialFilterInput={
        isLegacyFilter
          ? undefined
          : {
              ...applicantFilterInput,
              suspendedStatus: CandidateSuspendedFilter.Active, // add default filters
              expiryStatus: CandidateExpiryFilter.Active,
            }
      }
      title={intl.formatMessage(adminMessages.poolCandidates)}
    />
  );
};

export default SingleSearchRequestTableApi;
