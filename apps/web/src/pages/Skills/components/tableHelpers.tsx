import type { IntlShape } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import type {
  LocalizedSkillCategory,
  Skill,
  SkillFamily,
} from "@gc-digital-talent/graphql";

export function categoryAccessor(
  category: LocalizedSkillCategory | null,
  intl: IntlShape,
) {
  return category?.label ? getLocalizedName(category.label, intl) : "";
}

export function skillFamiliesCell(
  skillFamilies: (SkillFamily | null)[] | null | undefined,
  intl: IntlShape,
) {
  const familyNames = skillFamilies
    ?.filter(notEmpty)
    .sort()
    .map((family) => getLocalizedName(family.name, intl));

  familyNames?.sort((a, b) => a.localeCompare(b));

  const familyItems = familyNames?.map((familyName) => (
    <li key={familyName}>{familyName}</li>
  ));

  return familyItems ? <ul>{familyItems}</ul> : null;
}

export function familiesAccessor(skill: Skill, intl: IntlShape) {
  return skill.families
    ?.map((family) => getLocalizedName(family.name, intl, true))
    .filter(notEmpty)
    .sort()
    .join(", ");
}
