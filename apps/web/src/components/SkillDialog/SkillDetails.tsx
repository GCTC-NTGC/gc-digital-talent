import React from "react";
import { useIntl } from "react-intl";

import { RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

/**
 * NOTE: Names and values are TBD, waiting on API
 */
const SkillDetails = () => {
  const intl = useIntl();

  return (
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
            value: "beginner",
            label: intl.formatMessage({
              defaultMessage: "Beginner",
              id: "karCOz",
              description: "Label for the beginner skill level",
            }),
          },
          {
            value: "intermediate",
            label: intl.formatMessage({
              defaultMessage: "Intermediate",
              id: "JzK3m/",
              description: "Label for the intermediate skill level",
            }),
          },
          {
            value: "advanced",
            label: intl.formatMessage({
              defaultMessage: "Advanced",
              id: "oZvIAg",
              description: "Label for the advanced skill level",
            }),
          },
          {
            value: "lead",
            label: intl.formatMessage({
              defaultMessage: "Lead",
              id: "9LwRRx",
              description: "Label for the lead skill level",
            }),
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
  );
};

export default SkillDetails;
