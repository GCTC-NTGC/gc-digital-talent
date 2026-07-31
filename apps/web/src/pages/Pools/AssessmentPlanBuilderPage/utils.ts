import type { IntlShape } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

export const assessmentStepDisplayName = (
  title: string | null | undefined,
  typeLabel: string | null | undefined,
  intl: IntlShape,
): string => {
  if (title && typeLabel) {
    return `${title} (${typeLabel})`;
  }

  if (!title && typeLabel) {
    return typeLabel;
  }

  if (title && !typeLabel) {
    return title;
  }

  return intl.formatMessage(commonMessages.notAvailable);
};

export const poolSkillToOption = (
  id: string,
  skillName: string | null | undefined,
  intl: IntlShape,
) => ({
  value: id,
  label: skillName ?? intl.formatMessage(commonMessages.nameNotLoaded),
});
