import React from "react";
import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

import SkillPicker from "@common/components/skills/SkillPicker";
import { notEmpty } from "@common/helpers/util";
import type { Skill } from "../../api/generated";

import SkillsInDetail from "../skills/SkillsInDetail/SkillsInDetail";

import type { FormSkill, FormSkills } from "./types";

export interface ExperienceSkillsProps {
  skills: Skill[];
}

const ExperienceSkills: React.FC<ExperienceSkillsProps> = ({ skills }) => {
  const intl = useIntl();
  const { control, watch } = useFormContext();
  const [addedSkills, setAddedSkills] = React.useState<Skill[]>([]);
  const watchedSkills: FormSkills = watch("skills");
  const { fields, remove, replace } = useFieldArray({
    control,
    name: "skills",
  });

  React.useEffect(() => {
    const newSkills = notEmpty(watchedSkills)
      ? watchedSkills
          .map((watchedSkill: FormSkill) => {
            const newSkill = skills.find((s) => s.id === watchedSkill.skillId);
            return newSkill || undefined;
          })
          .filter(notEmpty)
      : [];
    setAddedSkills(notEmpty(newSkills) ? newSkills : []);
  }, [watchedSkills, setAddedSkills, skills]);

  const handleChange = (newSkills: Skill[]) => {
    const massagedSkills = newSkills.map((newSkill) => {
      const existing = watchedSkills.find(
        (skill) => skill.skillId === newSkill.id,
      );

      return {
        skillId: newSkill.id,
        name: newSkill.name,
        details: existing ? existing.details : "",
      };
    });

    replace(massagedSkills);
  };

  const handleRemoveSkill = (id: string) => {
    const index = watchedSkills.findIndex(
      (field: FormSkill) => field.skillId === id,
    );
    if (index >= 0) {
      remove(index);
    }
  };

  return (
    <>
      <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "2. Skills displayed during this experience",
          description: "Title for skills on Experience form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Select skills that match the abilities you displayed during this experience period. You will explain how you used them in the next step.",
          description: "Description blurb for skills on Experience form",
        })}
      </p>
      <SkillPicker
        skills={skills || []}
        onChange={handleChange}
        selectedSkills={addedSkills || []}
      />
      <SkillsInDetail
        skills={fields as FormSkills}
        onDelete={handleRemoveSkill}
      />
    </>
  );
};

export default ExperienceSkills;
