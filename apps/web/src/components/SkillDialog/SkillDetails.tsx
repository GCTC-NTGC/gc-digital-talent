import React from "react";
import { useIntl } from "react-intl";

import { RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages, getSkillLevel } from "@gc-digital-talent/i18n";
import { SkillLevel } from "@gc-digital-talent/graphql";

const SkillDetails = () => {
  const intl = useIntl();

  return (
    <>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Once you've found a skill, we ask that you give an honest evaluation of your approximate experience level. This level will be provided to hiring managers alongside any official Government of Canada skill evaluations to help provide a more holistic understanding of your abilities.",
          id: "bMY93S",
          description: "Help text for providing a skill level",
        })}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1 0)"
      >
        <RadioGroup
          name="level"
          id="level"
          idPrefix="level"
          legend={intl.formatMessage({
            defaultMessage: "Select your experience in this skill",
            id: "+clYLj",
            description: "Description for the skill level radio group",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={[
            {
              value: SkillLevel.Beginner,
              label: intl.formatMessage(getSkillLevel(SkillLevel.Beginner)),
            },
            {
              value: SkillLevel.Intermediate,
              label: intl.formatMessage(getSkillLevel(SkillLevel.Intermediate)),
            },
            {
              value: SkillLevel.Expert,
              label: intl.formatMessage(getSkillLevel(SkillLevel.Expert)),
            },
            {
              value: SkillLevel.Lead,
              label: intl.formatMessage(getSkillLevel(SkillLevel.Lead)),
            },
          ]}
        />
        <RadioGroup
          name="current"
          id="current"
          idPrefix="current"
          legend={intl.formatMessage({
            defaultMessage: "Do you currently use this skill?",
            id: "DYpwKZ",
            description: "Description for the current skill radio group",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={[
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage:
                  "<strong>Yes</strong>, I use this skill in my current role",
                id: "QU2NLF",
                description: "Label for the current skill yes option",
              }),
            },
            {
              value: "no",
              label: intl.formatMessage({
                defaultMessage:
                  "<strong>No</strong>, this is a skill I have used in the past",
                id: "TVoXiS",
                description: "Label for the current skill no option",
              }),
            },
          ]}
        />
      </div>
    </>
  );
};

export default SkillDetails;
