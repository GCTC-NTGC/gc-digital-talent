import { IntlShape } from "react-intl";
import { ReactNode } from "react";

import {
  LocalizedEvaluatedLanguageAbility,
  LocalizedProvinceOrTerritory,
  Maybe,
  PositionDuration,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  EmploymentDuration,
  getLocalizedName,
  TEmploymentDuration,
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
  region?: Maybe<Omit<LocalizedProvinceOrTerritory, "value">>;
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
