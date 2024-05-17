import { IntlShape } from "react-intl";

import {
  getLocalizedName,
  getSkillCategory,
  LocalizedArray,
  getLocalizedArray,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Chip, Chips } from "@gc-digital-talent/ui";
import {
  Maybe,
  Skill,
  SkillCategory,
  SkillFamily,
} from "@gc-digital-talent/graphql";

export function categoryAccessor(
  category: Maybe<SkillCategory>,
  intl: IntlShape,
) {
  return category
    ? intl.formatMessage(getSkillCategory(category as string))
    : "";
}

export function skillFamiliesCell(
  skillFamilies: Maybe<Maybe<SkillFamily>[]> | undefined,
  intl: IntlShape,
) {
  const families = skillFamilies
    ?.filter(notEmpty)
    .sort()
    .map((family) => (
      <Chip color="primary" key={family?.key}>
        {getLocalizedName(family.name, intl)}
      </Chip>
    ));

  return families ? <Chips>{families}</Chips> : null;
}

export function familiesAccessor(skill: Skill, intl: IntlShape) {
  return skill.families
    ?.map((family) => getLocalizedName(family.name, intl, true))
    .filter(notEmpty)
    .sort()
    .join(", ");
}

export function keywordsAccessor(skill: Skill, intl: IntlShape) {
  return getLocalizedArray(skill.keywords as LocalizedArray, intl);
}
