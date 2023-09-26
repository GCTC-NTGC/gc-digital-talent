import React from "react";
import { IntlShape } from "react-intl";

import {
  LocalizedString,
  Maybe,
  Skill,
  SkillCategory,
  SkillFamily,
} from "@gc-digital-talent/graphql";
import {
  Locales,
  getLocalizedName,
  getSkillCategory,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pill } from "@gc-digital-talent/ui";

export function categoryAccessor(
  category: Maybe<SkillCategory>,
  intl: IntlShape,
) {
  return category
    ? intl.formatMessage(getSkillCategory(category as string))
    : "";
}

export function skillFamiliesCell(
  skillFamilies: Maybe<Maybe<SkillFamily>[]>,
  intl: IntlShape,
) {
  const families = skillFamilies?.filter(notEmpty).map((family) => (
    <Pill color="primary" mode="outline" key={family?.key}>
      {getLocalizedName(family.name, intl)}
    </Pill>
  ));

  return families ? <span>{families}</span> : null;
}

export function keywordsAccessor(skill: Skill, intl: IntlShape) {
  return getLocalizedName(skill.keywords as LocalizedString, intl);
}

export function familiesAccessor(skill: Skill, intl: IntlShape) {
  return skill.families
    ?.map((family) => getLocalizedName(family.name, intl, true))
    .filter(notEmpty)
    .sort()
    .join(", ");
}
