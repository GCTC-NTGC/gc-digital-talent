import { IntlShape } from "react-intl";

import {
  getLocalizedName,
  getSkillCategory,
  LocalizedArray,
  getLocalizedArray,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Spoiler } from "@gc-digital-talent/ui";
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
      <li key={family?.key}>{getLocalizedName(family.name, intl)}</li>
    ));

  return families ? <ul>{families}</ul> : null;
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
