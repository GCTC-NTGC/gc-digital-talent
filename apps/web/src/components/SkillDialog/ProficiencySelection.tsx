import React from "react";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { Skill } from "~/api/generated";

// Note: These should eventually come from API, maybe?
// i.e Skill.Proficiency
export enum Proficiency {
  JUNIOR = "JUNIOR",
  INTERMEDIATE = "INTERMEDIATE",
  SENIOR = "SENIOR",
  LEAD = "LEAD",
}

interface ProficiencySelectionProps {
  selectedSkill: Skill | null;
}

const ProficiencySelection = ({ selectedSkill }: ProficiencySelectionProps) => {
  const intl = useIntl();

  if (!selectedSkill) {
    return null;
  }

  return (
    <>
      <Heading level="h2" size="h5">
        {intl.formatMessage(
          {
            defaultMessage: '2. Select your proficiency in "{skillName}"',
            id: "iluxXv",
            description: "Title for second step of claiming a skill",
          },
          {
            skillName: getLocalizedName(selectedSkill.name, intl),
          },
        )}
      </Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          id: "4ivnEQ",
          defaultMessage:
            "By self-identifying your own skill level, you help facilitate job and training opportunities that will match you more accurately.",
          description: "Help text for proficiency selection field",
        })}
      </p>
      <RadioGroup
        id="proficiency"
        name="proficiency"
        idPrefix="skill-proficiency"
        legend={intl.formatMessage({
          defaultMessage: "Level of proficiency",
          id: "zz5prq",
          description: "Label for the skill proficiency input",
        })}
        trackUnsaved={false}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: Proficiency.JUNIOR,
            label: (
              <>
                <strong>
                  {intl.formatMessage({
                    defaultMessage: "Junior level",
                    id: "lVPBw0",
                    description: "Level for the junior option for skill level",
                  })}
                </strong>
                <br />
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This level is defined as having a basic understanding of the skill's principles, but requiring ongoing oversight and mentoring during tasks.",
                    id: "wLkuWz",
                    description: "Help text for junior option for skill level",
                  })}
                </span>
              </>
            ),
          },
          {
            value: Proficiency.INTERMEDIATE,
            label: (
              <>
                <strong>
                  {intl.formatMessage({
                    defaultMessage: "Intermediate level",
                    id: "BGm6bU",
                    description:
                      "Level for the intermediate option for skill level",
                  })}
                </strong>
                <br />
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This level is defined as having more autonomy when executing the skills, and being able to facilitate self-learning when problems are presented.",
                    id: "4QK6EA",
                    description:
                      "Help text for intermediate option for skill level",
                  })}
                </span>
              </>
            ),
          },
          {
            value: Proficiency.SENIOR,
            label: (
              <>
                <strong>
                  {intl.formatMessage({
                    defaultMessage: "Senior level",
                    id: "csNmIa",
                    description: "Level for the senior option for skill level",
                  })}
                </strong>
                <br />
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This level is defined as having full autonomy when executing the skill while also being able to mentor more junior team members.",
                    id: "kvYlGv",
                    description: "Help text for senior option for skill level",
                  })}
                </span>
              </>
            ),
          },
          {
            value: Proficiency.LEAD,
            label: (
              <>
                <strong>
                  {intl.formatMessage({
                    defaultMessage: "Lead level",
                    id: "M4h4H5",
                    description: "Level for the lead option for skill level",
                  })}
                </strong>
                <br />
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "This level is defined as being able to lead and coordinate others with a range of experience in this skill, including auditing work and mentoring others.",
                    id: "NYMJ67",
                    description: "Help text for lead option for skill level",
                  })}
                </span>
              </>
            ),
          },
        ]}
      />
    </>
  );
};

export default ProficiencySelection;
