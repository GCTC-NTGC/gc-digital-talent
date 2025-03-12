import { IntlShape } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { AssessmentStep, PoolSkill } from "@gc-digital-talent/graphql";

export const assessmentStepDisplayName = (
  assessmentStep: Pick<AssessmentStep, "type" | "title">,
  intl: IntlShape,
): string => {
  const localizedTitle = getLocalizedName(assessmentStep?.title, intl, true);
  const localizedType = getLocalizedName(
    assessmentStep.type?.label,
    intl,
    true,
  );
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
  poolSkill: Pick<PoolSkill, "id" | "skill">,
  intl: IntlShape,
) => ({
  value: poolSkill.id,
  label: poolSkill?.skill?.name
    ? getLocalizedName(poolSkill.skill.name, intl)
    : intl.formatMessage(commonMessages.nameNotLoaded),
});
