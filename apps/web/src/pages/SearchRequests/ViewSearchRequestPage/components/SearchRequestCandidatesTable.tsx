import { useIntl } from "react-intl";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  PoolCandidateSearchInput,
  CandidateSuspendedFilter,
  CandidateExpiryFilter,
  PlacementType,
  ApplicationStatus,
} from "@gc-digital-talent/graphql";

import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import adminMessages from "~/messages/adminMessages";
import {
  PartialApplicantFilter,
  PartialPoolCandidateFilter,
} from "~/types/searchRequest";

type AbstractFilter = PartialPoolCandidateFilter | PartialApplicantFilter;

function isPoolCandidateFilter(
  filter: AbstractFilter,
): filter is PartialPoolCandidateFilter {
  if (filter.__typename === "PoolCandidateFilter") return true;

  return false;
}

const transformApplicantFilterToPoolCandidateSearchInput = (
  applicantFilter: PartialApplicantFilter,
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
      flexibleWorkLocations: applicantFilter?.flexibleWorkLocations
        ?.filter(notEmpty)
        .map((loc) => loc?.value),
      operationalRequirements: applicantFilter?.operationalRequirements
        ?.filter(notEmpty)
        .map((req) => req?.value),
      pools: unpackMaybes(applicantFilter.pools).map(({ id }) => ({ id })),
      skills: unpackMaybes(applicantFilter.skills).map(({ id }) => ({ id })),
      community: applicantFilter?.community?.id
        ? { id: applicantFilter.community.id }
        : undefined,
    },
    appliedClassifications: applicantFilter.qualifiedInClassifications
      ?.filter(notEmpty)
      .map(({ group, level }) => ({ group, level })),
    workStreams: unpackMaybes(applicantFilter.qualifiedInWorkStreams).map(
      ({ id }) => ({
        id,
      }),
    ),
    statuses: [ApplicationStatus.Qualified],
    placementTypes: [
      PlacementType.NotPlaced,
      PlacementType.PlacedTentative,
      PlacementType.PlacedCasual,
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
      doNotUseBookmark
      doNotUseFlag
    />
  );
};

export default SingleSearchRequestTableApi;
