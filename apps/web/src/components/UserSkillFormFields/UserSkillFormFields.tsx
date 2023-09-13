import React from "react";
import { useIntl } from "react-intl";

import { RadioGroup } from "@gc-digital-talent/forms";
import { WhenSkillUsed } from "@gc-digital-talent/graphql";
import {
  errorMessages,
  getBehaviouralSkillLevel,
  getBehaviouralSkillLevelDefinition,
  getTechnicalSkillLevel,
  getTechnicalSkillLevelDefinition,
} from "@gc-digital-talent/i18n";

import { getSortedSkillLevels } from "~/utils/skillUtils";

import { SkillDialogContext } from "../SkillDialog/types";

interface UserSkillFormFieldsProps {
  isTechnical?: boolean;
  context?: SkillDialogContext;
}

const UserSkillFormFields = ({
  isTechnical = false,
  context,
}: UserSkillFormFieldsProps) => {
  const intl = useIntl();
  const shouldShowWhenUsedQuestion = context !== "directive_forms";

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
      <p
        data-h2-margin="base(x.15, 0, x.5, x1)"
        data-h2-color="base(black.light)"
        data-h2-font-size="base(caption)"
      >
        {intl.formatMessage(levelDefinitionGetter(skillLevel))}
      </p>
    ),
  }));

  return (
    <>
      <RadioGroup
        idPrefix="skillLevel"
        name="skillLevel"
        legend={intl.formatMessage({
          defaultMessage: "Current experience in skill",
          id: "pgQl5t",
          description: "Label for a specific skills experience level",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={levelOptions}
      />
      {shouldShowWhenUsedQuestion && (
        <RadioGroup
          idPrefix="whenSkillUsed"
          name="whenSkillUsed"
          legend={intl.formatMessage({
            defaultMessage: "Do you currently use this skill?",
            id: "PmDeul",
            description:
              "Label for field asking if a skill is currently being used",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={[
            {
              value: WhenSkillUsed.Current,
              label: intl.formatMessage({
                defaultMessage:
                  "<strong>Yes</strong>, I use this skill in my current role.",
                id: "yiqfHr",
                description: "Option for when a skill is currently being used",
              }),
            },
            {
              value: WhenSkillUsed.Past,
              label: intl.formatMessage({
                defaultMessage:
                  "<strong>No</strong>, this is a skill I've used in the past.",
                id: "ID6PLP",
                description:
                  "Option for when a skill was only used in the past",
              }),
            },
          ]}
        />
      )}
    </>
  );
};

export default UserSkillFormFields;
