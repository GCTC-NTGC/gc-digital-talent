import { IntlShape } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Spoiler } from "@gc-digital-talent/ui";
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

export function descriptionCell(
  intl: IntlShape,
  name: string,
  description?: Maybe<string>,
) {
  return description ? (
    <Spoiler
      text={description}
      linkSuffix={intl.formatMessage(
        {
          defaultMessage: "description for {name}",
          id: "aq2pSe",
          description:
            "Link text suffix to read more of the description for a skill",
        },
        {
          name,
        },
      )}
    />
  ) : null;
}
