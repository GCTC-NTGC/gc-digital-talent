import React from "react";
import { useIntl } from "react-intl";

import { getLocale } from "../../../helpers/localize";
import type { Maybe, Skill } from "../../../api/generated";
import Chip, { Chips } from "../../Chip";

export interface MissingSkillsProps {
  requiredSkills?: Skill[];
  optionalSkills?: Skill[];
  addedSkills?: Skill[];
}

export const getMissingSkills = (required: Skill[], added?: Skill[]) => {
  return !added?.length
    ? required
    : required.filter((skill) => {
        return !added.find((addedSkill) => addedSkill.id === skill.id);
      });
};

const MissingSkills = ({
  requiredSkills,
  optionalSkills,
  addedSkills,
}: MissingSkillsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const byLocalizedName = (a: Skill, b: Skill) => {
    const aName: Maybe<string> = a.name[locale];
    const bName: Maybe<string> = b.name[locale];
    if (aName && bName) {
      return aName.localeCompare(bName, locale);
    }
    return 0;
  };

  const missingRequiredSkills = getMissingSkills(
    requiredSkills || [],
    addedSkills,
  ).sort(byLocalizedName);
  const missingOptionalSkills = getMissingSkills(
    optionalSkills || [],
    addedSkills,
  ).sort(byLocalizedName);

  return (
    <>
      {missingRequiredSkills.length ? (
        <>
          <p>
            {intl.formatMessage({
              defaultMessage:
                'The following "Need to have" <red>required</red> skills are missing from your profile:',
              description:
                "Text that appears when a user is missing required skills on their profile",
            })}
          </p>
          <Chips>
            {missingRequiredSkills.map((skill) => (
              <Chip
                key={skill.id}
                color="primary"
                mode="outline"
                label={skill.name[locale] ?? ""}
              />
            ))}
          </Chips>
        </>
      ) : null}
      {missingOptionalSkills.length ? (
        <>
          <p>
            {intl.formatMessage({
              defaultMessage:
                'Other "Nice to have" skills you may want to consider adding to your profile:',
              description:
                "Text that appears when a user is missing optional skills on their profile",
            })}
          </p>
          <Chips>
            {missingOptionalSkills.map((skill) => (
              <Chip
                key={skill.id}
                color="primary"
                mode="outline"
                label={skill.name[locale] ?? ""}
              />
            ))}
          </Chips>
        </>
      ) : null}
    </>
  );
};

export default MissingSkills;
