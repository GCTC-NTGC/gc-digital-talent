import React from "react";
import { useIntl } from "react-intl";

import {
  errorMessages,
  getBehaviouralSkillLevel,
  getBehaviouralSkillLevelDefinition,
  getTechnicalSkillLevel,
  getTechnicalSkillLevelDefinition,
} from "@gc-digital-talent/i18n";
import { RadioGroup } from "@gc-digital-talent/forms";

import { getSortedSkillLevels } from "~/utils/skillUtils";

interface SkillDetailsPoolProps {
  isTechnical?: boolean;
}

const SkillDetailsPool = ({ isTechnical = false }: SkillDetailsPoolProps) => {
  const intl = useIntl();

  const levelGetter = isTechnical
    ? getTechnicalSkillLevel
    : getBehaviouralSkillLevel;
  const levelDefinitionGetter = isTechnical
    ? getTechnicalSkillLevelDefinition
    : getBehaviouralSkillLevelDefinition;
  const levelOptions = getSortedSkillLevels().map((skillLevel) => ({
    value: skillLevel,
    label: <strong>{intl.formatMessage(levelGetter(skillLevel))}</strong>,
    contentBelow: (
      <p>{intl.formatMessage(levelDefinitionGetter(skillLevel))}</p>
    ),
  }));

  return (
    <>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Now that you've selected a skill, please indicate the level applicants will need to demonstrate it at.",
          id: "Vw7bLe",
          description: "Help text for setting required skill levels",
        })}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1 0)"
      >
        <RadioGroup
          idPrefix="skillLevel"
          name="skillLevel"
          legend={intl.formatMessage({
            defaultMessage: "Select your current skill level",
            id: "Q6jULV",
            description: "Label for required skill level select",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={levelOptions}
        />
      </div>
    </>
  );
};

export default SkillDetailsPool;
