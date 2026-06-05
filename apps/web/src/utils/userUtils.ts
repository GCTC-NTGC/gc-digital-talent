import type { IntlShape } from "react-intl";
import type { ReactNode } from "react";

import type {
  LocalizedEvaluatedLanguageAbility,
  LocalizedProvinceOrTerritory,
} from "@gc-digital-talent/graphql";
import { PositionDuration } from "@gc-digital-talent/graphql";
import type { TEmploymentDuration } from "@gc-digital-talent/i18n";
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

export const getEvaluatedLanguageLevels = (
  intl: IntlShape,
  comprehensionLevel: LocalizedEvaluatedLanguageAbility | null | undefined,
  writtenLevel: LocalizedEvaluatedLanguageAbility | null | undefined,
  verbalLevel: LocalizedEvaluatedLanguageAbility | null | undefined,
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
  city?: string | null;
  region?: Omit<LocalizedProvinceOrTerritory, "value"> | null;
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
