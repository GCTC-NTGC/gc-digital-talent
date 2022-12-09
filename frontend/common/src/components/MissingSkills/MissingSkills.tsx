import React from "react";
import { useIntl } from "react-intl";

import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";
import Chip, { Chips } from "../Chip";

import { categorizeSkill, getMissingSkills } from "../../helpers/skillUtils";
import { getLocale } from "../../helpers/localize";
import type { Maybe, Skill } from "../../api/generated";
import { PillColor, PillMode } from "../Pill";

const MissingSkillsBlock = ({
  pillType,
  title,
  blurb,
  icon,
  missingSkills,
  ...rest
}: {
  pillType: { color: PillColor; mode: PillMode };
  title: React.ReactNode;
  blurb: React.ReactNode;
  icon: React.ReactNode;
  missingSkills: Skill[];
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(rounded)"
      {...rest}
    >
      <span data-h2-margin="base(0, x1, 0, 0)">{icon}</span>
      <div>
        <p data-h2-margin="base(0, 0, x.5, 0)">
          <strong>{title}</strong>
        </p>
        <p data-h2-margin="base(0, 0, x.25, 0)">{blurb}</p>
        <Chips>
          {missingSkills.map((skill: Skill) => (
            <Chip
              key={skill.id}
              color={pillType.color}
              mode={pillType.mode}
              label={skill.name[locale] ?? ""}
              data-h2-margin="base(x.25, x.25, 0, 0)"
            />
          ))}
        </Chips>
      </div>
    </div>
  );
};

export interface MissingSkillsProps {
  requiredSkills?: Skill[];
  optionalSkills?: Skill[];
  addedSkills?: Skill[];
}

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

  const categorizedRequiredSkills = categorizeSkill(requiredSkills);
  const categorizedOptionalSkills = categorizeSkill(optionalSkills);

  const missingRequiredSkills = getMissingSkills(
    categorizedRequiredSkills.TECHNICAL || [],
    addedSkills,
  ).sort(byLocalizedName);
  const missingTransferableSkills = getMissingSkills(
    [
      ...(categorizedRequiredSkills.BEHAVIOURAL || []),
      ...(categorizedOptionalSkills.BEHAVIOURAL || []),
    ] || [],
    addedSkills,
  ).sort(byLocalizedName);
  const missingOptionalSkills = getMissingSkills(
    categorizedOptionalSkills.TECHNICAL || [],
    addedSkills,
  ).sort(byLocalizedName);

  return (
    <>
      {missingRequiredSkills.length ? (
        <MissingSkillsBlock
          data-h2-background-color="base(light.dt-error.05)"
          data-h2-margin="base(0, 0, x.5, 0)"
          pillType={{ color: "error", mode: "outline" }}
          title={intl.formatMessage({
            defaultMessage: "Required application skills",
            id: "B89Ihf",
            description:
              "Title that appears when a user is missing required skills on their profile.",
          })}
          blurb={intl.formatMessage({
            defaultMessage:
              "These required skills are missing from your profile:",
            id: "AhQ6xv",
            description:
              "Text that appears when a user is missing required skills on their profile.",
          })}
          icon={<ExclamationTriangleIcon style={{ width: "1.2rem" }} />}
          missingSkills={missingRequiredSkills}
        />
      ) : null}
      {missingTransferableSkills.length ? (
        <MissingSkillsBlock
          data-h2-background-color="base(light.dt-primary.10)"
          data-h2-margin="base(0, 0, x.5, 0)"
          pillType={{ color: "primary", mode: "outline" }}
          title={intl.formatMessage({
            defaultMessage: "Required transferable skills",
            id: "4+Q/Zt",
            description:
              "Title that appears when a user is missing required skills on their profile.",
          })}
          blurb={intl.formatMessage({
            defaultMessage:
              "These skills will be assessed after you submit your application:",
            id: "Y7/6u6",
            description:
              "Text that appears when a user is missing transferable skills on their profile.",
          })}
          icon={<InformationCircleIcon style={{ width: "1.2rem" }} />}
          missingSkills={missingTransferableSkills}
        />
      ) : null}
      {missingOptionalSkills.length ? (
        <MissingSkillsBlock
          data-h2-background-color="base(light.dt-primary.10)"
          pillType={{ color: "primary", mode: "outline" }}
          title={intl.formatMessage({
            defaultMessage: "Nice to have skills",
            id: "CJy0kS",
            description:
              "Title that appears when a user is missing optional skills on their profile.",
          })}
          blurb={intl.formatMessage({
            defaultMessage:
              "Consider adding these asset skills to your profile:",
            id: "V3ReC1",
            description:
              "Text that appears when a user is missing optional skills on their profile",
          })}
          icon={<LightBulbIcon style={{ width: "1.2rem" }} />}
          missingSkills={missingOptionalSkills}
        />
      ) : null}
    </>
  );
};

export default MissingSkills;
