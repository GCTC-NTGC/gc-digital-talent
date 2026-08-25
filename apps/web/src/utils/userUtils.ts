import type { IntlShape } from "react-intl";
import type { ReactNode } from "react";

import type {
  EvaluatedLanguageAbility,
  LocalizedString,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { PositionDuration } from "@gc-digital-talent/graphql";
import type {
  GenericLocalizedEnum,
  TEmploymentDuration,
} from "@gc-digital-talent/i18n";
import {
  commonMessages,
  EmploymentDuration,
  getLocalizedName,
} from "@gc-digital-talent/i18n";

// options on copy are TERM or INDETERMINATE
export function durationToEnumPositionDuration(
  selection: TEmploymentDuration,
): PositionDuration | undefined {
  if (selection === EmploymentDuration.Term) {
    return PositionDuration.Temporary;
  }
  if (selection === EmploymentDuration.Indeterminate) {
    return PositionDuration.Permanent;
  }
  return undefined;
}

export function positionDurationToEmploymentDuration(
  positionDuration?: (PositionDuration | null | undefined)[] | null,
): TEmploymentDuration | undefined {
  const durations = unpackMaybes(positionDuration);
  if (!durations.length) return undefined;

  return durations.includes(PositionDuration.Temporary)
    ? EmploymentDuration.Term
    : EmploymentDuration.Indeterminate;
}

export const getEvaluatedLanguageLevels = (
  intl: IntlShape,
  comprehensionLevel:
    GenericLocalizedEnum<EvaluatedLanguageAbility> | null | undefined,
  writtenLevel:
    GenericLocalizedEnum<EvaluatedLanguageAbility> | null | undefined,
  verbalLevel:
    GenericLocalizedEnum<EvaluatedLanguageAbility> | null | undefined,
): ReactNode => {
  return [
    comprehensionLevel?.label
      ? getLocalizedName(comprehensionLevel.label, intl)
      : "",
    writtenLevel?.label ? getLocalizedName(writtenLevel.label, intl) : "",
    verbalLevel?.label ? getLocalizedName(verbalLevel.label, intl) : "",
  ].join(", ");
};

interface LocationRegion {
  label: LocalizedString;
}

interface FormatLocationArgs {
  city?: string | null;
  region?: LocationRegion | null;
  intl: IntlShape;
}

export const formatLocation = ({
  city,
  region,
  intl,
}: FormatLocationArgs): string => {
  if (city && region?.label) {
    return `${city}, ${region.label.localized}`;
  }

  if (city && !region) return city;

  if (region?.label.localized && !city) return region.label.localized;

  return intl.formatMessage(commonMessages.notProvided);
};
