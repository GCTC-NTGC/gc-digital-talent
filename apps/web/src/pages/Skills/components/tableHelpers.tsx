import { IntlShape } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  LocalizedSkillCategory,
  Maybe,
  Skill,
  SkillFamily,
} from "@gc-digital-talent/graphql";

export function categoryAccessor(
  category: Maybe<LocalizedSkillCategory>,
  intl: IntlShape,
) {
  return category?.label ? getLocalizedName(category.label, intl) : "";
}

export function skillFamiliesCell(
  skillFamilies: Maybe<Maybe<SkillFamily>[]> | undefined,
  intl: IntlShape,
) {
  const maxCharacterCount = 50;
  const familyNames = skillFamilies
    ?.filter(notEmpty)
    .sort()
    .map((family) => getLocalizedName(family.name, intl));

  familyNames?.sort((a, b) => a.localeCompare(b));

  const familyItems = familyNames?.map((familyName) => (
    <li key={familyName}>
      {familyName.length < maxCharacterCount ? (
        familyName
      ) : (
        // eslint-disable-next-line formatjs/no-literal-string-in-jsx
        <>{familyName.slice(0, maxCharacterCount)}&hellip;</>
      )}
    </li>
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
