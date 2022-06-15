import React from "react";
import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

import { notEmpty } from "@common/helpers/util";
import type { Skill } from "../../api/generated";

import AddSkillsToExperience from "../skills/AddSkillsToExperience/AddSkillsToExperience";
import SkillsInDetail from "../skills/SkillsInDetail/SkillsInDetail";

import type { FormSkill, FormSkills } from "./types";

export interface ExperienceSkillsProps {
  skills: Skill[];
}

const ExperienceSkills: React.FC<ExperienceSkillsProps> = ({ skills }) => {
  const intl = useIntl();
  const { control, watch } = useFormContext();
  const [addedSkills, setAddedSkills] = React.useState<Skill[]>([]);
  const watchedSkills = watch("skills");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  React.useEffect(() => {
    const newSkills = notEmpty(watchedSkills)
      ? watchedSkills.map((watchedSkill: FormSkill) => {
          const newSkill = skills.find((s) => s.id === watchedSkill.skillId);
          return newSkill || undefined;
        })
      : [];
    setAddedSkills(notEmpty(newSkills) ? newSkills : []);
  }, [watchedSkills, setAddedSkills, skills]);

  const handleAddSkill = (id: string) => {
    const foundSkill = skills.find((s) => s.id === id);
    append({
      skillId: id,
      name: foundSkill?.name,
      details: "",
    });
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
      <h2 data-h2-font-size="b(h3)">
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
      <AddSkillsToExperience
        frequentSkills={[]}
        addedSkills={addedSkills || []}
        allSkills={skills}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
      />
      <SkillsInDetail
        skills={fields as FormSkills}
        onDelete={handleRemoveSkill}
      />
    </>
  );
};

export default ExperienceSkills;
