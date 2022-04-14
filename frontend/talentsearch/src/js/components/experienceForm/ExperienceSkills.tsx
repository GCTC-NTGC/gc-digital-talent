import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import type { Skill } from "@common/api/generated";
import { useForm } from "react-hook-form";

import AddSkillsToExperience from "../skills/AddSkillsToExperience/AddSkillsToExperience";
import SkillsInDetail from "../skills/SkillsInDetail/SkillsInDetail";

type FormValues = {
  skills: { [id: string]: { details: string } };
};

export interface ExperienceSkillsProps {
  skills: Skill[];
}

const ExperienceSkills: React.FC<ExperienceSkillsProps> = ({ skills }) => {
  const intl = useIntl();
  const { setValue, watch } = useForm();
  const watchedSkills = watch("skills");
  const [addedSkills, setAddedSkills] = React.useState<Skill[]>([]);

  /**
   * Updates an array of skills currently added to experience
   */
  useEffect(() => {
    if (watchedSkills) {
      const newAddedSkills = skills.filter((skill) =>
        Object.keys(watchedSkills).includes(skill.id),
      );
      setAddedSkills(newAddedSkills);
    }
  }, [watchedSkills, skills]);

  const handleAddSkill = (id: string) => {
    const newSkills = { ...watchedSkills, [id]: { details: "" } };
    setValue("skills", newSkills);
  };

  const handleRemoveSkill = (id: string) => {
    const newSkills = Object.keys(watchedSkills).reduce(
      (object: FormValues["skills"], key) => {
        if (key !== id) {
          object[key] = watchedSkills[key];
        }
        return object;
      },
      {},
    );
    setValue("skills", newSkills);
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
        addedSkills={addedSkills}
        allSkills={skills}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
      />
      <SkillsInDetail skills={addedSkills} onDelete={handleRemoveSkill} />
    </>
  );
};

export default ExperienceSkills;
