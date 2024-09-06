import { IntlShape } from "react-intl";
import { ReactNode } from "react";

import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  LanguageAbility,
  LocalizedEvaluatedLanguageAbility,
  LocalizedProvinceOrTerritory,
  Maybe,
  OperationalRequirement,
  PoolCandidateStatus,
  PositionDuration,
  PriorityWeight,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

// convert string type to Enum types for various selections
export function stringToEnumLanguage(
  selection: string,
): LanguageAbility | undefined {
  if (Object.values(LanguageAbility).includes(selection as LanguageAbility)) {
    return selection as LanguageAbility;
  }
  return undefined;
}

export function stringToEnumLocation(
  selection: string,
): WorkRegion | undefined {
  if (Object.values(WorkRegion).includes(selection as WorkRegion)) {
    return selection as WorkRegion;
  }
  return undefined;
}

export function stringToEnumOperational(
  selection: string,
): OperationalRequirement | undefined {
  if (
    Object.values(OperationalRequirement).includes(
      selection as OperationalRequirement,
    )
  ) {
    return selection as OperationalRequirement;
  }
  return undefined;
}

export function stringToEnumPoolCandidateStatus(
  selection: string,
): PoolCandidateStatus | undefined {
  if (
    Object.values(PoolCandidateStatus).includes(
      selection as PoolCandidateStatus,
    )
  ) {
    return selection as PoolCandidateStatus;
  }
  return undefined;
}

export function stringToEnumPriorityWeight(
  selection: string,
): PriorityWeight | undefined {
  if (Object.values(PriorityWeight).includes(selection as PriorityWeight)) {
    return selection as PriorityWeight;
  }
  return undefined;
}

export function stringToEnumCandidateExpiry(
  selection: string,
): CandidateExpiryFilter | undefined {
  if (
    Object.values(CandidateExpiryFilter).includes(
      selection as CandidateExpiryFilter,
    )
  ) {
    return selection as CandidateExpiryFilter;
  }
  return undefined;
}

export function stringToEnumCandidateSuspended(
  selection: string,
): CandidateSuspendedFilter | undefined {
  if (
    Object.values(CandidateSuspendedFilter).includes(
      selection as CandidateSuspendedFilter,
    )
  ) {
    return selection as CandidateSuspendedFilter;
  }
  return undefined;
}

// options on copy are TERM or INDETERMINATE
export function durationToEnumPositionDuration(
  selection: string,
): PositionDuration | undefined {
  if (selection === "TERM") {
    return PositionDuration.Temporary;
  }
  if (selection === "INDETERMINATE") {
    return PositionDuration.Permanent;
  }
  return undefined;
}

export const getEvaluatedLanguageLevels = (
  intl: IntlShape,
  comprehensionLevel: Maybe<LocalizedEvaluatedLanguageAbility> | undefined,
  writtenLevel: Maybe<LocalizedEvaluatedLanguageAbility> | undefined,
  verbalLevel: Maybe<LocalizedEvaluatedLanguageAbility> | undefined,
): ReactNode => {
  return [
    comprehensionLevel?.label
      ? getLocalizedName(comprehensionLevel.label, intl)
      : "",
    writtenLevel?.label ? getLocalizedName(writtenLevel.label, intl) : "",
    verbalLevel?.label ? getLocalizedName(verbalLevel.label, intl) : "",
  ].join(", ");
};

interface FormatLocationArgs {
  city?: Maybe<string>;
  region?: Maybe<LocalizedProvinceOrTerritory>;
  intl: IntlShape;
}

export const formatLocation = ({
  city,
  region,
  intl,
}: FormatLocationArgs): string => {
  if (city && region?.label) {
    return `${city}, ${getLocalizedName(region.label, intl)}`;
  }

  if (city && !region) return city;

  if (region && !city) return getLocalizedName(region.label, intl);

  return intl.formatMessage(commonMessages.notProvided);
};
