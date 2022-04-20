import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";

import type { Skill } from "../../api/generated";

import AddSkillsToExperience from "../skills/AddSkillsToExperience/AddSkillsToExperience";
import SkillsInDetail from "../skills/SkillsInDetail/SkillsInDetail";

type FormValues = {
  skills: { [id: string]: { details: string } };
};

export interface ExperienceSkillsProps {
  skills: Skill[];
  initialSkills?: { [id: string]: { details: string } };
}

const ExperienceSkills: React.FC<ExperienceSkillsProps> = ({
  skills,
  initialSkills,
}) => {
  const intl = useIntl();
  const { setValue, watch } = useForm();
  const watchedSkills = watch("skills", initialSkills);
  const [addedSkills, setAddedSkills] = React.useState<Skill[]>([]);

  const updateAddedSkills = () => {
    if (watchedSkills) {
      const newAddedSkills = skills.filter((skill) =>
        Object.keys(watchedSkills).includes(skill.id),
      );
      setAddedSkills(newAddedSkills);
    }
  };

  /**
   * Updates an array of skills currently added to experience
   */
  useEffect(updateAddedSkills, [watchedSkills, skills]);

  const handleAddSkill = (id: string) => {
    const newSkills = { ...watchedSkills, [id]: { details: "" } };
    setValue("skills", newSkills);
  };

  const handleRemoveSkill = (id: string) => {
    const newSkills = Object.keys(watchedSkills).reduce(
      (object: FormValues["skills"], key) => {
        if (key !== id) {
          // eslint-disable-next-line no-param-reassign
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
