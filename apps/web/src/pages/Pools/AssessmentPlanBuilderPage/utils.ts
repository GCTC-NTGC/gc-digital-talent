import type { IntlShape } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import type { LocalizedString } from "@gc-digital-talent/graphql";

export const assessmentStepDisplayName = (
  title: LocalizedString | null | undefined,
  typeLabel: LocalizedString | null | undefined,
  intl: IntlShape,
): string => {
  const localizedTitle = getLocalizedName(title, intl, true);
  const localizedType = getLocalizedName(typeLabel, intl, true);
  if (localizedTitle && localizedType) {
    return `${localizedTitle} (${localizedType})`;
  }

  if (!localizedTitle && localizedType) {
    return localizedType;
  }

  if (localizedTitle && !localizedType) {
    return localizedTitle;
  }

  return intl.formatMessage(commonMessages.notAvailable);
};

export const poolSkillToOption = (
  id: string,
  skillName: LocalizedString | null | undefined,
  intl: IntlShape,
) => ({
  value: id,
  label: skillName
    ? getLocalizedName(skillName, intl)
    : intl.formatMessage(commonMessages.nameNotLoaded),
});
