import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useIntl } from "react-intl";

import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Button, Heading } from "@gc-digital-talent/ui";
import { Select } from "@gc-digital-talent/forms";

import { AnyExperience } from "~/types/experience";
import { Skill } from "~/api/generated";
import { getExperienceTitle } from "~/utils/experienceUtils";

import ExperienceHelpMessage from "./ExperienceHelpMessage";
import DetailsTextArea from "./DetailsTextArea";

interface AddExperiencesProps {
  experiences?: AnyExperience[];
  selectedSkill: Skill | null;
}

const AddExperiences = ({
  experiences,
  selectedSkill,
}: AddExperiencesProps) => {
  const intl = useIntl();
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experienceSkills",
  });

  if (!selectedSkill || !experiences || experiences.length <= 0) {
    return null;
  }

  const skillName = getLocalizedName(selectedSkill.name, intl);

  return (
    <>
      <Heading level="h2" size="h5">
        {intl.formatMessage(
          {
            defaultMessage: '3. Highlight your experiences in "{skillName}"',
            id: "JFcptg",
            description: "Title for third step of claiming a skill",
          },
          {
            skillName,
          },
        )}
      </Heading>
      <ExperienceHelpMessage />
      <div data-h2-margin="base(x1, 0)">
        {fields.map((field, index) => (
          <div
            key={field.id}
            data-h2-border="base(left, x.25, solid, tm-purple)"
            data-h2-margin="base(x1, 0)"
            data-h2-padding="base(0, 0, 0, x1)"
          >
            <Select
              name={`experienceSkills.${index}.experience`}
              id={`experienceSkills.${index}.experience`}
              trackUnsaved={false}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              label={intl.formatMessage({
                defaultMessage: "Select the experience to link",
                id: "n8SPx3",
                description:
                  "Label for selecting an experience in the skill picker",
              })}
              options={experiences.map((experience) => ({
                value: experience.id,
                label: getExperienceTitle(experience, intl),
              }))}
            />
            <DetailsTextArea
              name={`experienceSkills.${index}.details`}
              id={`experienceSkills.${index}.details`}
              required
              skillName={skillName}
            />
            <Button
              type="button"
              mode="inline"
              color="red"
              onClick={() => remove(index)}
            >
              {intl.formatMessage(
                {
                  defaultMessage: "Remove experience<hidden> {index}</hidden>",
                  id: "opImdS",
                  description:
                    "Button text to remove an experience from skill experiences",
                },
                { index: index + 1 },
              )}
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        color="purple"
        block
        onClick={() => {
          append({
            experience: "",
            details: "",
          });
        }}
      >
        {intl.formatMessage({
          defaultMessage: "Add experience",
          id: "d94vZ+",
          description: "Button text to add an experience to skill experiences",
        })}
      </Button>
    </>
  );
};

export type { AnyExperience };
export default AddExperiences;
