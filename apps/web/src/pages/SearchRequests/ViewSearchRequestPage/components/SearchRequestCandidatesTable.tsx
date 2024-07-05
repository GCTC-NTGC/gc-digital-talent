import { useIntl } from "react-intl";
import omit from "lodash/omit";
import pick from "lodash/pick";

import { identity, notEmpty } from "@gc-digital-talent/helpers";
import {
  ApplicantFilterInput,
  PoolCandidateFilter,
  ApplicantFilter,
  IdInput,
  Classification,
  ClassificationFilterInput,
  PoolCandidateSearchInput,
  PoolCandidateStatus,
  CandidateSuspendedFilter,
  CandidateExpiryFilter,
} from "@gc-digital-talent/graphql";
import {
  localizedEnumArrayToInput,
  localizedEnumToInput,
} from "@gc-digital-talent/i18n";

import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import adminMessages from "~/messages/adminMessages";

type AbstractFilter = PoolCandidateFilter | ApplicantFilter;

function isPoolCandidateFilter(
  filter: AbstractFilter,
): filter is PoolCandidateFilter {
  if (filter.__typename === "PoolCandidateFilter") return true;

  return false;
}

function omitIdAndTypename<T extends object | null | undefined>(
  x: T,
): Omit<T, "id" | "__typename"> {
  return omit(x, ["id", "__typename"]) as Omit<T, "id" | "__typename">;
}

function pickId<T extends IdInput>(x: T): IdInput {
  return pick(x, ["id"]);
}

function classificationToInput(c: Classification): ClassificationFilterInput {
  return pick(c, ["group", "level"]);
}

// Maps each property in ApplicantFilterInput to a function which transforms the matching value from an ApplicantFilter object to the appropriate shape for ApplicantFilterInput.
type MappingType = {
  [Property in keyof Omit<
    ApplicantFilterInput,
    "email" | "name" | "generalSearch" | "skillsIntersectional"
  >]: (x: ApplicantFilter[Property]) => ApplicantFilterInput[Property];
};

const transformApplicantFilterToPoolCandidateSearchInput = (
  applicantFilter: ApplicantFilter,
): PoolCandidateSearchInput => {
  // GraphQL will error if an input object includes any unexpected attributes.
  // Therefore, transforming ApplicantFilter to ApplicantFilterInput requires omitting any fields not included in the Input type.
  const mapping: MappingType = {
    equity: omitIdAndTypename,
    hasDiploma: identity,
    languageAbility: localizedEnumToInput,
    locationPreferences: localizedEnumArrayToInput,
    operationalRequirements: localizedEnumArrayToInput,
    pools: (pools) => pools?.filter(notEmpty).map(pickId),
    skills: (skills) => skills?.filter(notEmpty).map(pickId),
    positionDuration: identity,
    qualifiedStreams: localizedEnumArrayToInput,
  };

  const emptyFilter: ApplicantFilterInput = {};

  return {
    applicantFilter: Object.entries(mapping).reduce(
      (applicantFilterInput, filterEntry) => {
        const [key, transform] = filterEntry;
        const typedKey = key as keyof MappingType;

        // There should be way to get the types to work without using "any", but I'm having trouble.
        // I think its safe to fallback on any here because mapping has just been defined, and we can be confident that key and transform line up correctly.

        // eslint-disable-next-line no-param-reassign
        applicantFilterInput[typedKey] = transform(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          applicantFilter[typedKey] as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any;
        return applicantFilterInput;
      },
      emptyFilter,
    ),
    appliedClassifications: applicantFilter.qualifiedClassifications
      ?.filter(notEmpty)
      .map(classificationToInput),
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
