import React from "react";
import { useIntl } from "react-intl";

import { errorMessages, getSkillLevelMessages } from "@gc-digital-talent/i18n";
import { RadioGroup } from "@gc-digital-talent/forms";
import { SkillCategory } from "@gc-digital-talent/graphql";

import { getSortedSkillLevels } from "~/utils/skillUtils";

interface SkillDetailsPoolProps {
  category: SkillCategory;
}

const SkillDetailsPool = ({ category }: SkillDetailsPoolProps) => {
  const intl = useIntl();

  const levelOptions = getSortedSkillLevels().map((skillLevel) => {
    const messages = getSkillLevelMessages(skillLevel, category);
    return {
      value: skillLevel,
      label: <strong>{intl.formatMessage(messages.name)}</strong>,
      contentBelow: <p>{intl.formatMessage(messages.definition)}</p>,
    };
  });

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
